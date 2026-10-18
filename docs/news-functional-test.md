# Báo cáo kiểm thử chức năng tin tức

Ngày kiểm thử: 17/10/2026. Trang: `http://localhost:3003/admin/config/news`. API: `http://localhost:5224`.

## Kết quả

- **Giao diện trực tiếp:** mở danh sách, đọc dữ liệu, chuyển trang, đổi 30 xuống 10 dòng/trang, quay về trang 1; lọc theo danh mục và người đăng; tìm bài; chọn trạng thái và mốc ngày. Xác nhận tin kế tiếp trên trang 2 là mã 1239, bộ đếm 1269 tin / 43 trang, bộ lọc danh mục Phong thủy và người đăng Lập Trình Viên trả về đúng các bản ghi.
- **Màu nút:** màu nền nút Viết bài đo trực tiếp là `rgb(5, 136, 240)` (`#0588F0`), khớp màu chính đã đối chiếu với Figma.
- **Nguồn và trạng thái:** lọc `Chia sẻ` trả về tin 1282/1277; `Viết bài` trả đúng các tin tự viết; tìm tiêu đề kết hợp với nguồn viết trả đúng bài 1263 và các tiêu đề cùng khớp. Lọc `Đã ẩn` trả về dữ liệu; `Chờ duyệt`, `Từ chối`, `Hết hạn` hiện không có bản ghi trong database dev nên không thể thử tiếp trên giao diện.
- **Quyền sửa:** mở trực tiếp `/admin/config/news/edit/1283` cho thấy tin đã duyệt bị khóa, không mở form sửa.
- **Tạo bài trên UI:** điền đủ loại tin, tiêu đề, tóm tắt và nội dung rồi submit khi ảnh không tải được. Form hiển thị lỗi ảnh bắt buộc và không gửi bài; tìm lại tiêu đề test xác nhận không có bản ghi được tạo.
- **Xem tin:** mở được chi tiết tin đã duyệt từ bảng và đóng lại bình thường.
- **Loại tin:** đã tạo `ZZ TEST E2E 20261017`, đổi tên, rồi xóa mềm loại thử không có tin liên kết. Đã xác nhận loại này không còn trên giao diện sau khi xóa.
- **Ẩn/Xóa bài:** mở đúng hộp thoại xác nhận cho tin thật rồi hủy cả hai thao tác; không đổi trạng thái hay xóa bài có sẵn.
- **Biểu mẫu:** đã kiểm tra trường bắt buộc, nội dung editor rỗng/HTML chỉ có khoảng trắng, loại tin, nguồn chia sẻ, ảnh thiếu/đang tải/tải lỗi, giới hạn tiêu đề 150 và tóm tắt 350 ký tự. 20 kiểm thử xác thực đều đạt.
- **Luồng API:** gọi trực tiếp application handlers với repository giả lập: các chuyển trạng thái duyệt/từ chối/ẩn/hết hạn trên 5 trạng thái, metadata người duyệt/từ chối, sửa và gửi duyệt lại, tạo tin, thiếu loại tin/bản ghi, giới hạn dữ liệu và bộ lọc. 78 kiểm thử đạt.
- **Kiểm tra mã:** `npm run type-check` đạt; React Doctor quét 25 file, không phát hiện issue; API build đạt 0 lỗi; frontend `git diff --check` đạt.

## Lỗi được phát hiện và sửa

- API không nhận được `CreatedBy` và `NewsTypeIds` từ query vì các thuộc tính chỉ có getter. Đã cho phép bind, và lọc danh mục/người đăng trên giao diện trả dữ liệu tương ứng.
- Danh sách chỉ có một trang vì API list không trả tổng số bản ghi. Giao diện nay tải count riêng và hiển thị 43 trang.
- Kích thước trang mặc định ở frontend lệch mặc định API; đổi cỡ trang khi đang ở trang sâu cũng giữ index cũ. Đã đồng bộ mặc định và reset về trang 1 khi đổi cỡ.
- Nội dung bài chia sẻ có thể bị ghi đè loại nguồn lúc submit; payload nay giữ lựa chọn radio.
- Bản ghi ẩn/hết hạn cũ không có audit metadata vẫn có thể lọt qua điều kiện cho sửa. API hiện chỉ cho sửa Pending/Rejected và chặn tất cả bản ghi có metadata duyệt.
- Thêm kiểm tra Title tối đa 150 và Source bắt buộc với bài chia sẻ ở API; build đã xác nhận.

## Giới hạn lượt kiểm thử

- Không tạo/duyệt/ẩn/xóa bài thật. Có tạo loại tin thử rỗng và xóa mềm sau khi kiểm tra CRUD; không còn hiện trong giao diện. Dữ liệu giao diện đến từ database dev dùng chung, nên không đổi trạng thái hoặc xóa các bài có sẵn.
- Đã thử tải một PNG thử qua giao diện. `POST /api/Images/Upload` trả HTTP 500: Azure Blob báo `ResourceNotFound` (container/resource không tồn tại). Form xóa ảnh thử và chặn gửi bài khi chưa có ảnh; không có bài nào được lưu. Đây là blocker hạ tầng cho kiểm thử tạo/chỉnh sửa thật qua UI.
- Vì vậy 78 handler checks không xác nhận HTTP authorization, lưu SQL thực, upload storage hay hiệu ứng toàn hệ thống sau khi duyệt/ẩn/xóa. Các trạng thái Chờ duyệt/Từ chối/Hết hạn cũng chưa có fixture dev để kiểm thử tương tác UI.
- UI hiện không có nút Duyệt/Hết hạn vì Figma được cung cấp không có vị trí cho các thao tác này và người dùng đã chọn giữ đúng bản vẽ. Đã ghi chú chênh lệch thiết kế trong [news-figma-audit.md](news-figma-audit.md).
- React Doctor báo điểm tổng 73/100 nhưng không có issue trong 25 file đã quét.
- Log `Failed to bind ... 5224: address already in use` xảy ra khi chạy thêm một `dotnet run` trong lúc API đã chiếm cổng. API đang chạy là cùng máy chủ dùng cho giao diện; chỉ cần giữ tiến trình đó, không mở server thứ hai.
- `git diff --check` ở API báo một khoảng trắng cuối dòng trong `cchouse.Application/Features/Customer/Services/CustomerService.cs`, nằm ngoài phần tin tức và không được sửa.
