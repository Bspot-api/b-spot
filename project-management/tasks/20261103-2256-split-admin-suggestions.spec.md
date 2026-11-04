# Split the admin suggestions screen under 300 lines

**Status:** in-progress

---

> 🧑 **REVIEW CAREFULLY** — human decision surface. Read it all before code.

## Context

`apps/mobile/app/admin/suggestions.tsx` is over the 300-line file limit of
`CLAUDE.md` ("Code Quality Standards"): 336 lines after the web UX fixes. It
holds the screen, the list item and the edit BottomSheet.

## Scope

**Included:**
- Moving the list item and the edit sheet into
  `src/features/admin/components/`, in line with the feature-based layout of
  `docs/constitution.md`.

**Not Included:**
- Any behaviour change.
- Any `testID` change, since the e2e journeys rely on them.

## Acceptance Criteria

- [ ] **under-limit** — every touched file is 300 lines or fewer.
- [ ] **behaviour-unchanged** — the e2e moderation journey passes
  unchanged (`pnpm e2e:web`).
- [ ] **suite-green** — `pnpm test` and `pnpm build` pass.

## Seams

- The props of the extracted item and sheet components.

---

> 🧑 **REVIEW IF RELEVANT** — decisions, testing, slicing.

## Slices & Dependencies

- Blocked by: none. The merge of `fix/web-ux-bugs` is done (2026-11-03).

## Notes

- 2026-11-03, Architect: flagged by both code reviews. The human asked for
  this task.
