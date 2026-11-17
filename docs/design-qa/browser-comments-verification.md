# Property browser comments verification

Verified on 2026-11-17, route `/admin/property`, authenticated development preview with `ADMIN_UI_QA=1`.

- Reset and apply use local SVG assets retrieved from Figma node `409:29551`; both loaded at 16×16 in the address dropdown.
- Search suggestion footer area action is disabled as requested. Its icon is centered in a 24px circle. The main Khu vực control still opens the address dropdown.
- Focused search input has no outline or box shadow; keyboard focus retains a subtle underline.
- Applying floor 2, bedroom 3 and exclusivity produces count 3. Tooltip DOM is visible with opacity 1 and contains the three matching descriptions. Reset removes the badge. At 873px the button is 132px wide without content overflow.
- At 390px the document width equals the viewport width, with the mobile property card layout.

Screenshots: `screenshots/comments-address-icons.jpg`, `screenshots/comments-more-summary.jpg`, `screenshots/comments-search-fixed.jpg`, `screenshots/comments-mobile.jpg`. Browser screenshot capture dismisses transient focus popovers; tooltip contents and visibility were separately verified through the rendered DOM.

Validation: 40/40 existing and added tests pass (`tests-comments.log`); focused lint passes (`lint-comments.log`); type checking passes (`type-check-comments.log`); production build passes (`build-comments.log`). Build reports unavailable Google font optimization. Browser logs include existing deprecated Ant Design/React API warnings and a circular-reference warning; this verification does not establish that every warning predates the changes.

No production data comparison or write operations were performed. Preview remains in mock mode; production ignores the mock flag. This check covers the five property-page comments, not a renewed pixel-perfect score for all four original pages.
