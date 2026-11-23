# Address entry verification

Status: incomplete. This file records executed checks only.

## Source frames

Original Figma PNGs were captured for all requested nodes:

| Node | File |
| --- | --- |
| 3282:148351 | figma-3282-148351.png |
| 3285:150085 | figma-3285-150085.png |
| 3282:148518 | figma-3282-148518.png |
| 3282:148352 | figma-3282-148352.png |
| 3285:150813 | figma-3285-150813.png |
| 173:10394 | figma-173-10394.png |

## Changes

- `src/lib/components/admin/property/form/propAddEdit/addressInfo/index.tsx`: new before/after mode UI, bidirectional ward lookup using the development APIs, ambiguous-result selection, validation, and existing property address fields.
- `src/services/api/mergeWardApi.ts`: optional `NewWardId` filter for reverse lookup, preserving existing callers.

## Checks run

| Check | Result |
| --- | --- |
| `npm run type-check` | PASS after latest source edits |
| Targeted Biome lint of changed files | PASS |
| Repository `npm run lint` | FAIL: 15 errors and 41 warnings in other source files |
| `node --test tests/address-selector.test.cjs` | PASS: 2 tests; these cover the existing selector, not the new conversion flow |
| `npx next build` | PASS before the latest source edits; final rerun in progress |
| Browser login with alternate development account | PASS once |
| Browser address form, conversion, validation, persistence | UNVERIFIED: the login redirected to the property list; the next login was rejected as “logged in on another device” |
| Six implementation screenshots and side-by-side comparisons | UNVERIFIED: authenticated address form screenshots could not be captured |

## Remaining work

- Release the development account's active session, then run real-record E2E in both conversion directions, mode switching, validation, and create/edit persistence.
- Build and persist a separate second-street field. The current property API has one current street and one old street, so the design's additional street cannot be saved as a distinct value yet.
- Compare all six UI states with the captured Figma originals and correct layout differences.
- Verify whether new wards with no merge record need a district fallback for property saves.

No production data or account settings were changed.
