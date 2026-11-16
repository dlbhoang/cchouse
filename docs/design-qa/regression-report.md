# Regression report — 16/11/2026

> Cập nhật: vòng mock data và UI responsive mới nhất nằm trong [mock-ui-comparison.md](mock-ui-comparison.md). Những giới hạn dữ liệu/Figma quota bên dưới thuộc vòng trước.

## Kiểm tra tự động

- TypeScript: `npm run type-check`, pass ở vòng responsive; log `type-check-responsive.log`.
- Existing unit tests: `node --test tests/news-validation.test.cjs tests/unit/client-errors.test.cjs`, **22/22 pass**, không skip; log `tests-responsive.log`.
- Lint: project dùng **Biome**, không có script ESLint riêng. `npm run lint` fail **17 errors,43 warnings**, cùng số lượng baseline. Output mặc định giới hạn diagnostics nên không suy ra chỉ từ số lượng rằng toàn bộ danh sách lỗi hoàn toàn giống nhau. Không tự sửa các lỗi ngoài scope. Log baseline `lint.log`, hiện tại `lint-responsive.log`.
- Lint hai component chỉnh responsive: `changed-responsive-lint.log`, không error; một warning `handleInputConfirm` đã có ở news listing.
- Production: Next build cuối **pass (exit0)**, gồm kiểm tra types và53 static pages. Chạy trực tiếp để tránh bước `npm i` không cần thiết trong script build. Log `build-responsive.log`; packaging **pass (exit0)** bằng `/Users/dlb/.bun/bin/bun copy-files.ts`, log `package-responsive.log`. Shell không có Bun trên PATH, nên dùng executable đã cài. Không cài package mới.
- React Doctor: đã thử; không hoàn tất vì registry DNS `ENOTFOUND`, log `react-doctor-responsive.log`. **Không có score/pass** từ công cụ này.
- `git diff --check`: pass khi kiểm tra vòng responsive.

## Browser và dữ liệu thật

Đã dùng Chrome thật với phiên đăng nhập được cho phép. News1269 bài, agency57 cơ quan, address34 tỉnh/thành và172 phường/xã tại TP.HCM. Property API trả0 ở bộ lọc mặc định và cả các trạng thái đã thử trong vòng trước. Không thay bằng mock để làm populated screenshot.

Đã kiểm tra navigation đến bốn route, layout desktop/mobile/tablet, bộ lọc và modal mở/đóng. Drawer mobile property sửa overflow đã đo lại390px. News create366px, agency create374px, address create390px nằm trong390px. Các thao tác ghi/xóa nghiệp vụ không được thực hiện. Existing unit tests kiểm tra validation; không tuyên bố đã thử lưu thành công tất cả form hoặc tất cả quyền với nhiều tài khoản.

API reads trên các route trả200 trong log server khi duyệt. App tự gửi client-error telemetry cho các cảnh báo đang có; không đổi endpoint/contract. Console còn cảnh báo Ant Design deprecated props, findDOMNode, onSearch/showSearch và logo aspect ratio; lưu phần đầu message trong `evidence/browser-responsive-warnings.json`. Không tuyên bố console sạch.

Production smoke ở `production-responsive-smoke.json`: bốn protected route không cookie trả307 về login, ba SVG trả200 image/svg+xml. Đây là kiểm tra auth guard/assets, không phải bằng chứng mọi permission hoạt động. Sau build cuối đã mở lại **cả bốn route** bằng phiên Chrome có quyền; chờ dữ liệu thật/empty state tải xong rồi chụp đúng viewport. Address title y118, agency panel1332×668 tại(92,262), news1269 bài, property0 kết quả. Bản production cuối đang chạy tại localhost:3003.

## Còn thiếu

- Property populated, loading/error theo từng API và form add/edit đầy đủ chưa được nghiệm thu trực quan.
- Toàn bộ trạng thái keyboard/hover/disabled, tất cả dropdown và permission matrix chưa được kiểm thử.
- Các frame/modal chi tiết chưa đọc được sau khi Figma approval review chặn vì hạn mức; xem audit report.
- Raw pixel diff có yếu tố dữ liệu và sai khác màu capture. Không quy đổi thành9.5–10/10.
