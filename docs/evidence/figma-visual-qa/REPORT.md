# C.C.House Visual QA

**Overall PASS**

Chrome desktop, 1440 × 1024 CSS px at device scale 1. The local production frontend build used the real nonproduction API, development database, and development media storage. Figma references are native 1440 × 1024 exports from the supplied file. The comparison covers the five dialogs and their scrims. The admin page behind them, sample records, row counts, prices, text lengths and media contents differ between Figma and the real test environment. Dialogs with fewer rows can be shorter.

Each side-by-side image has Figma on the left and Chrome on the right, at native size. The overlay blends the unshifted full frames 50/50. The [measurements](visual-measurements.json) give the white panel bounds as x, y, width and height and the first timeline accent where present. The [browser evidence](api-evidence.json) includes test assertions and API status codes.

## 1. Property history — PASS

Figma panel [337, 59, 765, 890] and Chrome panel [337, 59, 766, 443]. Global title styling uppercased metadata, the date format used hyphens, and the timeline cards differed in color, radius and value spacing. Scoped the title styling, used slash dates, and matched the card and text measurements. The panel origin, 768 px design width, timeline columns, colors and first card align. The test record has two real audit entries, which shortens the panel. The first accent starts one pixel lower in Chrome.

[Figma node 979-54316](https://www.figma.com/design/210ENIOGEJaZnz6be1e2Az/C.C.House?node-id=979-54316) · [Figma export](01-figma.png) · [Chrome](chrome/03-property-history.png) · [Side by side](01-side-by-side.png) · [Overlay](01-overlay.png)

## 2. Note history — PASS

Figma panel [337, 59, 765, 630] and Chrome panel [337, 59, 766, 630]. A long history ran to the bottom of the viewport. Capped the scroll body at the reference height, preserved the footer, and aligned the button, close icon and timeline styling. The panel top and 630 px height align. The live history scrolls independently with the Add footer in view. The longer note data uses the interactive expand link.

[Figma node 4621-178426](https://www.figma.com/design/210ENIOGEJaZnz6be1e2Az/C.C.House?node-id=4621-178426) · [Figma export](02-figma.png) · [Chrome](chrome/04-note-history.png) · [Side by side](02-side-by-side.png) · [Overlay](02-overlay.png)

## 3. Add note — PASS

Figma panel [337, 292, 765, 396] and Chrome panel [337, 291, 766, 398]. Editor padding, counter size, footer and button styling varied. Matched the 168 px editor, 12 px field padding, 12 px counter and reference footer. Captured both unfocused and focused states. The field and footer align at the requested viewport. Chrome’s panel is 2 px taller due to divider borders. The actual character count reflects the saved test text. See the [focus state](chrome/11-add-note-focused.png).

[Figma node 2644-141721](https://www.figma.com/design/210ENIOGEJaZnz6be1e2Az/C.C.House?node-id=2644-141721) · [Figma export](03-figma.png) · [Chrome](chrome/11-add-note.png) · [Side by side](03-side-by-side.png) · [Overlay](03-overlay.png)

The supplied node is the [scrim](03-linked-scrim.png) of the [containing frame](https://www.figma.com/design/210ENIOGEJaZnz6be1e2Az/C.C.House?node-id=2644-141715) used for the dialog comparison.

## 4. Image history — PASS

Figma panel [183, 48, 1149, 932] and Chrome panel [183, 48, 1150, 629]. The panel was centered 38 px left of the reference. Aligned its desktop offset and date/time column, and adjusted tile dimensions, borders, colors and deleted-date display. The 1152 px panel and thumbnail rail align. The development database can split uploads and removals into separate time groups. Thumbnail shape reflects the original file aspect ratio.

[Figma node 2650-138995](https://www.figma.com/design/210ENIOGEJaZnz6be1e2Az/C.C.House?node-id=2650-138995) · [Figma export](04-figma.png) · [Chrome](chrome/07-image-history.png) · [Side by side](04-side-by-side.png) · [Overlay](04-overlay.png)

The supplied node is the [scrim](04-linked-scrim.png) of the [containing frame](https://www.figma.com/design/210ENIOGEJaZnz6be1e2Az/C.C.House?node-id=2650-138989) used for the dialog comparison.

## 5. Video history — PASS

Figma panel [183, 48, 1149, 932] and Chrome panel [183, 48, 1150, 415]. The same panel and tile discrepancies applied to this view. The shared styles correct its alignment and sizing while the duration badge and preview remain functional. The panel and tile layout align. The single available test clip renders a decoded thumbnail and its actual duration. The real video history has fewer rows than the design sample.

[Figma node 2659-143249](https://www.figma.com/design/210ENIOGEJaZnz6be1e2Az/C.C.House?node-id=2659-143249) · [Figma export](05-figma.png) · [Chrome](chrome/09-video-history.png) · [Side by side](05-side-by-side.png) · [Overlay](05-overlay.png)

The supplied node is the [scrim](05-linked-scrim.png) of the [containing frame](https://www.figma.com/design/210ENIOGEJaZnz6be1e2Az/C.C.House?node-id=2659-143247) used for the dialog comparison.

## Interaction and regression results

- **PASS** — Authorization. Direct History API rejected unauthenticated access with HTTP 401. The protected property page redirected to login. [01-authorization](chrome/01-authorization.png)
- **PASS** — Login. The Chrome session reached the protected property table. [02-authenticated](chrome/02-authenticated.png)
- **VERIFIED** — Fixture setup. Created disposable test property 48974, uploaded two images and a video to development storage, then edited its price and removed one image.
- **PASS** — Property history. History HTTP 200. UI count, first date, editor and field matched 2 API entries on record 48974. [03-property-history](chrome/03-property-history.png)
- **PASS** — Note history. NoteOnly=true returned HTTP 200. UI count and first entry matched 14 note audit entries. Body scrolled 1600px with footer visible. [04-note-history](chrome/04-note-history.png) · [04-note-history-scrolled](chrome/04-note-history-scrolled.png)
- **PASS** — Empty. Real note history request returned HTTP 200 with an empty array. [05-empty](chrome/05-empty.png)
- **PASS** — Image removals. 1 removed images matched the real API. [07-image-history](chrome/07-image-history.png)
- **PASS** — image history. Both IsVideo=false endpoint requests returned HTTP 200. UI totals matched 1 current and 1 removed files on record 48974. [07-image-history](chrome/07-image-history.png)
- **PASS** — Image preview. The image preview decoded and displayed the real file. [08-image-preview](chrome/08-image-preview.png)
- **PASS** — video history. Both IsVideo=true endpoint requests returned HTTP 200. UI totals matched 1 current and 0 removed files on record 48974. [09-video-history](chrome/09-video-history.png)
- **PASS** — Video playback. The real video decoded and currentTime advanced during playback. [10-video-playback](chrome/10-video-playback.png)
- **VERIFIED** — Test note cleanup. Restore PUT HTTP 200. The audit trail preserves test and restore entries.
- **PASS** — Add note and persistence. QuickUpdate HTTP 200 and NoteOnly history HTTP 200 after full reload. The unique note matched the API and UI on test record 48974. Original note restored after evidence capture. [11-add-note](chrome/11-add-note.png) · [12-note-submitted](chrome/12-note-submitted.png) · [13-note-persisted](chrome/13-note-persisted.png)
- **PASS** — Loading, error and retry. Held one real History request to observe loading, then aborted its transport. Retry reached the real API, returned HTTP 200, and rendered its result. No response was mocked. [14-loading](chrome/14-loading.png) · [15-network-error](chrome/15-network-error.png) · [16-retry](chrome/16-retry.png)
- **VERIFIED** — Disposable fixture cleanup. Test property 48974 soft-delete returned HTTP 200. Uploaded test media and audit history may remain in development storage.
- **PASS** — Logout. Logout cleared the session and the protected route redirected back to login. [17-logout](chrome/17-logout.png)
- **VERIFIED** — Console and network. 0 uncaught/browser console errors, 0 unexpected same-origin API responses of HTTP 400 or higher and 0 unexpected API transport failures.

- Frontend regression suite passed all 41 tests. The Next.js production build and standalone asset copy completed. An initial clean build emitted the existing jose Edge runtime warning.
- Backend smoke runner passed all 90 checks. The ASP.NET development server built and started.
- Focused frontend Biome lint and frontend Git whitespace validation passed.

All 38 local report links resolve and all 36 PNGs decode. OCR checked the 18 Chrome captures for the test credentials.

No deploy, commit, or push was performed. The disposable properties were tested in development and soft-deleted. The test note was restored on the fallback development record during an earlier run. Development audit entries and uploaded QA blobs may remain. Narrow viewport and cross-browser visual matching were outside this desktop run.
