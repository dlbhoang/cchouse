# Chọn khu vực và giao diện gọn — 16/11/2026

Theo yêu cầu mới, trang Mua bán ưu tiên kích thước gọn trên laptop; các số đo pixel Figma của trang này trong báo cáo trước là lịch sử.

- Nút chọn khu vực trong gợi ý tìm kiếm dùng lại `AddressSelectCustom`, thay panel `AreaSelector` chỉ có dữ liệu giữ chỗ. Chọn theo API/form hiện có, gửi ID tỉnh/quận/phường/đường thay vì ghép tên vào từ khóa.
- Nút là button thật, thao tác bàn phím được. Danh sách địa chỉ có z-index1200 để không bị panel1100 che; popup con nằm trong panel khi dùng inline.
- Các cấp con được xóa khi đổi cấp cha. Dùng cùng form, callback đóng panel sau khi submit. Giữ nút Khu vực cũ và các nơi dùng component này.
- Cố định `searchOptions` theo query bằng useMemo để render lại trang không tự tạo model mới và ghi đè lựa chọn đang nhập.
- Desktop: header78→64px, trường40→36px, tiêu đề24→20px, padding bộ lọc24→12px, ô bộ lọc co theo màn hình, bảng dùng font13px/padding8px. Không dùng CSS zoom hoặc transform scale.
- Browser đã chọn Hồ Chí Minh → Quận1 → phường → đường và Apply thành công; URL chứa cả `ProvinceId=1&DistrictId=1&WardId=1&StreetId=1`. Có assertion kiểm tra cả bốn query params.
- Kiểm tra1024/1280/1366/1440×768: không tràn document; header64px, filter136–138px. Bảng rộng được cuộn bên trong. Xem `evidence/area-filter-compact.json` và `screenshots/property-compact-*.jpg`.
- TypeScript pass; lint4file vừa sửa pass (`lint-area-fix.log`); 37tests pass (`tests-area-fix.log`), gồm2 test mới cho inline apply và dropdown cũ.
- Production build pass (`build-area-fix.log`); còn cảnh báo tải stylesheet Google Fonts do mạng. Đã mở lại preview3003 sau build.

Vẫn dùng chế độ mock development đã bật ở vòng trước. Không kiểm tra kết quả lọc với dữ liệu production hoặc ghi/xóa bản ghi.
