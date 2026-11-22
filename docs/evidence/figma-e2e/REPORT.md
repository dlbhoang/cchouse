# C.C.House Figma E2E report

**Overall PASS** · 22 November 2026 · Chrome at 1440 × 1024

The production build of the local test website ran at http://localhost:3003. The real ASP.NET API ran at http://localhost:5224 against db_cchouse_dev. All response bodies came from real endpoints. Chrome interrupted one History request at the transport layer to exercise error recovery. The retry reached the real API.

The development Firebase push credential could not be parsed during fixture setup. For the rerun, the local API used its existing no-credentials path for Firebase. Authentication, database operations, uploads and blob playback used real services. The Firebase override was process-local.

## Test results

| Test | Steps | Expected | Actual | Result | Evidence |
|---|---|---|---|---|---|
| Authorization | Navigate to the protected property route and request History while signed out. | Redirect to login and reject the unauthenticated API call. | Direct History API rejected unauthenticated access with HTTP 401. The protected property page redirected to login. | **PASS** | [01-authorization.png](01-authorization.png) |
| Login | Sign in using the Chrome form. | Render the protected property table. | The Chrome session reached the protected property table. | **PASS** | [02-authenticated.png](02-authenticated.png) |
| Property history | Open a property’s history icon and compare with the real History response. | Show matching audit rows and metadata. | History HTTP 200. UI count, first date, editor and field matched 2 API entries on record 48971. | **PASS** | [03-property-history.png](03-property-history.png) |
| Note history | Open note history and compare with the note-only History response. | Show matching note audit entries. | NoteOnly=true returned HTTP 200. UI count and first entry matched 12 note audit entries on record 48966. | **PASS** | [04-note-history.png](04-note-history.png) |
| Add note and persistence | Open the editor, save a unique note, refresh Chrome and reopen history. | Reject an empty draft and show the saved note before and after reload. | QuickUpdate HTTP 200 and NoteOnly history HTTP 200 after full reload. The unique note matched the API and UI on test record 48971. Original note restored after evidence capture. | **PASS** | [11-add-note.png](11-add-note.png), [12-note-submitted.png](12-note-submitted.png), [13-note-persisted.png](13-note-persisted.png) |
| image history | Select image history and compare additions and removals to both API reads. | Use the image filter and show the correct file totals. | Both IsVideo=false endpoint requests returned HTTP 200. UI totals matched 1 current and 1 removed files on record 48971. | **PASS** | [07-image-history.png](07-image-history.png) |
| Image removals | Compare removal groups to the deleted-only response. | Show the removed image and correct count. | 1 removed images matched the real API. | **PASS** | [07-image-history.png](07-image-history.png) |
| Image preview | Open an image tile in Chrome. | Decode and display the real image. | The image preview decoded and displayed the real file. | **PASS** | [08-image-preview.png](08-image-preview.png) |
| video history | Select the video filter and compare the API reads to the timeline. | Show the correct real video file and totals. | Both IsVideo=true endpoint requests returned HTTP 200. UI totals matched 1 current and 0 removed files on record 48971. | **PASS** | [09-video-history.png](09-video-history.png) |
| Video playback | Open a video and start playback in Chrome. | Playback time advances on the real asset. | The real video decoded and currentTime advanced during playback. | **PASS** | [10-video-playback.png](10-video-playback.png) |
| image filters and empty | Open the image filter on a record with no media. | Use the right flags and render the empty state. | Both real read requests returned HTTP 200 with the correct IsVideo and IsDeleted flags and empty arrays. | **PASS** | [07-image-history-empty.png](07-image-history-empty.png) |
| video filters and empty | Open the video filter on a record with no media. | Use the right flags and render the empty state. | Both real read requests returned HTTP 200 with the correct IsVideo and IsDeleted flags and empty arrays. | **PASS** | [09-video-history-empty.png](09-video-history-empty.png) |
| Empty | Open note history on a record without notes. | Render the empty state from the real empty array. | Real note history request returned HTTP 200 with an empty array. | **PASS** | [05-empty.png](05-empty.png) |
| Loading, error and retry | Hold one History request, abort its transport, then click Thử lại. | Show loading, display the error, and render real data after retry. | Held one real History request to observe loading, then aborted its transport. Retry reached the real API, returned HTTP 200, and rendered its result. No response was mocked. | **PASS** | [14-loading.png](14-loading.png), [15-network-error.png](15-network-error.png), [16-retry.png](16-retry.png) |
| Logout | Use the account menu to sign out and revisit the protected route. | Clear the session and redirect to login. | Logout cleared the session and the protected route redirected back to login. | **PASS** | [17-logout.png](17-logout.png) |
| Fixture setup | Inspect the recorded real request and runner assertions. | Complete and satisfy the corresponding assertions. | Created disposable test property 48971, uploaded two images and a video to development storage, then edited its price and removed one image. | **VERIFIED** | [API and runner evidence](api-evidence.json) |
| Test note cleanup | Inspect the recorded real request and runner assertions. | Complete and satisfy the corresponding assertions. | Restore PUT HTTP 200. The audit trail preserves test and restore entries. | **VERIFIED** | [API and runner evidence](api-evidence.json) |
| Disposable fixture cleanup | Inspect the recorded real request and runner assertions. | Complete and satisfy the corresponding assertions. | Test property 48971 soft-delete returned HTTP 200. Uploaded test media and audit history may remain in development storage. | **VERIFIED** | [API and runner evidence](api-evidence.json) |
| Console and network | Inspect the recorded real request and runner assertions. | Complete and satisfy the corresponding assertions. | 0 uncaught/browser console errors, 0 unexpected same-origin API responses of HTTP 400 or higher and 0 unexpected API transport failures. | **VERIFIED** | [API and runner evidence](api-evidence.json) |

## Builds and regression checks

- Frontend build and standalone copy — PASS
- API build — PASS
- Frontend regression tests (41) — PASS
- Backend regression tests (90) — PASS

## Fixes applied

- Kept desktop property rows mounted during background revalidation so the note dialog can show the saved entry.
- Preserved Axios transport errors so the history dialog can show error and retry controls.
- Excluded the read-only domain-event collection from property-address and owner snapshots, matching the property snapshot mapping.

## Unresolved issues

- No failed or blocked checks in the recorded final run.

Coverage is the tested desktop viewport and supplied account. Authorization covers signed-out access. A separate lower-privilege account was outside this run. Development audit entries and disposable uploaded blobs may remain after note restoration and property soft-delete. No production data was used. Nothing was deployed, committed, or pushed.
