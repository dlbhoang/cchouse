# C.C.House continuation verification — 23 November 2026

## Implementation

- Property details use `/admin/property/[id]`; list and map selections navigate to it. Overview, media, phone, map, history, edit and post controls remain in the page.
- Address entry defaults to before merger. API lookups convert in either direction and show ambiguous choices or conversion errors. The second street and number now use dedicated `PropAddress` fields rather than `Note`.
- The dev database `db_cchouse_dev` has nullable second-address columns and a nullable, unique `ClientRequestId` column. The two migrations were recorded in `__EFMigrationsHistory`. No production database was accessed.
- A property create carries one stable client request ID. Repeating the request resolves to the original property. Invalid Firebase key material in Development no longer fails a create after its database commit.

## Actual checks

| Check | Result | Evidence |
| --- | --- | --- |
| Authenticated property details direct URL, desktop and mobile | PASS for property 48975 | `detail-e2e.json`, `detail-desktop.png`, `detail-mobile.png` |
| Details tabs, edit entry and browser back | PASS for five tabs, edit form load and return to list | `detail-tabs-final.png`, `detail-edit-loaded.png`, `detail-edit-loaded-e2e.json` |
| Mobile tabs and post entry | PASS for five tabs and `/admin/feed/add?propId=48975` | `detail-mobile-post-e2e.json`, `detail-mobile-tabs-final.png` |
| Authenticated property create response | PASS, HTTP 200, property 48976 | `persistence-retry-e2e.json` |
| Authenticated second-address edit and reload | PASS, `Lê Lợi` and `12B` on property 48975 | `persistence-retry-e2e.json` |
| Authenticated address summary and edit form reload | PASS, converted summary plus `Lê Lợi` and `12B` | `address-summary-e2e.json`, `address-summary-final.png` |
| Authenticated create retry | PASS, HTTP 200 and same ID 48976 | `retry-e2e.json` |
| Retry after an edit that omitted the request ID | PASS, ID retained and retry returned 48976 | `retry-after-edit-e2e.json` |
| Before-to-after and after-to-before conversion, validation | PASS in earlier authenticated E2E | `../address/e2e-results.json` |
| Frontend typecheck | PASS | `typecheck-summary.log` |
| Frontend tests | PASS, 40/40 | `tests-after-summary.log` |
| Full frontend lint | PASS, 713 files | `lint-after-summary.log` |
| Frontend production build | PASS | `frontend-build-after-summary.log` |
| API build | PASS, 0 errors and 64 warnings | `api-build-final-2.log` |
| API smoke tests | PASS, 90/90 | `api-tests-final.log` |

## Visual comparison

The six requested Figma nodes and matching address captures are in `../address/`; `../address/comparison-six.jpg` places them side by side. The new details page captures are `detail-desktop.png` and `detail-mobile.png`. A later capture, `address-summary-final.png`, shows the converted summary replacing the extra editable row. Remaining visual differences: property type and address sit in separate sections, the second street row uses the existing form layout, and floating labels, icons and spacing differ from Figma.

## Unverified or incomplete

- The edit form loaded; an early test read its second-street inputs before asynchronous hydration. A later authenticated test verified both saved values after hydration (`address-summary-e2e.json`).
- Full lint initially had 56 unused symbol diagnostics in 38 unrelated files. Those unused symbols were removed and all gates rerun.
- Pixel-level visual parity across every Figma state has not been achieved. The earlier six-panel comparison predates the summary-line improvement; compare that state with `address-summary-final.png`.
