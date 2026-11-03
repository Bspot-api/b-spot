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
- chisel init: installed the dev-workflow socle.
