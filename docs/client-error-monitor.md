# Client error monitoring

- Admin page: `/admin/config/error-monitor` (Cài đặt khác → Theo dõi lỗi).
- API: `POST /api/client-errors` receives authenticated browser errors. `GET /api/client-errors?day=YYYY-MM-DD&kind=react&q=search&page=1` lists 50 reports per page; only manager roles 1, 2, 6 can read.
- Captures window errors, unhandled rejections, React error boundaries, script/style loading failures and shared Axios API failures. Does not capture arbitrary console messages or server exceptions outside these flows.
- Server derives user identity from the authenticated session; client-supplied identity is ignored. No form/request bodies, cookies or authentication headers are captured. URLs have query strings and fragments removed; common secrets and email addresses are redacted.
- Client deduplicates identical reports for 30 seconds and sends at most 20 reports/minute. Server permits 60 reports/user/minute/process and bounds reports to 20 KB. A daily log is capped at 10 MB.
- Logs use daily JSONL files, retained for 30 days (cleanup on ingestion), with serialized writes in one Node process. Configure `CLIENT_ERROR_LOG_DIR` to a persistent absolute directory. `deploy.sh` sets `/var/www/cchouse/.runtime/client-errors` so `.next` rebuilds preserve logs. For multiple application processes/hosts, use a shared database/logging service instead of this single-instance store.
- Page groups by UTC day and displays timestamps in the viewer's timezone, polls every 30 seconds while visible, supports type/search filtering, pagination and stack details.
- Verification: `node --test tests/unit/client-errors.test.cjs`, `npx tsc --noEmit`, targeted lint and production build. Temporary browser fixtures must be removed before deployment.
