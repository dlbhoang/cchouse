# Visual QA iterations — 16/11/2026

> Cập nhật: vòng mock data và UI responsive mới nhất nằm trong [mock-ui-comparison.md](mock-ui-comparison.md). Những giới hạn dữ liệu/Figma quota bên dưới thuộc vòng trước.

## Phương pháp và giới hạn

Ảnh trình duyệt thật nằm tại `screenshots/before/` và `screenshots/after/`. Reference Figma nằm tại `figma/`. `compare_images.py` tạo overlay 50%, absolute RGB diff và JSON bằng Pillow/numpy có sẵn; không resize, đổi màu, che nội dung hay dùng ảnh reference trong sản phẩm. Đã kiểm tra phép tính bằng ảnh synthetic giống nhau (MAE0) và đen/trắng (MAE255).

`screenshots/overlay/`, `screenshots/diff/` và `evidence/image-metrics.json` chứa kết quả. Chỉ crop browser chrome78px và phần viewport tương ứng trong reference. Address baseline bị giới hạn ảnh1440×763; so sánh trước/sau của route này dùng **cùng phần đầu763px**, bản sau đầy đủ vẫn lưu1440×946. Không coi baseline này là ảnh đủ viewport yêu cầu.

Màu screenshot JPEG có sai khác với computed DOM (ví dụ primary DOM rgb(5,136,240), ảnh chụp thiên tím). Chưa xác định nguyên nhân capture; không bù màu CSS hay sửa ảnh để làm đẹp số đo. Dữ liệu thật, timestamps, ảnh tin và số bản ghi khác Figma cũng ảnh hưởng diff. Các metric dưới đây **không phải điểm fidelity /10**; nền trắng lớn có thể làm raw pixel score trông tốt hơn thực tế.

## Vòng 1 — geometry và typography desktop

- **Property / thấp:** heading letter-spacing0.2px, width227.74px; Figma0%, width223px. Sửa tại `src/lib/components/admin/property/filter/property-filter.css`. Sau: width224.74px, font24/32/700; filter và empty giữ đúng `(108,110,1300,170)` / `(108,380,1300,628)`. Chênh text width1.74px còn tồn tại. Header/nav/icon và bảng populated chưa được nghiệm thu.
- **News / vừa:** breadcrumb-title dùng gap10 thay8 làm filter/tabs/table lệch xuống2px; header13px và padding8; cột loại tin120 thay119. Sửa đúng heading wrapper, header table và column definition. Sau: heading group y94/h64; filter y168/h72; tabs y250/h72; header `(100,338,83,44)` và cột kế119px, font14/20, padding12. Nguồn: `evidence/news-baseline-dom.json`, `news-final-dom.json`.
- **Address / vừa:** modebar lệch trái8px; heading do căn giữa hàng40px lệch xuống4px. Sửa margin modebar và căn đầu toolbar ở desktop. Modebar đã đo `(92,174,1332,60)`. Cột dữ liệu dùng cuộn nội bộ và chiều cao theo viewport, khác chiều cao frame Figma kéo quá phần màn hình. Nguồn: `evidence/address-final-dom.json`.
- **Agency / cao:** panel giãn theo57 bản ghi (cao5613px) làm cuộn cả trang; search90px thay88, panel y260 thay262. Sửa chiều cao page desktop, search88, title bar80 theo đúng padding24/16, bỏ khoảng gap lặp. Sau: search `(92,94,1332,88)`, heading x92/y206/h32, panel **`(92,262,1332,668)`**, document height946; dữ liệu cuộn trong panel. Nguồn: `evidence/agency-final-dom.json`.

## Vòng 2 — responsive và tương tác

- Address: dưới1024px toolbar/mô tả xếp dòng; cột có chiều rộng đọc được và cuộn ngang trong container, snap theo cột. Kiểm tra390×844,768×1024,1024×768; document scrollWidth bằng viewport. Không ẩn thao tác edit/delete trên thiết bị cảm ứng.
- Agency: dưới1280px bộ lọc grid hai cột, ô tìm kiếm trọn hàng; dưới640px một cột. Ở768px hai field đều315px, search642px. Mobile390px không tràn document. Modal create374px nằm trong viewport390px, không tràn nội dung.
- Property: kiểm tra390/768/1024/1440px, document không tràn. Advanced drawer mobile có footer rộng744px vì hai nút cùng `w-full`. Sửa tại `MobileView.tsx` để mỗi nút `min-w-0 flex-1`. Đo lại drawer clientWidth=scrollWidth=390, không còn descendant vượt mép phải. Ảnh sau tại `screenshots/after/property-advanced-mobile.jpg`.
- News: kiểm tra390/768/1024/1440px, bộ lọc xuống dòng, bảng giữ cuộn ngang trong vùng riêng. Create modal366×820 nằm trong390×844, nội dung không tràn ngang. Không ghi bài kiểm thử vào API thật.

## Raw pixel metrics trước → sau

MAE thang0–255; tỷ lệ pixel có ít nhất một kênh lệch>16. Không đặt threshold để tự tuyên bố pass.

- Property: MAE **3.161 → 3.022**; pixel **3.048% → 2.974%**.
- News: MAE **12.031 → 10.550**; pixel **12.501% → 9.808%**.
- Address (cùng crop763px): MAE **13.516 → 10.635**; pixel **12.620% → 8.135%**.
- Agency: MAE **8.430 → 7.919**; pixel **10.188% → 9.085%**.

Số đo cuối được tái tạo từ ảnh production sau build. Address đầy đủ946px nằm trong JSON riêng. Số đo thay đổi giữa các vòng capture; không dùng một metric đơn lẻ để kết luận đạt pixel-perfect.

## Fidelity và phần chưa đạt

Cả bốn route: **điểm /10 chưa được xác nhận**, không kế thừa các điểm chủ quan của vòng trước. Các bbox đã đo ở trên là bằng chứng cụ thể, không đủ để kết luận toàn bộ màn hình đạt9.5. Property populated không có dữ liệu thật cho tài khoản/bộ lọc đã thử; không dùng mock. News còn sai khác nội dung, một số column sizing và table height/pagination so với reference1114px. Topbar/sidebar còn khác icon/logo/spacing và nút cấu hình dành cho admin. Form add/edit, dropdown và interaction states chưa được đối chiếu toàn bộ vì giới hạn Figma. Chưa đạt toàn bộ tiêu chí nghiệm thu pixel-perfect.
