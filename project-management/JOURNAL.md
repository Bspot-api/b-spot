# Journal

Project history, newest first. Written by hand, one dated entry per
task — never generated.

## 2026-11-03

- e2e-tests, slice 01 (web, Playwright): `pnpm e2e:web` is a new command,
  run from `apps/e2e`.
  - It walks every critical web journey through the real app, the real
    API and its own `b_spot_e2e` database. A local fixture server stands
    in for Open Food Facts, Open Beauty Facts, recherche-entreprises and
    Pappers.
  - The API now reads the four external base URLs from optional variables.
  - The Open Beauty Facts fallback is fixed: Open Food Facts answers 404
    for an unknown barcode, and the code used to treat that as an outage.
  - The web export works again: the favicon is now a PNG.
  - Found along the way:
    - every product is labelled "alimentaire" (the `'OBF'` vs
      `'OPEN_BEAUTY_FACTS'` mismatch);
    - `pnpm lint` was already red on old debt.
- Web UX fixes (`fix/web-ux-bugs`): brand suggestion messages now go
  through the toast, so the web build shows them. Reject and delete use one
  cross-platform `confirmAction` (the web already used `window.confirm`; the
  spec was corrected). `/admin` and `/admin/suggestions` wait for the
  session: a logged-out visitor goes to the login screen, with no
  "session expirée" toast and no admin request. The web navbar links to
  the history. On native the brand suggestion messages stay native alerts
  (human ruling: a toast could hide behind the iOS modal); the toast is
  web only. Open items: native not checked on a simulator; lint and build
  red for reasons that predate this task. Documents:
  `project-management/archive/20261103-2226-web-ux-fixes/`.
- chisel init: installed the dev-workflow socle.
