# Implementation report — 16/11/2026

> Cập nhật: vòng mock data và UI responsive mới nhất nằm trong [mock-ui-comparison.md](mock-ui-comparison.md). Những giới hạn dữ liệu/Figma quota bên dưới thuộc vòng trước.

Đã tiếp tục triển khai cả bốn route, gồm shared theme/empty states từ vòng trước và các sửa geometry/responsive trong vòng này. Giữ toàn bộ dữ liệu động, authentication, authorization, route và API contract. Không sửa backend/public site, không thêm dependency, không tạo/xóa bản ghi nghiệp vụ để chụp ảnh.

## Component dùng chung

- `src/lib/core/configs/admin-design.ts`: token Ant Design/CSS scoped cho bốn route.
- `src/lib/styles/admin-design.css`: shell, focus, empty state, geometry route cụ thể, responsive address/agency và panel cuộn desktop.
- `src/lib/components/shared/AdminEmptyState.tsx`: empty state có aria-live, dùng property/news.
- SVG đúng reference trong `public/assets/admin/`; giữ nguyên `news-empty.svg` đã có của người dùng.

## File sửa trong toàn bộ đợt

- `src/components/layouts/index.tsx`: theme scope và variables.
- `src/lib/components/AntProvider.tsx`: dùng shared theme trong scope.
- `src/lib/components/admin/property/table/index.tsx`: empty state thật, không áp dụng khi loading/error/cart; giữ table/API.
- `src/lib/components/admin/property/filter/property-filter.css`: letter-spacing title0 theo Figma.
- `src/lib/components/admin/property/filter/MobileView.tsx`: hai nút drawer chia đều hàng, sửa overflow744→390px.
- `src/lib/components/admin/news/filter/index.tsx`: dropdown nguồn controlled, keyboard và đóng khi chọn.
- `src/lib/components/admin/news/listing/index.tsx`: empty state, aria-pressed categories, nhóm heading gap8.
- `src/lib/components/admin/news/table/columns.tsx`: cột loại tin119px theo context.
- `src/lib/styles/globals.css`: news table header14px/20px.
- `src/lib/pages/config/address/address-manager/index.tsx`: class geometry, typography, selection state và responsive modebar.
- `src/lib/pages/config/agency-manager/index.tsx`: class page/title bar và bỏ padding lặp; giữ card/data/business logic.

Các thay đổi và `.github/` đã tồn tại được bảo toàn; không nhận chúng là phần mới tự tạo trong vòng responsive. Không thay package.json/lockfile.

## Bằng chứng

- Desktop: `screenshots/after/property-1440.jpg`, `news-1440.jpg`, `address.jpg`, `agency.jpg`.
- Mobile: `screenshots/after/property-390.jpg`, `news-390.jpg`, `address-390.jpg`, `agency-mobile.jpg`.
- Tablet: ảnh `*-768.jpg`, `agency-tablet.jpg`; màn hình ngang `*-1024.jpg`.
- Forms: `screenshots/after/news-create-mobile.jpg`, `address-create-mobile.jpg`, `agency-create-mobile.jpg`, `property-advanced-mobile.jpg`.
- Overlay/diff và số đo: xem `visual-differences.md`, `evidence/`.

Trạng thái: đã có triển khai và kiểm tra thực tế; **chưa tuyên bố đạt toàn bộ pixel-perfect acceptance**. Các giới hạn và sai lệch còn lại được ghi trong visual/regression report.
