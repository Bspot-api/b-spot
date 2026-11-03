# Cosmetics are labelled as food products

**Status:** ready

---

> 🧑 **REVIEW CAREFULLY** — human decision surface. Read it all before code.

## Context

The API returns a product's source as `'OFF'` or `'OBF'`, the values of the
API's `ProductSource` enum (`apps/api/src/modules/product`). The mobile
app's `ProductSource` type (`apps/mobile/src/api/types.ts`) expects
`'OPEN_FOOD_FACTS'` or `'OPEN_BEAUTY_FACTS'`, and `useBarcodeScanner` maps on
the long form. Every product is therefore treated as an Open Food Facts
product, and the company page labels cosmetics "Produit alimentaire". It was
found by slice 01 of the e2e task, whose cosmetic-label test is
`test.fixme` because of it.

## Scope

**Included:**
- One source vocabulary shared by the API's response and the app, with the
  cosmetic shown as a cosmetic on the company page and in the history.
- Enabling the `test.fixme` cosmetic-label test in
  `apps/e2e/web/scan.spec.ts`.

**Not Included:**
- Any other change to the product or company screens.

## Acceptance Criteria

- [ ] **cosmetic-labelled** — scanning the e2e catalogue's known cosmetic
  shows the cosmetic label on its company page (the e2e test passes,
  no longer fixme).
- [ ] **food-unchanged** — a food product still shows "Produit
  alimentaire".
- [ ] **types-match-api** — the app's product source type is the one the
  API's OpenAPI schema declares (generated or checked against it).
- [ ] **suite-green** — `pnpm test` and `pnpm e2e:web` pass.

## Seams

- The product's `source` field in the scan response, as the OpenAPI schema
  declares it.

## Architecture

**System design:** the mobile type follows the API contract. Whether the API
or the app changes its spelling is the plan's call; the API's values are
already stored in history entries on devices (`'OFF' | 'OBF'`), which
favours keeping the short form.

---

> 🧑 **REVIEW IF RELEVANT** — decisions, testing, slicing.

## References

- `project-management/tasks/20261103-2143-e2e-tests/01-web-playwright.work.md`,
  close report: where the defect was found.

## Notes

- 2026-11-03, Architect: the human asked for this task while slice 01
  closed.
