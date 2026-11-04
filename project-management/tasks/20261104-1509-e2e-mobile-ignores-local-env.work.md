# `pnpm e2e:mobile` ignores the developer's local `.env` — work

Created by the Crewmate at the plan step, 2026-11-04. Spec:
`project-management/tasks/20261104-1509-e2e-mobile-ignores-local-env.spec.md`.

**Plan:** approved by the Architect, 2026-11-04 (see Rulings).

## Program Design

### The mechanism (found, then proven)

Expo 54 resolves `process.env.EXPO_PUBLIC_*` in a development bundle in
three places. The packages are those resolved from `apps/mobile`:
`@expo/metro-config` 54.0.14, `babel-preset-expo` 54.0.10, `@expo/env`
2.0.8, `@expo/cli` 54.0.23.

1. **Babel** (`babel-preset-expo/build/inline-env-vars.js`): in development,
   `process.env.EXPO_PUBLIC_X` becomes `env.EXPO_PUBLIC_X`, imported from
   `expo/virtual/env`. In production it is inlined from the transform
   worker's `process.env`.
2. **The virtual env module**
   (`@expo/metro-config/build/transform-worker/transform-worker.js`, the
   branch on `expo/virtual/env.js`): in development, for client bundles,
   its source is replaced with this:
   ```js
   const dotEnvModules = require.context("<projectRoot>", false, /^\.\/\.env/);
   export const env = !dotEnvModules.keys().length ? process.env : { ...process.env,
     ...['.env', '.env.development', '.env.local', '.env.development.local']
       .reduce((acc, file) => ({ ...acc, ...(dotEnvModules(file)?.default ?? {}) }), {}) };
   ```
   Each `.env*` file then becomes a module (same file, the branch on the
   `.env` filename regex): `export default {EXPO_PUBLIC_…}`. **The files
   are spread after `process.env`, so they win over it.** The four files
   win in that order, `.env.development.local` last.
3. **The serializer prelude**
   (`@expo/metro-config/build/serializer/environmentVariableSerializerPlugin.js`):
   the "HMR env vars from Expo CLI" one-liner defines `process.env.EXPO_PUBLIC_*`
   from the Metro process's environment. That is where the e2e `3101` lives.

`@expo/env`, which loads `.env` files into the Metro **process**, never
overrides a variable already set. Its own doc comment says so ("This won't
override existing environment variables defined in the system
environment"), and that is the precedence Expo documents. Step 2
contradicts it in development, and nothing in step 2 checks a switch:
- `EXPO_NO_DOTENV` is read only by `@expo/env`, which is why the Architect
  saw no effect.
- `EXPO_NO_CLIENT_ENV_VARS` only removes the step 3 prelude, which would
  make things worse.

`require.context` lists files from **Metro's file map**. Expo adds
`watcher.additionalExts: ['env', 'local', 'development']` to
`ExpoMetroConfig.js` precisely so that `.env*` files enter that map (the
transform worker's comment says so). A file that matches
`resolver.blockList` never enters the file map. So `require.context` finds
no keys and the module exports `process.env` itself, which is the prelude
with the e2e values.

### Evidence

Logs and bundles are in
`/private/tmp/claude-501/-Users-tatiana-Workspace-perso-b-spot/36a2459e-2eb2-4a85-8866-2c7ae0ff328b/scratchpad/mobile-env/`.
Each probe was a Metro started as `metro.ts` starts it (same args, same
env), followed by a fetch of
`/apps/mobile/node_modules/expo-router/entry.bundle?platform=ios&dev=true&minify=false`.
The worktree's `apps/mobile/.env` held `EXPO_PUBLIC_API_URL=http://localhost:3001`.

| Probe | Change | Bundle |
|---|---|---|
| baseline | none | prelude `3101`; a `.env` module `{"EXPO_PUBLIC_API_URL": "http://localhost:3001"}`; `client.ts` reads `_expoVirtualEnv.env.EXPO_PUBLIC_API_URL` → **3001** |
| blockList on | `metro.config.js` adds `^<projectRoot>/\.env` to `resolver.blockList` when a gate variable is `1` | prelude `3101`; no `.env` module; `require.context` empty → **3101** |
| blockList present, gate off | same `metro.config.js`, no gate variable | identical to baseline (the developer's `pnpm dev:mobile` is unchanged) |
| blockList on, every variant | `.env` 3001 + `.env.local` 3003 + `.env.development.local` 3002 | no `3002`/`3003`/`3001` value anywhere → **3101** |
| `--no-dev` (alternative) | `expo start --no-dev`, bundle `dev=false` | Babel inlines `"http://localhost:3101"` directly; no virtual env module |

**Full run:** the blockList probe was applied (gate variable set in
`metro.ts`'s env) with the 3001 `.env` in place. The result of
`pnpm e2e:mobile` was **4/4 Flows Passed in 1m 54s** (log
`probe-run1-blocklist-dotenv.log`). Both probe changes were then reverted.

### Options weighed

- **Hide `apps/mobile/.env*` from the e2e Metro's file map with
  `resolver.blockList`, gated by an e2e-only variable (chosen).**
  - It touches no file, so a killed run leaves nothing behind.
  - The developer's Metro is unchanged.
  - The run keeps slice 02's dev-mode bundle.
  - `resolver.blockList` is documented Metro configuration. **That it hides
    the files from Expo's dev env module relies on Expo internals**: the
    `require.context` over the file map in the transform worker. If Expo
    changes that, the regression guard below fails loudly.
- **`expo start --no-dev`.** Both the flag and the env precedence it then
  follows (the process env wins, through `@expo/env` and Babel inlining)
  are documented. But it changes what runs under test: `__DEV__` is false,
  React runs in production mode, and the dev menu onboarding may or may not
  still show, while `common/load-bundle.yaml` depends on it. That is a
  redesign of slice 02's launch, not a fix. Kept as the fallback if the
  Architect wants documented-only.
- **Write an e2e `.env.development.local`** (it wins last). Rejected: the
  developer may own that file, and a killed run would leave a file that
  overrides the developer's `.env`, which goes against
  `developer-files-untouched`.
- **Redirect `expo/virtual/env` with a custom `resolver.resolveRequest`.**
  Rejected: it is coupled to the same internals, plus the virtual module's
  path, and needs more code.
- **Override `watcher.additionalExts`.** Rejected: it is the same internals
  as blockList, but undoes a setting Expo needs for other reasons. Its
  intent is less clear.

### Files

- `apps/mobile/metro.config.js`: when `process.env.B_SPOT_E2E_IGNORE_DOTENV_FILES === '1'`,
  append `new RegExp('^' + escape(projectRoot) + '/\\.env')` to
  `config.resolver.blockList` (an array, Expo's own entries kept). The
  comment above it says why, and names the transform-worker internals it
  relies on. A plain string literal: the mobile config cannot import from
  `apps/e2e`.
- `apps/e2e/env/e2e-env.ts`: `IGNORE_DOTENV_FILES_VARIABLE =
  'B_SPOT_E2E_IGNORE_DOTENV_FILES'`, commented as the e2e side of
  `metro.config.js`.
- `apps/e2e/env/ios/metro.ts`:
  - The env gains `[IGNORE_DOTENV_FILES_VARIABLE]: '1'` and
    `EXPO_NO_DOTENV: '1'`. The second is documented. It keeps the
    developer's other `EXPO_PUBLIC_*` values (e.g. `EXPO_PUBLIC_API_TIMEOUT`)
    out of the Metro process, so the run is hermetic.
  - The wrong comment is corrected. In development Expo bundles
    `apps/mobile/.env*` and those files win over the process env, so the
    e2e Metro hides them from Metro.
- `apps/e2e/env/ios/bundle-api-url.ts` (new, pure):
  - `findBundledApiUrls(bundle: string): string[]` returns every literal
    value given to `EXPO_PUBLIC_API_URL`. It covers the prelude form
    `"EXPO_PUBLIC_API_URL": { enumerable: true, value: "…" }` and the `.env`
    module form `"EXPO_PUBLIC_API_URL": "…"`.
  - `describeApiUrlMismatch(urls: readonly string[], expected: string): string | null`
    returns `null` when there is at least one URL and every URL equals
    `expected`. Otherwise it returns the failure message.
- `apps/e2e/env/ios/bundle-preflight.ts` (new, IO):
  `assertBundleUsesApiUrl(): Promise<void>`.
  1. Reads the manifest from `METRO_URL` with `expo-platform: ios`.
  2. Takes `launchAsset.url`, the exact bundle the dev build loads, and
     drops `transform.bytecode` so the answer is JS text.
  3. Fetches it, then throws
     `[e2e] the iOS bundle carries EXPO_PUBLIC_API_URL=<found>, not <API_URL>. Expo bundles apps/mobile/.env* in development and its values win; the e2e Metro must hide them (B_SPOT_E2E_IGNORE_DOTENV_FILES in apps/mobile/metro.config.js).`
     It names "no value found" separately: the bundle format changed, and
     the guard must be updated.

  Side effect: this warms the bundle before the first flow.
- `apps/e2e/env/ios/run-mobile.ts`: `runFlows` calls
  `await assertBundleUsesApiUrl()` right after `startMetro()`, inside the
  `try` that stops Metro.
- `apps/e2e/env/ios/bundle-api-url.test.ts` (new) and an `apps/e2e`
  `"test": "tsx --test env/**/*.test.ts"` script, so it joins `pnpm test`.
  This is subject to the Architect's ruling (open question below).
- `README.md`, "End-to-end tests" → iOS: one sentence. The run ignores
  `apps/mobile/.env*` and never touches them, and a preflight fails if the
  bundle carries another API URL.
- `project-management/tasks/20261103-2143-e2e-tests/02-ios-maestro.work.md`
  stays as it was (history). The journal entry at close records the
  correction.

`apps/e2e/env/ios/` goes from 6 to 8 files (limit 10).

### Edge cases

- **The developer has `.env.local` or `.env.development.local`.** All
  `apps/mobile/.env*` files are blocked; proven by the every-variant probe.
- **`.env.example` is blocked too.** Harmless: it is never `require`d.
- **A killed run.** Nothing is created or moved: the mechanism is an env
  variable on one child process. `developer-files-untouched` is checked
  with the `.env` checksum before and after a run killed with SIGINT
  mid-flows.
- **The bundle is served as Hermes bytecode** (`transform.bytecode=1`).
  The preflight drops that parameter. If Metro still answers bytecode, the
  "no value found" branch fails loudly, and the plan is revised here.

### Test order

1. **Pure guard, test-first.** `bundle-api-url.test.ts`, red, then
   `bundle-api-url.ts`, green. Its inputs are excerpts copied from the
   probe bundles (prelude + `.env` module 3001 → mismatch; prelude only →
   ok; nothing → format changed).
2. **Preflight wired, fix absent.** With `.env` = 3001, `pnpm e2e:mobile`
   must fail at the preflight with the message naming the cause. This is
   the red proof of `regression-guard`.
3. **Fix** (`metro.config.js` + `metro.ts` env + comment). With `.env` =
   3001, `pnpm e2e:mobile` passes 4/4, twice (`local-env-ignored`).
4. **No `.env`.** `pnpm e2e:mobile` passes 4/4 (`without-env-still-passes`).
5. **Killed run.** Checksum `.env`, SIGINT during the flows, then compare
   the checksum and `git status --short` (`developer-files-untouched`).
6. **Gates.** `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm e2e:web`
   (`suite-green`), plus the README.

## Worklog

- 2026-11-04 (plan) — Read the spec, slice 02's design of the e2e Metro and
  `metro.ts`. Traced `.env` handling through `babel-preset-expo`,
  `@expo/metro-config` (transform worker, serializer, `ExpoMetroConfig`),
  `@expo/env`. Reproduced on a probe Metro (both `3001` and `3101` in the
  bundle). Proved `resolver.blockList` removes the `.env` modules (every
  variant), proved the gate leaves the developer's Metro unchanged, and
  checked `--no-dev` as an alternative. A full `pnpm e2e:mobile` with the
  blockList probe and a 3001 `.env` passed 4/4. Probe changes reverted;
  the worktree's `.env` removed.

## Implementation Checkboxes

- [ ] Pure guard `bundle-api-url.ts` + its test, test script in `apps/e2e`
- [ ] Preflight `bundle-preflight.ts` wired in `run-mobile.ts`; red run with a 3001 `.env` names the cause
- [ ] Fix: `metro.config.js` blockList gate, `metro.ts` env + corrected comment, `e2e-env.ts` constant
- [ ] `local-env-ignored`: two green runs with a 3001 `.env`
- [ ] `without-env-still-passes`: one green run with no `.env`
- [ ] `developer-files-untouched`: killed-run checksum check
- [ ] README sentence
- [ ] Gates: lint, test, build, `e2e:web`

## Notes & Snippets

- Probe patch used (reverted), in `apps/mobile/metro.config.js` before
  `module.exports`:
  ```js
  if (process.env.B_SPOT_E2E_IGNORE_DOTENV === '1') {
    const escaped = projectRoot.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    config.resolver.blockList = [].concat(config.resolver.blockList ?? [], new RegExp(`^${escaped}/\\.env`));
  }
  ```
- The manifest's `launchAsset.url` (what the dev build really loads):
  `http://127.0.0.1:8183/node_modules/.pnpm/expo-router@…/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app&unstable_transformProfile=hermes-stable`.
- Upstream: in development, the client env module lets `.env` files win
  over the shell, while `@expo/env` and production inlining let the shell
  win. That is worth an Expo issue; out of scope here.

### Rulings — Architect, 2026-11-04

- **`resolver.blockList` behind the e2e gate, rather than `--no-dev`.**
  Accepted. The spec allows an undocumented hook once its reason is
  written, and it is. `--no-dev` would change what runs under test:
  production React, `__DEV__` false, and slice 02's launch subflow. The
  preflight guard is what makes relying on internals acceptable, because a
  change in Expo fails loudly.
- **`apps/e2e` test script** (`tsx --test`): yes. The guard's parsing runs
  under `pnpm test`.
- **`EXPO_NO_DOTENV=1` on the e2e Metro:** yes.
- **Bundle fetched without `transform.bytecode`:** go ahead. If Metro still
  answers with bytecode, revise the plan in this document and tell me.
- **Reporting the precedence contradiction to Expo:** out of scope. Noted
  for the human.

## Diff-Review Findings

_(after `code-review`)_
