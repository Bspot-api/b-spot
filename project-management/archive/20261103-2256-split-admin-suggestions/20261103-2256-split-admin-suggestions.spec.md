# Split the admin suggestions screen under 300 lines

**Status:** done

---

> 🧑 **REVIEW CAREFULLY** — human decision surface. Read it all before code.

## Context

`apps/mobile/app/admin/suggestions.tsx` is over the 300-line file limit of
`CLAUDE.md` ("Code Quality Standards"): 336 lines after the web UX fixes (359 when the task started, on 2026-11-04). It
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

- [x] **under-limit** — every touched file is 300 lines or fewer.
  Route 96, card 111, edit sheet 133, tabs 38, editor hook 49, draft
  helpers 35, their test 54 (`wc -l`, 2026-11-04).
- [x] **behaviour-unchanged** — the e2e moderation journey passes
  unchanged (`pnpm e2e:web`). Green before the first move and twice after
  the last commit, 25 passed each time; `apps/e2e` untouched; testID list
  identical before and after.
- [x] **suite-green** — `pnpm test` and `pnpm build` pass. Both exit 0
  after the review fixes (mobile 27 tests, API 110); `pnpm lint` exit 0.

- (added 2026-11-04, Architect ruling) Also extracted, as pure moves:
  the status tabs, the edit state as a `useSuggestionEditor` hook, and two
  draft helpers (`suggestion-draft.ts`) with a unit test.

## Seams

- The props of the extracted item and sheet components.

---

> 🧑 **REVIEW IF RELEVANT** — decisions, testing, slicing.

## Slices & Dependencies

- Blocked by: none. The merge of `fix/web-ux-bugs` is done (2026-11-03).

## Notes

- 2026-11-03, Architect: flagged by both code reviews. The human asked for
  this task.
