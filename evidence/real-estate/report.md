# Real estate detail UI verification

## Changed files
- `src/lib/components/admin/property/detail-dialog/index.tsx`: map tab, related properties, header, edit and post actions.
- Contact tab now reuses the existing masked phone and reveal control, and displays the record's commission.
- `src/lib/components/admin/property/detail-dialog/property-detail-dialog.css`: desktop and mobile detail layout.
- `src/lib/pages/property/index.tsx`: opens the existing edit flow from the detail view.
- `src/lib/pages/property/prop-detail/components/warehouse-section.tsx`: handles missing phone and failed related-property requests.
- `src/lib/pages/property/prop-detail/index.tsx`: opens the edit form immediately after the edit action.
- `src/lib/pages/property/prop-detail/components/property-map.tsx`: renders a coordinate map when a place ID is absent.
- `src/lib/pages/property/prop-detail/property-detail.css`: gives the edit modal the Figma 40% scrim.

## Figma mapping
- `3551:198240`: property detail overview → `PropertyDetailDialog` overview.
- `3555:200946`: contact and related properties → phone tab and `WarehouseSection`.
- `3555:202419`: location map → map tab and `PropertyMap`.
- `3555:203007`: edit history → history tab and `HistoryTree`.
- `2089:105771`: 40% scrim primitive → edit dialog mask, verified `rgba(0, 0, 0, 0.4)`.
- `3151:149405`: 30% scrim primitive → history dialog mask, verified `rgba(0, 0, 0, 0.3)`.
- `2163:122729`: tooltip instruction → hover tooltip on the detail back icon, verified visible.

## Checks
- Authenticated route and real records: PASS using the alternate authorized development account. `/admin/property?TransType=1` returned 11 sale records; record `48966` opened successfully. The account was logged out after testing.
- Overview tab: PASS, real property fields rendered.
- Contact tab: PASS, masked phone, reveal/hide toggle, and three related-property rows rendered. No phone value was logged.
- Map tab: PASS for navigation and the no-location state. A browser-only override added coordinates to record `48966`; the actual UI rendered OpenStreetMap and its zoom control changed the screenshot (mean pixel difference 34.5). **Real GPS record: UNVERIFIED** because the accessible development records have no usable coordinates.
- History tab: PASS with real record `48967`: the history endpoint returned one entry, rendered as a full-width change card. Record `48966` also passed the empty-history state.
- Edit: PASS, opened the existing form with 55 inputs; nothing was saved.
- Post: PASS, navigated to `/admin/feed/add?propId=48966`; nothing was submitted.
- Mobile: PASS at 390 × 844, all five tabs render, no horizontal overflow or audit/summary overlap.
- Production build: PASS (`npx next build`) after all changes.
- Type check: PASS (`npx tsc --noEmit`).
- Relevant lint: PASS (`npx biome lint` on four changed TSX files).
- Relevant tests: PASS (8/8 in `media-history.test.cjs` and `admin-ui-fixtures.test.cjs`).
- Browser E2E details: `e2e-results.json` and `action-results.json`. Chrome was used for every browser assertion.
- Remaining-gap E2E details: `remaining-verification.json`. No backend data was changed.

## Visual evidence
- Seven original frames: `figma-<node-id>.png`.
- Four detail states: `implementation-overview.png`, `implementation-phone.png`, `implementation-map-coordinate-fixture.png`, `implementation-history.png`. Overview, phone and history use real records; the populated map screenshot uses the browser-only coordinate override.
- Seven side-by-side comparisons: `comparison-<node-id>.png`. All right sides are browser captures after visual fixes. The scrim and tooltip nodes are design primitives, so their comparisons use the actual dialog or hover context and are not pixel-equivalent full-screen comparisons.
- Primitive context captures: `implementation-scrim-edit.png`, `implementation-scrim-history.png`, `implementation-tooltip.png`.
- Map interaction captures: `map-before-zoom.png`, `map-after-zoom.png`.
- Additional captures: `implementation-mobile.png`, `edit-open.png`, `post-navigation.png`.
- Mobile contact capture: `implementation-phone-mobile.png` (no horizontal overflow).

## Remaining issues
- No real GPS record was found: the coordinate endpoint returned ten active sale records and zero active rentals; the accessible sale detail records had no usable `Lat`/`Lng` or place ID, and other queried statuses yielded no coordinate-bearing records. The populated map comparison uses browser-only coordinates, so a real-data map remains unverified.
- The coordinate fallback uses OpenStreetMap tiles, which differ visibly from Figma's map imagery. The map position, marker and zoom behavior were checked in the browser-only override; matching the Figma basemap requires a matching map provider.
- Figma shows two history entries; this development record contains one. The rendered card and its content are verified, but the second-entry layout cannot be checked against real data here.
- Original Figma records and this development database have different field values; text and imagery cannot match exactly.
- The first test account remained locked to an earlier browser session. The alternate account completed E2E and was logged out.
