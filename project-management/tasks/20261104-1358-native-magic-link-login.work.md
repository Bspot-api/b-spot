# Magic-link login works in the native app — work

Created by the Crewmate at the plan step, 2026-11-04. Spec:
`project-management/tasks/20261104-1358-native-magic-link-login.spec.md`.

**Plan:** approved by the Architect, 2026-11-04, with the human's rulings (see Rulings).

## Program Design

Grounded in commit `a956180` on `feat/native-magic-link-login`, the
installed packages (`better-auth` 1.6.12 in `apps/api`, Expo 54,
`expo-secure-store` 15.0.8, `expo-linking` 8, `expo-constants` 18 in
`apps/mobile`) and `@better-auth/expo` 1.6.12 read from its npm tarball.
Every path is real unless marked **new**.

### The defect, seen on the simulator

A probe Maestro flow (never committed) ran against the e2e environment
under the lock. Its log and screenshots are in the session scratchpad,
under `native-login/probe-run.log` and `native-login/probe/`. The flow
requested a link for `login@e2e.test` in the app, then opened it with
`openLink`, as a mail client hands it over.

- Safari opened the link and showed the API's
  `{"message":"Cannot GET /","statusCode":404}`. That is the redirect to
  `callbackURL=/` on the API's origin.
- Brought back to the foreground, the app still showed
  "Vérifiez votre boîte mail" after 12 s of polling. The flow's final
  assertion on `login-sent` passed.
- `b_spot_e2e.session` held one row for `login@e2e.test`, whose user agent
  was **Safari's** (`Version/26.5 Mobile/15E148 Safari/604.1`). The
  session exists, but in the wrong cookie jar. That is what the spec's
  Context predicted.

### Better-Auth behaviour, checked offline

A Node script in the scratchpad (`native-login/probe-ba/probe.mjs`) ran
the installed `better-auth` 1.6.12 with a memory adapter,
`advanced.disableOriginCheck: false` and `NODE_ENV=production`. It ran
once without `@better-auth/expo` 1.6.12's server plugin and once with it.

| Request | Without `expo()` | With `expo()` |
|---|---|---|
| sign-in, `callbackURL: bspot-dev://auth/callback` | 200 (scheme trusted) | 200 |
| verify the emailed link | 302 `bspot-dev://auth/callback` | 302 `bspot-dev://auth/callback?cookie=better-auth.session_token%3D…` |
| get-session with that cookie, no Origin | 200 | 200 |
| sign-out with the cookie, no Origin | **403 `MISSING_OR_NULL_ORIGIN`** | **403** |
| sign-out, `expo-origin: evil://` | 403 | 403 `Invalid origin` |
| sign-out, `expo-origin: bspot-dev://` | 403 | **200** |
| sign-in, `callbackURL: evil://steal` | 403 | 403 |

Two things follow from the table. Native sign-out fails in production, as
the spec says. And `expo()` does the two server-side jobs this task needs:
it puts the cookie in the app redirect, and it accepts the app origin from
a header native fetch is allowed to send.

Sources:
- `better-auth/dist/plugins/magic-link/index.mjs`: verify sets the cookie,
  then redirects.
- `dist/api/middlewares/origin-check.mjs`: a POST that carries a cookie
  needs a trusted Origin.
- `dist/context/create-context.mjs`: `skipOriginCheck` defaults to
  `isTest()`, which is why the e2e API (`NODE_ENV=test`) hides the 403.
- `dist/auth/trusted-origins.mjs`: a non-http trusted entry matches by
  prefix, so `bspot://` matches `bspot://auth/callback`.

### Choice: the maintained server plugin, and a small hand-written client

**Server: `@better-auth/expo`'s `expo()` plugin (adopted).** It is
version-locked to `better-auth` (peer `^1.6.12`, the same `better-call`
1.3.5 and `zod` 4). It is ESM like `better-auth`, which the API already
loads (Node 24 `require(esm)`). It does three things:
- **The cookie in the redirect.** An after-hook on `/magic-link/verify`
  copies `Set-Cookie` into the redirect as `?cookie=`. It does this only
  when the redirect uses a custom scheme and that scheme is a trusted
  origin.
- **The app origin.** `onRequest` turns the `expo-origin` header into
  `Origin`, but only when the request has no Origin. Browsers always send
  one on a cross-origin POST, and CORS blocks a custom `expo-origin` from
  other web origins.
- **`exp://`.** It trusts `exp://` (Expo Go) under
  `NODE_ENV=development` only. B-Spot uses a dev build, so this is
  harmless.

**Client: `@better-auth/expo/client` not adopted; a ~60-line hand-written
session transport instead (decision open, see below).** Why:
- **It does not cover magic links.** Its `expoClient` handles redirects
  only for social sign-in, through
  `expo-web-browser.openAuthSessionAsync`. A magic link opened from Mail
  arrives as an ordinary deep link, so the code that reads `?cookie=` must
  be written by hand either way. It would also have to write into the
  plugin's storage key (`<prefix>_cookie`, a naming detail that is not
  exported).
- **It means a second client.** It works through `createAuthClient`, which
  means adding `better-auth` to `apps/mobile`. The admin endpoints (Nest
  controllers) would stay on `apiFetch` and read `authClient.getCookie()`:
  two clients for one cookie.
- **It needs `expo-network`, likely with a new build.** Its online manager
  does `import("expo-network")` outside any try block. The package is not
  installed, and the installed dev build does not link it (the binary has
  `ExpoSecureStore` and no `ExpoNetwork`). Metro most likely refuses to
  bundle an unresolvable static `import()`; this is not verified, because
  the brief forbids installs. Installing it adds a native module: a new dev
  build now, and a store build instead of an OTA update (`expo-updates` is
  installed) for production users.
- **The hand-written path needs no native change.** `ExpoSecureStore` is
  already in the installed dev build (checked in
  `BSpotDev.debug.dylib`), and so are `expo-linking` and `expo-constants`.

If the Architect prefers the full client anyway, the API design below is
unchanged. The mobile part becomes `createAuthClient` +
`expoClient({ storage: SecureStore, scheme })` + `magicLinkClient()`, plus
`expo-network` and a new dev build.

### API changes

- `apps/api/package.json`: add `@better-auth/expo` at exactly `1.6.12`,
  matching the installed `better-auth`.
- **new** `apps/api/src/modules/auth/trusted-origins.ts`, pure, with no
  `better-auth` import, so Jest can load it:
  ```ts
  export const DEFAULT_APP_ORIGINS = ['bspot://'] as const;
  export function parseAppOrigins(raw: string | undefined): string[];          // "a://,b://" → list; unset → DEFAULT_APP_ORIGINS
  export function buildTrustedOrigins(input: {
    baseURL: string; corsOrigin: string; appOrigins: readonly string[];
  }): string[];                                                                // today's rule + appOrigins
  ```
  Today's rule is kept: `CORS_ORIGIN='*'` gives `[baseURL]`; otherwise
  `[baseURL, ...CORS_ORIGIN]`. The app origins are always appended, whatever
  CORS says.
- `auth.config.ts`:
  - `getBetterAuthConfigFromEnv` reads `AUTH_APP_ORIGINS` through
    `parseAppOrigins` and builds the list with `buildTrustedOrigins`.
  - `createBetterAuth` adds `expo()` after `magicLink(...)`, and sets
    `advanced.disableOriginCheck: false`, with a comment. That enforces the
    production origin and CSRF checks in every environment, `NODE_ENV=test`
    included (see "How native-sign-out is checked").
- **Callback handling** needs no new endpoint. Verify redirects to the
  callback the app sent, and `expo()` appends the cookie. An invalid or
  used token redirects to the same callback with `?error=INVALID_TOKEN` and
  no cookie (`errorCallbackURL` defaults to `callbackURL`).
- **The admin-only gate** in `auth.service.ts` (`sendMagicLink`) is
  untouched.
- `apps/api/.env.example` gains
  `AUTH_APP_ORIGINS=bspot://,bspot-dev://`, with a comment saying
  production keeps only `bspot://`.
- **new** `apps/api/src/modules/auth/__tests__/trusted-origins.spec.ts`
  covers: unset gives `bspot://`; a list is parsed and trimmed; with
  `CORS_ORIGIN='*'` the result is the base URL plus app origins; with a
  list, the CORS origins are kept and the app origins added.

### Mobile changes

The seam is one module the client asks how to authenticate a request.
Platform files carry the difference, as `(tabs)/_layout.web.tsx` already
does.

- **new** `apps/mobile/src/features/auth/sessionCookie.ts`, pure:
  ```ts
  /** `name=value` of the Better-Auth session cookie in a Set-Cookie value (plain or `__Secure-` name); null when absent or Max-Age<=0. */
  export function extractSessionCookie(setCookie: string): string | null;
  export type AuthCallback =
    | { kind: 'session'; cookie: string }
    | { kind: 'error'; code: string }
    | { kind: 'invalid' };
  /** Reads the deep-link params `cookie` / `error` of `<scheme>://auth/callback`. */
  export function readAuthCallback(params: { cookie?: string; error?: string }): AuthCallback;
  ```
  Production serves the API over https, so Better-Auth names the cookie
  `__Secure-better-auth.session_token`. Both names are tested.
- **new** `apps/mobile/src/features/auth/sessionStore.ts`, native: the
  cookie lives in `expo-secure-store` (the Keychain), under
  `bspot.session_cookie`, cached in memory and loaded once (a memoized
  promise).
  `getSessionCookie(): Promise<string | null>`,
  `saveSessionCookie(cookie)`, `clearSessionCookie()`.
  **new** `sessionStore.web.ts`: the same functions, all no-ops returning
  null. On the web the browser's cookie jar keeps the session, as today.
- **new** `apps/mobile/src/api/authTransport.ts`, native:
  - `getAuthRequestInit(): Promise<{ credentials: 'omit'; headers: Record<string, string> }>`
    returns `cookie` when a session is stored, and always
    `expo-origin: <scheme>://`.
  - `getMagicLinkCallbackURL(): string` returns `<scheme>://auth/callback`.
  - The scheme is read from `Constants.expoConfig.scheme`: `bspot-dev` in
    the dev build (the e2e Metro runs with `APP_VARIANT=development`),
    `bspot` in production.
  - `credentials: 'omit'` keeps iOS's own cookie jar out of the way of the
    header.

  **new** `authTransport.web.ts`: `{ credentials: 'include', headers: {} }`
  and `undefined`.
- `apps/mobile/src/api/client.ts`:
  - `apiFetch` merges `getAuthRequestInit()`. `credentials: 'include'`
    becomes the web value.
  - `signInMagicLink` sends `callbackURL` only when
    `getMagicLinkCallbackURL()` returns one, so web requests are unchanged.
- `apps/mobile/src/features/auth/hooks/useAuth.ts`: `signOut` calls the API
  in a `try`, then calls `clearSessionCookie()` and invalidates `['auth']`
  in `finally`.
- **new** `apps/mobile/app/auth/callback.tsx`, the deep link
  `<scheme>://auth/callback?cookie=…`. It uses `useLocalSearchParams` and
  `readAuthCallback`:
  - **`session`:** `saveSessionCookie`, then `invalidateQueries(['auth'])`,
    then leaves for the Scanner tab with the login modal dismissed
    (`router.dismissAll()` when the stack can dismiss, then
    `router.replace('/')`).
  - **`error`:** toast "Ce lien de connexion n'est plus valide. Demandez-en
    un nouveau.", then `router.replace('/login')`.
  - **`invalid`:** `router.replace('/')`.

  The screen shows a spinner, and `app/_layout.tsx` registers it with
  `headerShown: false`. The same route works on a cold start, because
  Expo Router opens the initial URL.
- **The 401 path is unchanged** (`QueryCache.onError` in `app/_layout.tsx`).
  An expired session leaves a stale cookie in the store, but get-session
  answers null with it, so the app shows the logged-out state. The cookie
  is replaced at the next login or cleared at sign-out.
- **The login screen is unchanged**, polling included: the web still
  relies on it. On native, the deep link writes the cookie, and the
  invalidation does the rest.
- **new** `apps/mobile/src/features/auth/__tests__/sessionCookie.test.ts`
  covers: a plain name; a `__Secure-` name; several cookies in one header;
  `Max-Age=0`; a header without a session cookie; the three callback
  outcomes.

### How web login stays unchanged

On the web, the transport returns `credentials: 'include'` and no extra
headers, and it sends no `callbackURL`. The request bytes are then the same
as today, so the link still redirects to `/` on the API. The session store
is a no-op on the web. The web never opens `auth/callback`. Origin checks
are now enforced under `NODE_ENV=test`, but this changes nothing for the
web:
- the e2e web origin (`CORS_ORIGIN`, `:8182`) is trusted;
- browsers send `Origin`;
- `NODE_ENV=development` already enforced these checks.

`pnpm e2e:web` proves it (`web-login-unchanged`).

### How native-sign-out is checked with production-like origin checks

Running the e2e API with `NODE_ENV=production` would also turn on
Better-Auth's rate limit: 5 magic-link requests per minute per IP, and
every e2e login comes from localhost. It would also change the cookie
naming paths. So the check uses the production origin rules instead,
explicitly: `disableOriginCheck: false`, in every environment.

1. **new** `apps/e2e/checks/native-auth.spec.ts` runs in the Playwright
   `environment` project (`pnpm e2e:web`), against the built API, at the
   HTTP level, as the native app talks to it:
   - Request a link for a dedicated admin, `native-check@e2e.test` (added
     to `E2E_USERS`), with `callbackURL: bspot-dev://auth/callback`.
   - Get the link from MailDev and GET it without following redirects. It
     answers 302, and the Location starts with
     `bspot-dev://auth/callback?cookie=`.
   - get-session with that cookie answers 200, with the user.
   - sign-out with the cookie and no Origin answers 403 (the guard is on).
   - sign-out with `expo-origin: bspot-dev://` answers 2xx.
   - get-session then answers null.
2. **The Maestro `login` flow** taps `admin-sign-out`, then asks the
   control server how many sessions the user still has, and expects 0.
   Better-Auth deletes the row only when sign-out passes the origin check.
   The UI alone would not prove it, because the app clears its cookie even
   when the call fails.

### The four Maestro auth flows

A new subflow, `apps/e2e/maestro/common/login.yaml`, with `EMAIL` in its
env:
1. Tap `nav-login-link`, fill `login-email-input`, tap `login-submit`, see
   `login-sent`.
2. `runScript ../scripts/magic-link.js` sets `output.link`.
3. `openLink ${output.link}` opens Safari, which follows the 302 to
   `bspot-dev://auth/callback?cookie=…`.
4. `extendedWaitUntil` "Ouvrir|Open" (iOS's "Ouvrir dans « B-Spot Dev » ?"),
   then tap it.
5. `extendedWaitUntil` `nav-login-link` shows `${EMAIL}`.

`open-link.yaml` is not reused here: its `when visible` check runs before
Safari has redirected.

The flows (folder `apps/e2e/maestro/flows/`), each starting with
`start-clean.yaml`:
- **`login`** (`login@e2e.test`):
  - The header shows the email, and the Admin tab is visible.
  - A relaunch without `clearState` keeps the user logged in (the cookie is
    persisted). The relaunch goes through **new** `common/relaunch.yaml`:
    `launchApp {stopApp: true}`, then `load-bundle.yaml` if the dev
    launcher shows.
  - Admin tab, then `admin-sign-out`: the header reads "Se connecter" and
    the Admin tab is gone.
  - `GET /sessions?email=` returns `{count: 0}`.
- **`admin-entry`** (`login@e2e.test`):
  - After login, the Admin tab leads to `admin-profile-email` showing the
    email.
  - Then `POST /admins/revoke?email=`, and a relaunch: the Admin tab is
    gone, and the header still shows the email. "Regular user" means a
    demoted admin, per the parent spec's amended row.
- **`moderation`** (`moderation@e2e.test`):
  - A script posts four suggestions to the public
    `POST ${API_URL}/api/brand-suggestions`, as the web `beforeEach` does.
  - Then login, Admin tab, the suggestions screen.
  - Approve, then edit through the bottom sheet
    (`suggestion-edit-brand-input`, `suggestion-edit-save`), then reject
    and delete through the native confirm alert, matched by its button
    text.
  - Assertions are on cards and tabs, as on the web.
- **`session-expiry`** (`expiry@e2e.test`):
  - Login, Admin tab, the suggestions screen, `suggestions-empty`.
  - `POST /sessions/expire?email=`, then tap `suggestions-tab-approved`.
  - The toast "Votre session a expirée. Reconnectez-vous." and
    `login-email-input` show.
  - Back to the Scanner tab: "Se connecter" shows, and the Admin tab is
    absent.

`config.yaml` `flowsOrder`: the four existing flows, then `login`,
`admin-entry`, `moderation`, `session-expiry`.

**New control-server routes** in `apps/e2e/env/ios/control-server.ts`.
Each is one line over the existing helpers. Parameters go in the query,
since a `Route` takes the URL.

| Route | Calls |
|---|---|
| `GET /magic-link?email=` | `fetchLatestMagicLink({ email, since: lastResetAt })`. `POST /reset` records `lastResetAt`, so a link left in MailDev by an earlier flow is never picked up. |
| `POST /sessions/expire?email=` | `expireSessionsOf(email)` → `{count}` |
| `POST /admins/revoke?email=` | `revokeAdminRole(email)` |
| `GET /sessions?email=` | **new** `countSessionsOf(email)` in `support/db.ts` → `{count}` |

- `maestro-env.ts` gains `API_URL`, `LOGIN_EMAIL`, `MODERATION_EMAIL` and
  `EXPIRY_EMAIL` (from `E2E_USERS`).
- `buildApiEnv()` gains `AUTH_APP_ORIGINS: \`${DEV_SCHEME}://\``.
- New one-call scripts: `magic-link.js`, `expire-sessions.js`,
  `revoke-admin.js`, `count-sessions.js`, `create-suggestions.js`. That
  makes 8 files in `maestro/scripts/`, and 9 in `maestro/flows/`.

### Test order

1. **API.** `trusted-origins.spec.ts` red, then `trusted-origins.ts` green.
   Then `auth.config.ts` with `expo()` and `disableOriginCheck: false`,
   and the `@better-auth/expo` install.
2. **e2e check.** `checks/native-auth.spec.ts` is red on the current API
   (no `?cookie=`, and the 403 is skipped under test), then green after
   step 1. Run the full `pnpm e2e:web`: with origin checks now enforced, it
   also proves `web-login-unchanged`.
3. **Mobile pure units.** `sessionCookie.test.ts` red, then green.
4. **Mobile wiring.** Session store, transport, `client.ts`, `useAuth`,
   `auth/callback.tsx`. Then `pnpm --filter mobile test` and a lint.
5. **Maestro `login`.** Control routes, `common/login.yaml`, the flow.
   - Red on step 3's code (the defect seen above), green with step 4.
   - A red run with a wrong `LOGIN_EMAIL` must fail and exit 1.
6. **Maestro `admin-entry`, `session-expiry`, `moderation`**, one by one,
   each red with a wrong expected value first.
7. **Closing runs.** Two consecutive green `pnpm e2e:mobile`, one
   `pnpm e2e:web`, then `pnpm lint && pnpm test && pnpm build`.
8. **The `.env` run.** One `pnpm e2e:mobile` with a worktree
   `apps/mobile/.env` holding `EXPO_PUBLIC_API_URL=http://localhost:3001`,
   which is then removed. The README "iOS (Maestro)" and `.env.example`
   are updated.

Every environment run takes the shared lock (`mkdir …/scratchpad/e2e.lock`,
released by `trap`) and logs to `…/scratchpad/native-login/`.

### Decisions left open (for the Architect; security ones flagged)

1. **Client half of `@better-auth/expo`.** Hand-written transport
   (recommended), or the full `expoClient`. The spec prefers the
   maintained integration. The server half is adopted. The client half
   does not handle magic-link deep links, and likely needs `expo-network`
   and a new native build.
2. **🔒 Which app schemes the API trusts.** `AUTH_APP_ORIGINS`, defaulting
   to `bspot://`. `bspot-dev://` would be trusted only where the variable
   says so (local `.env`, e2e), never in production by default.
3. **🔒 Origin checks enforced in every environment**
   (`disableOriginCheck: false`). This replaces "run the e2e API with
   `NODE_ENV=production`", which would also turn on the rate limit and
   break the suites. In development nothing changes. In test, the check
   becomes real.
4. **🔒 The session token travels in the deep link**
   (`bspot://auth/callback?cookie=…`). iOS does not guarantee that a custom
   scheme belongs to one app. A malicious app claiming `bspot://`, plus an
   attacker-triggered link email to an admin, could capture a session.
   This is inherent to the Expo plugin and to any custom-scheme callback.
   Recommendation: accept it for this admin-only login, and record it.
   Universal links (https, associated domains) are the real fix: a later
   task, which needs a domain.
5. **🔒 Token storage.** The cookie goes in the Keychain through
   `expo-secure-store`, never in AsyncStorage. Keychain items survive an
   app reinstall on iOS, so a reinstall within the 7-day session stays
   logged in. Accept.
6. **The Safari tab also holds the cookie.** Verify sets it before the
   redirect, and the probe saw the row with Safari's user agent. It is the
   same session, so app sign-out ends it everywhere. Accept, with no
   stripping hook.
7. **User-visible: native sign-out clears the local session even when the
   API call fails.** The tests prove the 2xx through the session count.
   Recommend.
8. **User-visible: a used or expired link opened on the phone.** It shows
   "Ce lien de connexion n'est plus valide. Demandez-en un nouveau." and
   the login screen. Today nothing happens. The copy is to approve.
9. **Developer workflow.** `pnpm dev:mobile` runs `expo start` without
   `APP_VARIANT`, so the manifest scheme is `bspot`, while the dev build
   answers `bspot-dev`. The callback would then open the production app,
   or nothing. Recommendation: set `APP_VARIANT=development` in
   `apps/mobile`'s `dev` and `start` scripts.
10. **Sequencing with the split-admin-suggestions task.** The `moderation`
    flow drives the admin suggestions screen, which that task changes.
    Recommendation: write `moderation` last, against whichever version of
    the screen is on the branch then. Re-base on that task if it merges
    first.

### Contradictions with the spec

- **Seam "Callback".** The spec says the callback is "the web origin on
  web". Today the web sends no `callbackURL` (the redirect lands on the
  API's `/`), and "web login keeps working as today" is the criterion. The
  plan keeps the web byte-for-byte unchanged and adds a callback only on
  native.
- **`native-sign-out`.** The spec says "`NODE_ENV=production` settings for
  origin checks". The plan meets it with the production origin rules
  enforced explicitly, not with `NODE_ENV=production` (open decision 3).
- **The callback scheme.** The spec says `bspot://`. In the dev build and
  e2e it is `bspot-dev://`, and production stays `bspot://`.

## Worklog

- 2026-11-04 (plan): read the spec, the slice-02 work document, the
  env-bug task, the API auth module, the mobile auth code and the e2e
  harness. Ran `pnpm install`. Probe Maestro flow under the lock (passed in
  57 s: the defect is confirmed); the probe files were removed. Offline
  Better-Auth probe with and without `expo()`. No implementation code.

## Implementation Checkboxes

- [ ] API: `trusted-origins.ts` + spec, `expo()` plugin, `disableOriginCheck: false`, `AUTH_APP_ORIGINS`, `.env.example`
- [ ] e2e: `checks/native-auth.spec.ts`, `E2E_USERS` native-check user, `AUTH_APP_ORIGINS` in `buildApiEnv`; green `pnpm e2e:web`
- [ ] Mobile: `sessionCookie.ts` + tests
- [ ] Mobile: session store, auth transport, `client.ts`, `useAuth.signOut`, `app/auth/callback.tsx`
- [ ] Control-server routes, `countSessionsOf`, Maestro env, scripts, `common/login.yaml`, `common/relaunch.yaml`
- [ ] Flow `login` (incl. sign-out session count)
- [ ] Flow `admin-entry`
- [ ] Flow `session-expiry`
- [ ] Flow `moderation`
- [ ] Two consecutive green `pnpm e2e:mobile`; green `pnpm e2e:web`
- [ ] `pnpm e2e:mobile` with a worktree `apps/mobile/.env` at 3001 (then removed)
- [ ] Gates: `pnpm lint`, `pnpm test`, `pnpm build`
- [ ] README "iOS (Maestro)" and auth notes

## Notes & Snippets

- `@better-auth/expo` 1.6.12, `peerDependencies`: `better-auth ^1.6.12`,
  `@better-auth/core ^1.6.12`, and, all optional, `expo-linking >=7`,
  `expo-constants >=17`, `expo-network >=8.0.7`, `expo-web-browser >=14`.
  The dist-tags show `release-1.6` at 1.6.34 and `latest` at 1.7.16. The
  plan pins 1.6.12 to match the installed `better-auth`.
- Dev build on the simulator: `CFBundleURLSchemes` = `bspot-dev`,
  `com.bspot.mobile.dev`, `exp+b-spot`.
- `expo-linking`'s `resolveScheme` takes the scheme from
  `Constants.expoConfig`, the Metro manifest in a dev client. Hence open
  decision 9.
- iOS `clearState` does not wipe the Keychain. After `/reset` truncates
  `session`, a cookie left by an earlier flow is stale, get-session answers
  null, and the flow starts logged out as before. If that ever proves
  flaky, `start-clean` can open `bspot-dev://auth/callback?error=reset`, or
  the app can clear the store on a null session. To decide while coding.

### Rulings — 2026-11-04

Human, via the Architect:
- **Server-only `@better-auth/expo`**: approved. Use the API `expo()`
  plugin, pinned to 1.6.12, with a small hand-written mobile side. No
  `expoClient` and no new native module.
- **Session token in the custom-scheme callback URL**: accepted for this
  admin-only login, and documented. Write the risk as an ADR in
  `docs/adr/`, as §G of `.agents/project.md` asks. Universal links (https)
  come later, in a task that needs a domain.
- **Copy for an invalid or expired link**: approved as proposed: "Ce lien de
  connexion n'est plus valide. Demandez-en un nouveau.", then the login
  screen.

Architect:
- **Trusted schemes** (`AUTH_APP_ORIGINS`): `bspot://` by default.
  `bspot-dev://` only where the env sets it (dev, e2e), never in production
  by default.
- **Origin checks** (`disableOriginCheck: false`): forced on in every
  environment, rather than running e2e with `NODE_ENV=production`. This
  meets `native-sign-out`. The spec is amended.
- **Session cookie**: stored in the Keychain through SecureStore, never in
  AsyncStorage. Surviving a reinstall within the 7-day session is
  accepted. That Safari keeps the same session is accepted.
- **Native sign-out**: always clears the local session, even if the API
  call fails.
- **`APP_VARIANT=development`** in the mobile `dev` and `start` scripts: yes.
  Say so in the README.
- **Sequencing**: the branch already carries the merged split of the admin
  suggestions screen (`src/features/admin/`). Write the moderation flow
  against it, last, as planned.
- **Web**: unchanged. It sends no `callbackURL`, and polling stays.

## Diff-Review Findings

_(filled at the review step)_
