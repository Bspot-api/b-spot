# Split the admin suggestions screen under 300 lines — work

Created by the Crewmate at the plan step, 2026-11-04. Spec:
`project-management/tasks/20261103-2256-split-admin-suggestions.spec.md`.

**Plan:** approved by the Architect, 2026-11-04 (see Rulings).

## Program Design

Read under: `AGENTS.md`, `.agents/discipline.md`, `.agents/workflow.md`,
the reading list of §C · Reading list of `.agents/project.md` (README,
journal, `docs/constitution.md` Principle 4 "Feature-Based Architecture",
`docs/agent-rules/common.md`, `docs/agent-rules/git-workflow.md`), and the
"Code Quality Standards" of `CLAUDE.md` (300 lines per file, 30 lines per
function, 10 sub-files per folder).

### Starting point

`apps/mobile/app/admin/suggestions.tsx` is **359 lines** on this branch (the
spec's context says 336; the web UX fixes added lines after it was written).
It holds five concerns: the status tabs, the suggestion card with its
reject/delete confirmations, the screen state and mutations, the edit-form
state, and the edit BottomSheet with its three style constants. The
`SuggestionsScreen` function alone is about 200 lines.

### Target files

`apps/mobile/src/features/admin/` is a new feature folder (the fifth, beside
`auth`, `company`, `history`, `scanner`; the constitution allows ten).

| File | Role | Estimated lines |
|---|---|---|
| `apps/mobile/app/admin/suggestions.tsx` | route: guard, active tab, list query, status and delete mutations, wiring | ~95 |
| `src/features/admin/components/SuggestionCard.tsx` | one suggestion card, its edit/delete icons, its status buttons, the reject and delete confirmations, `formatDate` | ~110 |
| `src/features/admin/components/SuggestionStatusTabs.tsx` | the four status tabs and `TABS` | ~45 |
| `src/features/admin/components/SuggestionEditSheet.tsx` | the edit BottomSheet: four labelled inputs, cancel and save buttons, the three style constants | ~140 |
| `src/features/admin/hooks/useSuggestionEditor.ts` | edit state (open item + draft fields) and the fields mutation | ~50 |
| `src/features/admin/suggestion-draft.ts` | pure: item → draft, draft → `UpdateSuggestionFieldsDto` | ~30 |
| `src/features/admin/__tests__/suggestion-draft.test.ts` | unit test of the two pure functions | ~45 |

Every file stays far below 300 lines; `components/` holds three files.

### Seams (the props)

```ts
// SuggestionCard.tsx — the props the inline SuggestionItem has today, unchanged.
interface SuggestionCardProps {
  item: BrandSuggestionDto;
  onAction: (id: number, status: SuggestionStatus) => void;
  onDelete: (id: number) => void;
  onEdit: (item: BrandSuggestionDto) => void;
}

// SuggestionStatusTabs.tsx
interface SuggestionStatusTabsProps {
  activeStatus: SuggestionStatus;
  onChange: (status: SuggestionStatus) => void;
}

// suggestion-draft.ts
interface SuggestionDraft {
  brandName: string;
  productName: string;
  barcode: string;
  notes: string;
}
function toSuggestionDraft(item: BrandSuggestionDto): SuggestionDraft;      // null → ''
function toSuggestionFields(params: { draft: SuggestionDraft; item: BrandSuggestionDto }):
  UpdateSuggestionFieldsDto;                                                 // blank brand → item.brandName

// useSuggestionEditor.ts — owns what the route held in five useState + fieldsMutation.
interface SuggestionEditor {
  isOpen: boolean;                       // editItem !== null
  draft: SuggestionDraft;
  isSaving: boolean;                     // fieldsMutation.isPending
  startEdit: (item: BrandSuggestionDto) => void;
  changeDraft: (field: keyof SuggestionDraft, value: string) => void;
  cancelEdit: () => void;                // setEditItem(null)
  saveEdit: () => void;                  // no-op when closed; closes on success only
}

// SuggestionEditSheet.tsx — presentational; state stays in the hook.
interface SuggestionEditSheetProps {
  isPresented: boolean;
  draft: SuggestionDraft;
  isSaving: boolean;
  onChangeDraft: (field: keyof SuggestionDraft, value: string) => void;
  onDismiss: () => void;
  onSave: () => void;
}
```

Why the edit state lives in a hook and not in the sheet: today the draft is
filled when "edit" is pressed and the open item stays set while the sheet
closes. A sheet owning its own state would need either an effect on the item
or a `key` remount, and either one changes when the fields are reset.
Keeping the state in `useSuggestionEditor` and the sheet presentational
copies today's timing exactly.

Inside `SuggestionEditSheet.tsx` a file-local `DraftField` component (label +
`TextInput`, optional `testID`) replaces the four repeated label/input blocks,
so the sheet's function body fits about 40 lines. The brand input keeps
`testID="suggestion-edit-brand-input"`; the sheet keeps
`testID="suggestion-edit-sheet"`; save keeps `testID="suggestion-edit-save"`.

### What stays in the route file

`useAdminGuard` and the loading spinner shown while `access !== 'granted'`;
the `status` search param and `activeStatus`; `useAdminSuggestions` (still
`enabled: access === 'granted'`); `useUpdateSuggestionStatus` and
`useDeleteSuggestion` with `handleAction` and `handleDelete`; the pending,
error/retry and `FlatList` branches with `suggestions-empty`; the
`SuggestionStatusTabs`, `SuggestionCard` and `SuggestionEditSheet` wiring.
The route's function lands around 70 lines: under the file limit, above the
30-line function rule (see the open decisions).

### Behaviour unchanged — how it is proven

- **No logic is rewritten**, only moved. JSX, class names, styles, French
  labels, `hitSlop`, the button visibility conditions and the
  `confirmAction` requests are copied verbatim.
- **testIDs are identical.** A sorted list of every `testID` literal of the
  old file is saved before the first move, to
  `/private/tmp/claude-501/-Users-tatiana-Workspace-perso-b-spot/36a2459e-2eb2-4a85-8866-2c7ae0ff328b/scratchpad/split-suggestions/testids-before.txt`,
  and compared with the same list over the route plus
  `src/features/admin/` at the end. Ten literals plus the
  `suggestions-tab-${status}` template.
- **e2e moderation journey** (`apps/e2e/web/moderation.spec.ts`: approve,
  edit, reject, delete) passes before the first move (baseline) and after
  the last, with `pnpm e2e:web`, unmodified. Every run takes the shared lock:

  ```sh
  LOCK=/private/tmp/claude-501/-Users-tatiana-Workspace-perso-b-spot/36a2459e-2eb2-4a85-8866-2c7ae0ff328b/scratchpad/e2e.lock
  until mkdir "$LOCK" 2>/dev/null; do sleep 30; done
  trap 'rmdir "$LOCK"' EXIT
  pnpm e2e:web > .../scratchpad/split-suggestions/e2e-<step>.log 2>&1
  ```

  The full suite is run (not just moderation), since the other journeys
  share the admin entry screen.
- **Unit test** `suggestion-draft.test.ts` pins the only non-trivial logic
  that moves: null product/barcode/notes become `''` in the draft; a blank
  or whitespace brand falls back to the item's brand; other fields go out
  untrimmed, exactly as today. No component render tests: the mobile
  package has no React testing library, and the constitution makes UI
  component and admin-only tests optional.

### Test order

1. Snapshot the testID list; run the e2e baseline on the untouched code.
2. Red: `suggestion-draft.test.ts`; green: `suggestion-draft.ts`.
3. Extract `SuggestionCard`; route imports it.
4. Extract `SuggestionStatusTabs`.
5. Extract `useSuggestionEditor` (on top of `suggestion-draft.ts`) and
   `SuggestionEditSheet`; route uses both.
6. Gates: `pnpm lint`, `pnpm test`, `pnpm build`; `wc -l` on every touched
   file; testID comparison; `pnpm e2e:web` under the lock.

Steps 3 to 5 each run mobile lint, `tsc --noEmit` and jest, then commit.

### Decisions left open

- **Component file naming.** `docs/agent-rules/common.md` asks for
  kebab-case component files; every existing component under
  `src/features/*/components/` is PascalCase (`ScanHistoryItem.tsx`).
  Recommendation: PascalCase, to match the neighbours; pure helpers keep
  kebab-case like `history-utils.ts`.
- **How far past the spec's literal scope.** The spec moves the item and the
  sheet; that alone brings the route to ~150 lines and meets `under-limit`.
  This plan also extracts the tabs and the edit hook, to bring the route
  close to the 30-line function rule. Recommendation: keep them; they are
  pure moves with no added behaviour.
- **The 30-line function rule for JSX components.** Mobile lint does not
  enforce it, and the route (~70 lines) and `SuggestionCard` (~65 lines of
  JSX) would still exceed it. Recommendation: accept it for this task; the
  spec's criterion is the file limit, and splitting further would cut JSX
  without a seam worth naming.

## Worklog

- 2026-11-04 — plan written; `pnpm install` at the worktree root passed.
- 2026-11-04 — code, in the approved order, one commit per green step.
  - Baseline: testID list saved (ten literals and the tab template);
    `pnpm e2e:web` green on the untouched code, 25 passed.
  - `suggestion-draft.test.ts` red (module missing), then green with
    `suggestion-draft.ts`: 4 tests.
  - Card, then tabs, then hook and sheet moved. The JSX was copied from the
    old file's lines, not retyped. The four edit `useState`s became one
    `SuggestionDraft` state in the hook.
  - `tsc --noEmit` on mobile reports errors only in the existing
    `__tests__` files (no jest types in the tsconfig); that predates the
    task and is unchanged. Zero errors outside the test files after each
    step.
  - Gates: `pnpm lint` exit 0, 8 warnings, none in the touched files;
    `pnpm test` exit 0 (mobile 27 tests, API 110); `pnpm build` exit 0;
    testID diff empty; `pnpm e2e:web` twice, 25 passed each time,
    moderation's four journeys included. Every e2e run took the shared
    lock and released it through a `trap`.
  - Line counts: route 96, `SuggestionCard` 111, `SuggestionEditSheet` 133,
    `SuggestionStatusTabs` 38, `useSuggestionEditor` 49,
    `suggestion-draft` 35, its test 54.

## Implementation Checkboxes

- [x] testID list saved; e2e baseline green on the untouched code
- [x] `suggestion-draft.ts` and its unit test
- [x] `SuggestionCard` extracted
- [x] `SuggestionStatusTabs` extracted
- [x] `useSuggestionEditor` and `SuggestionEditSheet` extracted
- [x] gates green: lint, test, build, line counts, testID comparison, e2e
- [ ] `code-review` run, findings answered
- [ ] close: criteria ticked, journal, archive

## Notes & Snippets

- `BottomSheet` (`src/components/BottomSheet/index.tsx`) takes
  `isPresented`, `onDismiss`, `children`, `testID`; its animation keys on
  `isPresented` only.
- `UpdateSuggestionFieldsDto` is in `src/api/types.ts`; the mutation is
  `useUpdateSuggestionFields` in `src/api/hooks.ts`.
- Pure helpers are tested like `history-utils.ts`
  (`src/features/history/hooks/__tests__/useScanHistory.test.ts`): plain
  jest, no rendering.

### Rulings — Architect, 2026-11-04

- **File naming:** PascalCase for components, to match the existing
  `src/features/*/components/`, and kebab-case for pure helpers.
  `docs/agent-rules/common.md` says kebab-case; that gap between the rule
  and the codebase is reported to the human, not settled here.
- **Scope:** extracting the status tabs and `useSuggestionEditor` as well
  is accepted. They are pure moves.
- **30-line functions:** the route function and the card's JSX may stay
  above 30 lines. This task's criterion is the 300-line file limit.
- **Spec dependency line:** updated, since the merge is done.

## Diff-Review Findings

_(filled at the review step)_
