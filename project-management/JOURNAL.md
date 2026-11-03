# Journal

Project history, newest first. Written by hand, one dated entry per
task — never generated.

## 2026-11-03

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
