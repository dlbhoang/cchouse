# Đối chiếu giao diện Tin tức

Nguồn: Figma C.C.House, section `2420:136701`.

## Thông số đã đối chiếu

| Thành phần | Figma | Node |
| --- | --- | --- |
| Màu nút chính | `#0588F0`; hover `#0D74CE` | 2420:136771, 602:61 |
| Nút trung tính hover | nền trắng, viền `#AEB4BF` | 602:93 |
| Bảng tin | 1308 px, tiêu đề 44 px, hàng 100 px | 2420:136786 |
| Ảnh trong bảng | 48 × 40, bo góc 6 | 2420:136827 |
| Nút chức năng | 40 × 40, icon 16, bo góc 10 | 2420:136848 |
| Menu nguồn tin | 240 × 92; Viết bài / Chia sẻ | 2420:137622 |
| Modal thêm danh mục | 384 × 220 | 2747:162624 |
| Modal danh mục | rộng 384; tiêu đề bảng 44, hàng 48; icon trần 24 | 2747:166554 |
| Modal bài viết | rộng 1152; thân cuộn khi màn hình thấp | 3114:162988 |
| Xác nhận xóa | rộng 448 | 2790:143532 |
| Xem trước | 1152 × 752, giới hạn theo viewport | 2420:137597 |

## Đối chiếu bản cập nhật ngày 18/10/2026

Đã xem lại các frame trong section `2420:136701`, gồm danh sách rỗng `5102:157268`, danh sách có dữ liệu `2420:136745`, form thêm `2420:136702` / `3114:162985`, form sửa `3111:145530`, modal xem trước `2420:137594`, quản lý loại tin `2787:142639` và trạng thái hover `101`.

- Có trạng thái danh sách rỗng và danh sách có dữ liệu.
- Có form thêm, form sửa, modal xem trước, thêm/sửa/xóa loại tin.
- Ghi chú hover trong layer nói icon chỉnh sửa xuất hiện khi rê chuột.
- Bảng có mẫu `Chờ duyệt` và `Đã duyệt`; các hàng mẫu đều hiện Sửa/Xóa. Thiết kế này chưa bao phủ hết luồng nghiệp vụ.
- Form thêm/sửa có Xem trước, Từ chối, Gửi duyệt bài; chưa có thao tác Duyệt bài.
- Chưa thấy hàng/nhãn minh họa riêng cho `Từ chối`, `Đã ẩn`, `Hết hạn`, hoặc thao tác Hiển thị lại.

## Ghi chú cần Phương / mợ Kiều bổ sung bản vẽ

- Đã mở lại section `2420:136701` ngày 18/10/2026. Bảng mẫu đang thể hiện các hàng `Chờ duyệt` và `Đã duyệt`; cột chức năng trong mẫu có Sửa / Xóa. Section chưa có hàng mẫu riêng cho `Từ chối`, `Đã ẩn` hoặc `Hết hạn`.
- Luồng cần thiết kế đủ các trạng thái và thao tác theo quy tắc đã chốt:

| Trạng thái / luồng | Hiện có trong Figma | Cần bổ sung hoặc chỉnh |
| --- | --- | --- |
| Thêm tin mới | Có màn hình form | Ghi rõ sau khi gửi tin chuyển sang `Chờ duyệt` |
| Chờ duyệt | Có nhãn trạng thái và mẫu hàng | Bổ sung vị trí thao tác `Duyệt` / `Từ chối`; giữ quyền sửa khi chưa duyệt. Form hiện có Từ chối, code bổ sung xác nhận Duyệt trong form |
| Đã duyệt / đang hiển thị | Có nhãn trạng thái và mẫu hàng | Mẫu đang có icon Sửa, mâu thuẫn với quy tắc không sửa tin đã duyệt; thay bằng `Ẩn`, `Hết hạn`, `Xóa`. Code khóa Sửa và thêm Hết hạn |
| Từ chối | Chưa thấy mẫu hàng/trạng thái | Bổ sung hiển thị lý do từ chối và luồng sửa rồi gửi duyệt lại |
| Đã ẩn | Chưa thấy mẫu hàng/trạng thái | Bổ sung trạng thái và thao tác `Hiển thị lại` |
| Hết hạn | Chưa thấy mẫu hàng/trạng thái hoặc thao tác | Bổ sung trạng thái; trên hàng đang hiển thị cần có thao tác chuyển sang `Hết hạn`. Code đã có thao tác và nhãn trạng thái trung tính theo màu trạng thái mặc định |
| Xóa | Có icon Xóa và modal xác nhận | Đủ cơ sở cho luồng xác nhận xóa trong phần đã xem |

- Cần bổ sung thiết kế trạng thái `Từ chối`, `Đã ẩn`, `Hết hạn`, Duyệt, Hiển thị lại, thao tác Hết hạn và các màn hình mobile để có cơ sở xác nhận đầy đủ.
- Cần thống nhất vùng thao tác Duyệt/Từ chối trong Figma. Code đặt xác nhận Duyệt trong form Chờ duyệt, còn mẫu bảng vẫn theo bố cục Figma và chỉ có Sửa/Xóa cho các hàng chưa duyệt.
- Cần sửa mẫu hàng Đã duyệt trong Figma để bỏ Sửa theo quy tắc tin tức đã chốt.

## Phạm vi kiểm tra

- Đã kiểm tra trực tiếp màu hover, nhãn nổi, mở/đóng form, xác thực danh mục rỗng, sửa danh mục rồi hủy, mở xác nhận xóa rồi hủy và menu nguồn tin.
- Đã kiểm tra modal 320 × 640: không vượt viewport, thân cuộn riêng, footer hiển thị.
- Đã xác nhận menu nguồn 240 × 92 và đổi nguồn vẫn giữ `NewsTypeIds`.
- Phát hiện nút Viết bài vượt khung ở tablet 768 px; đã sửa khả năng co của SidebarInset, vùng nội dung và form. Cần kiểm tra lại trực tiếp sau khi server/trình duyệt tải được trang.
- Đã đo lại modal danh mục: nội dung 384 × 464, tiêu đề bảng 44, cả 5 hàng đều 48 px. Phát hiện khoảng trống baseline trong Ant Space làm hàng cao 52 px; đã sửa và đo lại đạt.
- Chưa gửi bài, duyệt, ẩn hoặc xóa dữ liệu thật trong đợt kiểm tra này.
- Sau sửa bố cục tablet: `npm run type-check` và `git diff --check` đạt. React Doctor chạy lại báo không có issue trên 24 file đã quét (điểm tổng 73/100).
- Phiên kiểm tra tiếp theo ngày 17/10 đã mở được Tin tức trong trình duyệt ứng dụng. Viewport thực tế 760 × 827; gọi đổi kích thước không thay đổi `innerWidth`, nên không ghi nhận các kích thước yêu cầu là đã test. Ở 760 px, nút Viết bài nằm trong khung và document không tràn ngang.
- Đo hover: nút chính `rgb(13,116,206)`; nút Thêm nền trắng, viền `rgb(174,180,191)`, chữ `rgb(10,10,10)`.
- Thêm danh mục: 384 × 220; gửi rỗng hiển thị “Vui lòng nhập chủ đề”. Sửa danh mục rồi hủy hoạt động.
- Form bài viết nằm gọn viewport 760 × 827; Xem trước khi thiếu dữ liệu báo các trường bắt buộc; xem tin đã duyệt chỉ có Đóng, không có sửa.
- Hộp thoại ẩn/xóa tin mở đúng và hủy được; xác nhận ẩn rộng 448 px. Không xác nhận thay đổi dữ liệu thật.
- Bộ lọc danh mục + nguồn, tìm kiếm/xóa tìm kiếm, chọn trạng thái và mốc ngày cập nhật URL. Phát hiện xóa mốc ngày sau preset bị bỏ qua và giá trị cũ bị giữ trong form; đã sửa. Ca hồi quy “7 ngày trước → xóa → Chờ duyệt” đạt: URL chỉ còn `pageIndex=1&Status=2`, ô ngày rỗng. Đã trả danh sách về `pageIndex=1`.
- Ảnh kết quả: `/Users/dlb/.codex/visualizations/2026/10/16/01a143c2-d7cd-7d80-ac0e-c0bcbe704187/news-tested-760.jpg`.
- Rà soát 18/10: danh sách local hiện có `Đã duyệt` và `Đã ẩn`, bộ lọc `Chờ duyệt` trả về rỗng. Đã mở form thêm, gửi rỗng và xác nhận các trường loại tin, ảnh, tiêu đề, tóm tắt, nội dung bị chặn; không tạo/sửa/xóa dữ liệu thật.
- Sau cập nhật luồng: `npm run type-check` đạt; kiểm tra form `node --test tests/news-validation.test.cjs` đạt 20/20; `dotnet run --project tests/NewsWorkflowSmoke/NewsSmoke.csproj` đạt 90/90; React Doctor quét 25 file, không phát hiện issue; `git diff --check` đạt.
- Vì danh sách Chờ duyệt hiện rỗng, nút Duyệt mới chưa được bấm trên UI có dữ liệu. Hành vi chuyển trạng thái và giới hạn theo từng trạng thái đã được kiểm tra trong smoke test backend.
