# UI QA với dữ liệu mẫu — 16/11/2026

Vòng này thực hiện theo yêu cầu mới: dùng mock data và so sánh **thành phần UI**, không chấm nội dung, số lượng bản ghi, tên tài khoản hoặc ảnh bài viết. Báo cáo này cập nhật các giới hạn của vòng responsive trước; các báo cáo cũ được giữ làm lịch sử.

## Phạm vi và nguồn Figma

- `132:14425` → `/admin/property?TransType=1`. Frame populated `214:48004`.
- `2420:136701` → `/admin/config/news`. Frame populated `2420:136745`, bảng `2420:136784`, create `3114:162988`.
- `4837:185121` → `/admin/config/address-manager`. Frame `4837:196672`, create `4918:287152`.
- `4939:291895` → `/admin/config/agency-manager`. Instance `4968:329858`, create `4984:334401`.

Đã lấy lại design context qua Figma MCP thành công: bảng tin tức, sidebar, agency instance và ba create modal. Các tệp `evidence/*-mock-context.txt` chứa nguồn. Lỗi quota Figma trong báo cáo trước là lịch sử, không còn là blocker của vòng này.

## Sai lệch và sửa chữa

- **Property / cao:** cột và chiều cao hàng populated khác reference. Sửa 11 cột về `80/120/130/160/90/140/160/120/100/60/140px`, bỏ ép hàng124px, giữ chiều cao theo nội dung. Header44px, bảng kèm footer628px, footer60px. Sửa lỗi render số0 sau diện tích khi cạnh sau bằng0. Nguồn: `src/lib/components/admin/property/table/`, `shared/CustomRender/RenderArea.tsx`, `styles/admin-design.css`.
- **News / cao:** bảng và phân trang nằm cùng panel, cột người duyệt/hành động sai rộng. Sửa bảng671px, cột160/105px, tách phân trang ra đúng vùng bên ngoài, giữ handlers và dữ liệu động. Thumbnail48×40px, header14/20px, modal title18/28px. Nguồn: `admin/news/listing/`, `admin/news/table/`, `shared/TableBase/CustomPagination.tsx`.
- **Address / vừa:** hàng có border làm cao81 thay80px; dùng đường phân cách inset. Modal thêm có kích thước768×568px, nhóm trường xuống một cột trên điện thoại. Nguồn: `pages/config/address/address-manager/`.
- **Agency / cao:** card có bố cục và chiều cao chưa đúng. Sửa card102px, khoảng cách16px, thông tin phụ12/16px, địa chỉ14/20px; modal768×516px. Nguồn: `pages/config/agency-manager/index.tsx`, `styles/admin-design.css`.
- **Shared / vừa:** topbar icon24px, trigger40px; logo từ asset Figma. Sidebar dùng các biến thể có trong reference: Property40px/icon24, News44px/icon24, cấu hình36px/icon20/gap2. Giữ nút cấu hình server và thông tin tài khoản thật.
- Loại thư mục bằng chứng `docs` khỏi Tailwind source detection để TSX reference trong tài liệu không sinh utility CSS cho ứng dụng. Cú pháp theo [tài liệu Tailwind](https://tailwindcss.com/docs/detecting-classes-in-source-files#ignoring-specific-paths).

## Điểm và bằng chứng đo

Không chấm điểm tổng thể /10 khi chưa có rubric bao phủ toàn bộ màn hình. Điểm chủ quan ban đầu không được tái sử dụng. Thay vào đó, có **15/15 hình chữ nhật thành phần được chọn nằm trong sai số2px** so với MCP; đây là điểm geometry có phạm vi giới hạn, không phải pixel-perfect toàn trang:

- Property: **3/3** — filter `(108,110,1300,170)`, bảng/footer `(108,380,1300,628)`, footer `(108,948,1300,60)`.
- News: **5/5** — heading group, filter, tabs, bảng `(100,338,1308,671)`, phân trang `(84,1035,1340,60)`.
- Address: **3/3** — heading, sidebar item, sidebar icon. Hàng được đo lại cao80px; vùng cột bắt đầu y234, header bên trong y243 do padding8px và border1px.
- Agency: **4/4** — search `(92,94,1332,88)` và ba card `(120,498/616/734,1276,102)`.

Chi tiết: `evidence/component-geometry-mock.json`, `*-mock-dom.json`. Baseline trước sửa có ảnh thật nhưng không có cùng bộ15 phép đo, vì vậy **không đưa ra điểm trước/sau giả định**. Heading Property còn rộng hơn reference khoảng1.74px, Address khoảng1.67px. Font rendering và màu JPEG còn khác reference.

## Ảnh trước/sau và đối chiếu

- Ảnh trước: `screenshots/mock-before/{property,news,address,agency}.jpg`.
- Ảnh sau desktop: `screenshots/mock-after/{property,news,address,agency}.jpg`.
- Overlay50%, RGB diff và metric: `screenshots/mock-comparison/*-{before,after}-{overlay,diff,metrics}.*`.
- Property/News chụp1440×1024; Address/Agency1440×946, bỏ đúng78px browser chrome của reference. News reference cao1114px chỉ crop phần viewport1024px. Không resize, bù màu hoặc che vùng sai.
- Responsive: `screenshots/mock-after/{property,news,address,agency}-{390,768,1024}.jpg`; 12/12 trường hợp `document.scrollWidth === innerWidth`, bằng chứng `evidence/responsive-mock-final.json`.
- Forms: `news-create.jpg`, `news-create-mobile.jpg`, `news-validation-mobile.jpg`, `address-create.jpg`, `address-create-mobile.jpg`, `agency-create.jpg`, `agency-create-mobile.jpg` trong `screenshots/mock-after/`.

Raw pixel metrics có chứa khác biệt dữ liệu/ảnh/tài khoản, chỉ dùng định vị sai lệch; không dùng để chấm dữ liệu hoặc suy ra fidelity. Mobile không có frame reference được chỉ định; được kiểm tra khả năng sử dụng và overflow, không gán pixel score.

## Các phần dùng chung và tệp thay đổi

- `src/lib/core/configs/admin-design.ts`, `src/lib/styles/admin-design.css`: tokens, theme và biến thể responsive có scope.
- `src/lib/components/shared/AdminEmptyState.tsx`, assets trong `public/assets/admin/`: empty state Property/News; giữ asset đã có của người dùng.
- `src/lib/components/shared/TableBase/CustomPagination.tsx`: tái sử dụng phần phân trang có sẵn cho trong/ngoài bảng; `TableBase/index.tsx` thêm `showPagination` mặc địnhtrue.
- Layout: `src/components/layouts/{index.tsx,top-navigation.tsx,app-sidebar/index.tsx}` và `src/lib/components/AntProvider.tsx`.
- Property: `filter/{MobileView.tsx,property-filter.css}`, `table/{columns.tsx,index.tsx}`, shared `CustomRender/RenderArea.tsx`.
- News: `filter/index.tsx`, `listing/index.tsx`, `table/{columns.tsx,columns.css}`, `form/index.module.css`.
- Address: `src/lib/pages/config/address/address-manager/{index.tsx,address-modal.tsx}`.
- Agency: `src/lib/pages/config/agency-manager/index.tsx`; globals: `src/lib/styles/globals.css`.
- Mock: `src/lib/dev/admin-ui-fixtures.ts`, `src/app/api/proxy/[...path]/route.ts`; tests `tests/{admin-ui-fixtures,admin-ui-proxy,render-area}.test.cjs`.
- Tài liệu, ảnh, log nằm trong `docs/design-qa/`. Không sửa package/lockfile, backend, public website hoặc repo khác. Giữ thay đổi chưa commit có sẵn.

## Kiểm tra và giới hạn

- **35/35 tests pass**, gồm22 test có sẵn và13 test fixture/proxy/RenderArea: `tests-mock.log`.
- **TypeScript pass**: `type-check-mock.log`.
- **Production build pass** bằng Next CLI đã cài; **copy standalone assets pass**: `build-mock.log`, `package-mock.log`. Không chạy bước `npm i` của script build để tránh thay đổi dependency/lockfile. Có cảnh báo mạng khi tối ưu stylesheet Google Fonts.
- Production smoke pass: login/session/logo HTTP200; cả bốn route bảo vệ trả307 về login khi chưa đăng nhập. Redirect dùng địa chỉ3003 từ cấu hình hiện có; phép kiểm tra không tự đi theo redirect. Bằng chứng `production-mock-smoke.json`. Đã dừng máy chủ kiểm tra3004 và mở lại mock preview3003.
- React Doctor không chạy được vì registry DNS `ENOTFOUND`; không có điểm từ công cụ: `react-doctor-mock.log`.
- **Lint chưa pass:** 17errors/43warnings toàn repo, cùng số lượng vòng trước: `lint-mock.log`. Không coi số lượng giống nhau là chứng minh từng diagnostic không đổi. Lint nhóm file mới/chỉnh mock trước đó0errors/2warnings: `changed-mock-lint.log`.
- Trình duyệt đã kiểm tra đăng nhập, bốn route, mock populated/empty, News next/first pagination, menu nguồn bằng bàn phím, form required validation, modal và responsive. Console còn cảnh báo API Ant Design cũ/StrictMode: `evidence/browser-mock-console.json`; không tuyên bố console sạch.
- Mock chỉ bật khi cả `NODE_ENV=development` và `ADMIN_UI_QA=1`, cần session; chặn ghi vào proxy khi QA. Test xác nhận production bỏ qua flag và tiếp tục forward auth/API bình thường. Chạy preview bằng `ADMIN_UI_QA=1 npm run dev -- --hostname 127.0.0.1`.
- Không kiểm thử lưu/xóa thật hoặc mọi role/permission. Không thay đổi nghiệp vụ để làm giống dữ liệu Figma. Chưa đối chiếu toàn bộ edit/hover/dropdown state, chưa xác nhận pixel-perfect tổng thể.
