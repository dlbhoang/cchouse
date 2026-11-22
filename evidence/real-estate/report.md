# Real estate detail UI verification

## Changed files
- `src/lib/components/admin/property/detail-dialog/index.tsx`: map tab, related properties, header, edit and post actions.
- `src/lib/components/admin/property/detail-dialog/property-detail-dialog.css`: desktop and mobile detail layout.
- `src/lib/pages/property/index.tsx`: opens the existing edit flow from the detail view.
- `src/lib/pages/property/prop-detail/components/warehouse-section.tsx`: handles missing phone and failed related-property requests.

## Figma mapping
- `3551:198240`: property detail overview → `PropertyDetailDialog` overview.
- `3555:200946`: contact and related properties → phone tab and `WarehouseSection`.
- `3555:202419`: location map → map tab and `PropertyMap`.
- `3555:203007`: edit history → history tab and `HistoryTree`.
- `2089:105771`, `3151:149405`: scrim primitives → modal mask.
- `2163:122729`: tooltip instruction → existing icon labels; no standalone screen.

## Checks
- Type check: PASS (`npx tsc --noEmit`, after latest changes).
- Production build: PASS (`npx next build`, before the final small empty-phone fix), with existing Edge Runtime warnings from `jose`.
- Relevant tests: PASS (8 tests in `media-history.test.cjs` and `admin-ui-fixtures.test.cjs`, after latest changes).
- Browser route: executed with system Chrome at 1440 × 1024. `/admin/property?TransType=1` redirected to `/login` without a session.
- Authorized login: executed in Chrome. The credentials callback returned `CredentialsSignin` because `/api/proxy/AdminAuth` returned **502** with “Không thể kết nối tới máy chủ.” No authenticated session was established. Protected property tabs and interactions: BLOCKED, not PASS.
- Seven side-by-side files are saved as `comparison-<node-id>.png`. The right side shows the observed login redirect for each frame; they are blocked-run evidence, not visual matches. No visual difference fixes or recapture of authenticated states could be completed.

## Remaining issues
- Live authenticated E2E and visual verification for the four detail states remain outstanding. Development API connectivity is required. `login-result.png` captures the sign-in attempt. The seven comparisons show the login redirect, not authenticated matches.
- Figma's two scrim nodes and tooltip note are design primitives, not navigable app screens.
