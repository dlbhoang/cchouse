# Figma audit — 16/11/2026

> Cập nhật: vòng mock data và UI responsive mới nhất nằm trong [mock-ui-comparison.md](mock-ui-comparison.md). Những giới hạn dữ liệu/Figma quota bên dưới thuộc vòng trước.

Phạm vi: `/Users/dlb/cchouse/test/cchouse_admin_website_v2`. Các điểm chủ quan trong README ngày 15/11 là lịch sử; **không dùng làm xác nhận đạt 9.5–10/10**. Báo cáo này và các số đo JSON là kết quả vòng tiếp theo.

## Nguồn và kiến trúc

Next.js 14 App Router, React 18, Ant Design 5, Radix/shadcn, Tailwind và CSS hiện có. NextAuth bảo vệ route; SWR và API proxy tải dữ liệu thật. Giữ nguyên API clients, permission checks, pagination, form handlers và nghiệp vụ. Không thêm dependency.

Đã ghi nhận Git status và patch trước vòng này tại `evidence/baseline-git-status.txt`, `evidence/baseline.patch`; bản sao nguồn tại `baseline-source/`. Không reset/checkout/restore hàng loạt. Không sửa repository khác.

## Ánh xạ reference

- **132:14425 → `/admin/property?TransType=1`**. Main `214:48004`, empty `2301:69424`, advanced filter `409:29551`. Context main đã lưu trong `evidence/property-main-context.txt`. Các form BĐS còn nằm trong section lân cận `173:10394`; đã đọc inventory, chưa xác nhận đầy đủ từng biến thể add/edit. Main 1440×1024; content `(92,94,1332,930)`, filter `(108,110,1300,170)`, title y=304/24px/32px/700, empty `(108,380,1300,628)`.
- **2420:136701 → `/admin/config/news`**. Populated `2420:136745`, children heading `2420:136748`, filter `2420:136752`, category `2420:136773`, table `2420:136784`; empty `5102:157268`; create `3114:162988`, edit `3111:148418`. Context đã đọc qua MCP, các ảnh main/form đã lưu. Populated reference cao 1114px; lấy đúng 1024px đầu, không scale. Heading group `(84,94,1340,64)` gap8, filter y168/h72, tabs y250/h72, table y322. Header 14px/20px/500, padding12.
- **4837:185121 → `/admin/config/address-manager`**. Main `4837:196672`, trước sáp nhập `4895:245006`, create `4918:287152`. Context main lưu tại `evidence/address-main-context.txt`. Bỏ 78px browser chrome khỏi reference, app viewport1440×946. Toolbar y94/h80, title `(92,118,372,32)`, mode bar `(92,174,1332,60)`, columns bắt đầu y234. Column header h60; tên16/24, chi tiết14/20.
- **4939:291895 → `/admin/config/agency-manager`**. Main `4968:329857` và instance `4968:329858`, create `4984:334401`, status `4968:331537`, category `4968:331553`. Context main lưu tại `evidence/agency-main-context.txt`. Bỏ 78px browser chrome; viewport1440×946. Search `(92,94,1332,88)`, heading `(92,206,388,32)`, panel `(92,262,1332,668)`.

Chi tiết geometry/font/fills/constraints lấy bằng MCP tại `evidence/figma-main-specs.json`; inventory tại `evidence/figma-section-inventory.json`. Không có mobile frame cụ thể được chỉ định, nên responsive được kiểm tra về khả năng sử dụng, không suy diễn thành điểm pixel mobile.

## Phần thiếu dữ liệu

Lần đọc bổ sung typography và kích thước chi tiết từng modal/table bị automatic approval review chặn vì hạn mức. Lỗi được lưu tại `evidence/figma-detail-specs.error.txt`. Không gọi đường khác để vượt chặn; không tự đoán các thông số chưa lấy được. Vì vậy chưa xác nhận toàn bộ hover/focus/disabled, toàn bộ dropdown và mọi biến thể edit theo Figma.

Shared language: Inter; primary #0588f0; text #0a0a0a; border #e5e5e5; field40px; title24/32/700; shared shell/sidebar/header, floating labels, empty states. Chỉ áp dụng thông số cho component đã có bằng chứng; giữ các control riêng khi Figma khác nhau.
