---
markmap:
  colorFreezeLevel: 2
  maxWidth: 300
---

# AuthApi (v2)
- Register 
- Login
- GetByToken (CustomerWebsiteResponseV2)
- AdminLogin 
- GetByAdminToken (UserAdminResponse)
- AppLogin (with FirebaseInfo)

# cchouse_website

## CustomerWebsiteApi
- Lưu BĐS: /SaveProperty/{id} `(chưa test)`
- DS BĐS đã lưu: /Carts `(chưa xử lý)`
- So sánh BĐS: /CompareProperty/{id} `(chưa xử lý)`
- DS So sánh BĐS đã lưu: /Compares `(chưa xử lý)`
- Lấy thông tin cá nhân: /AuthApi/GetByToken
- Cập nhật thông tin cá nhân: [HttpPut] `(chưa test)`
- Đổi mật khẩu: /ChangePassword `(chưa xử lý)`
- Upload: /Upload `(chưa test)`

## Feed
- Lấy danh sách: / ok
- Xem chi tiết: /{id} ok
- Tạo mới: ok
- Chỉnh sửa:
- Upload: /Upload ok
- Video: /Video

# cchouse_admin
## Property Admin (/Property)
### Get
### GetById
### Create
#### Validate
- Trùng SĐT: Cá nhân, số Cty cấp
- Trùng Địa chỉ: nếu có kiểm tra loại giao dịch đó có chưa => có return bds trùng
### Update
### CheckAddress
- Khi thêm/sửa ở form, nếu địa chỉ thay đổi sẽ gửi lên server => bật modal danh sách cảnh báo trùng (nếu có)
### ChangeOwner (admin, tk)
- Thay đổi người nhập
### ChangeStatus
#### Thay đổi trạng thái giao dịch
- Đã giao dịch => Xoá ghi chú (vẫn giữ lịch sử), hình ảnh cần hỏi lại?
- Chờ xoá => bổ sung lý do xoá
### ChangeNote
- Cập nhật ghi chú nhanh
### ToggleSaveProp
- Lưu/Bỏ lưu giỏ hàng
### Preview
- Xem lại thông tin trước khi đăng tin
### PreviewUpdate
- Cập nhật nhanh thông tin khi đăng tin
### TogglePublic
- Ẩn/Hiện tin đăng ra website
### CountOldProp
- Đếm SL BĐS cũ cần cập nhật (click vào xem danh sách)
### So sánh BĐS
- Đang xử lý lưu local storage (tối đa 5 bđs)


## Customer
- CRUD
## SIM
- CRUD: /api/Sim (xong)
## UserAdmin (v2)
- CRU: / 
- Upload: /Upload
- DS Quản lý: /GetListManager
- Cập nhật thông tin Hoạt động: {id}/UserAccess
- Reset Password: {id}/ResetPassword
- DS BĐS của bạn: Đang lấy DS Bán
- DS Khách hàng: ==chưa có==
- Giỏ hàng bán: done
- Giỏ hàng thuê: done
- Hoạt động: ==Chưa có==
- Đổi mật khẩu: /ChangePassword

## Role 
- CRUD: / (ok)
- Phân quyền: /Permission ==chưa test==

## UserWebsiteAdmin
- Lấy danh sách: /
- Lấy theo id: /{id}
- Khoá tài khoản: /{id}/Block

## Feed
### Lấy danh sách: /
#### ==Vấn đề tồn đọng==: 
- Chưa quét danh sách để kiểm tra Tin hết hiệu lực
### Xem chi tiết: /{id}
### Lấy theo PropID: /GetByPropId/{id}
### ==Bàn luận vấn đề chỉnh sửa==
### Cập nhật Status: /{id}/ChangeStatus
- Từ chối/huỷ hoặc Hết hạn không truy cập đc api này
#### Gồm 4 trạng thái: 
- Chờ xử lý: mới tạo tin
- Đã duyệt: phía webAdmin đã phê duyệt
- Từ chối/Huỷ: phía webAdmin từ chối (ghi lý do), tin Đã duyệt vẫn có thể "huỷ"
- Hết hạn: các tin quá thời gian đăng tin (dựa trên Ngày hết hạn), có TH hết hạn nhưng chưa duyệt tin (xem cột Ngày duyệt tin)
#### Khi hết hạn cho phép đăng lại tin: ?? hỏi thư ký
### Đếm số lượng theo Status: /CountStatus (có kèm filter opts)
### ==Không cho xoá tin từ phía admin==

## FeedPricing
- CRUD: / `(chưa test)`
- Kích hoạt/Vô hiệu: /{id}/ToggleActive `(chưa test)`

# markmap
## Links

- <https://markmap.js.org/>
- [GitHub](https://github.com/gera2ld/markmap)

## Related Projects

- [coc-markmap](https://github.com/gera2ld/coc-markmap)
- [gatsby-remark-markmap](https://github.com/gera2ld/gatsby-remark-markmap)

## Features

- links
- **strong** ~~del~~ *italic* ==highlight==
- multiline
  hello
-
    ```js
    console.log('code block');
    ```
- Katex
  - $x = {-b \pm \sqrt{b^2-4ac} \over 2a}$
  - [More Katex Examples](#?d=gist:af76a4c245b302206b16aec503dbe07b:katex.md)
- Now we can wrap very very very very long text based on `maxWidth` option
