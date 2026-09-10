# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/news.spec.ts >> Quản lý Tin tức - CRUD >> Ẩn / Hiện tin tức (đổi trạng thái)
- Location: tests/news.spec.ts:100:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/email|tên đăng nhập|username/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - img "C.C.House quản trị bất động sản" [ref=e4]
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img "C.C.HOUSE" [ref=e8]
        - generic [ref=e9]: © Copyright @ 2027 C.C.House. All rights reserved - Since 2015
      - generic [ref=e10]:
        - generic [ref=e11]:
          - text: Xin chào bạn
          - heading "Đăng nhập để tiếp tục" [level=2] [ref=e12]
        - generic [ref=e13]:
          - generic [ref=e14]:
            - generic [ref=e16]:
              - generic: Email *
              - textbox [ref=e17]
            - generic [ref=e19]:
              - generic: Mật khẩu *
              - generic [ref=e20]:
                - textbox [ref=e21]
                - img "eye-invisible" [ref=e24] [cursor=pointer]
          - generic [ref=e28]:
            - generic [ref=e29] [cursor=pointer]:
              - checkbox "Nhớ mật khẩu" [ref=e31]
              - generic [ref=e33]: Nhớ mật khẩu
            - generic [ref=e34] [cursor=pointer]: Quên mật khẩu
          - button "Đăng nhập" [ref=e36] [cursor=pointer]
          - generic [ref=e38]: Chưa có tài khoản? Đăng ký
          - generic [ref=e40]:
            - checkbox [ref=e43] [cursor=pointer]
            - generic [ref=e45]: Bằng việc đăng ký tôi đồng ý cung cấp thông tin cá nhân, tuân thủ các Quy định và Chính sách bảo mật của công ty ban hành.
        - separator [ref=e46]
        - generic [ref=e47]: Quét mã QR để truy cập
      - generic [ref=e51]:
        - text: MỌI CHI TIẾT LIÊN HỆ
        - generic [ref=e52]:
          - generic [ref=e53]: 0917 07 17 19 - 0919 70 74 77
          - generic [ref=e54]: "Email: info@cchouse.vn"
          - generic [ref=e55]: "Mã số thuế: 0313463662"
  - region "Notifications alt+T"
  - alert [ref=e56]
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * TEST: CRUD chức năng Tin tức (News) - cchouse admin
  5   |  *
  6   |  * LƯU Ý QUAN TRỌNG:
  7   |  * File này được viết dựa trên cấu trúc UI phổ biến của một trang admin
  8   |  * quản lý tin tức (danh sách -> nút Thêm -> form -> nút Sửa/Xóa).
  9   |  * Vì không có quyền truy cập trực tiếp vào source code / DOM thực tế
  10  |  * của cchouse_admin_website_v2, các selector dưới đây (đặc biệt là
  11  |  * data-testid, tên field, text nút bấm) CẦN được bạn kiểm tra và
  12  |  * chỉnh lại cho khớp với UI thật trước khi chạy.
  13  |  *
  14  |  * Khuyến nghị: thêm thuộc tính `data-testid` vào các phần tử quan trọng
  15  |  * trong code React (nút Thêm, nút Sửa, nút Xóa, input Title, nút Lưu...)
  16  |  * để test ổn định hơn, không phụ thuộc vào text hiển thị (dễ đổi theo UI).
  17  |  */
  18  | 
  19  | const BASE_URL = process.env.BASE_URL || 'http://localhost:3003';
  20  | const LOGIN_EMAIL = 'DEV@CCHOUSE.VN';
  21  | const LOGIN_PASSWORD = 'Aa123456!';
  22  | 
  23  | // Tiêu đề tin test, gắn timestamp để tránh trùng lặp giữa các lần chạy
  24  | const TEST_NEWS_TITLE = `Tin test Playwright ${Date.now()}`;
  25  | const TEST_NEWS_TITLE_EDITED = `${TEST_NEWS_TITLE} - đã sửa`;
  26  | const TEST_NEWS_SUMMARY = 'Mô tả ngắn cho tin test tự động';
  27  | const TEST_NEWS_CONTENT = 'Nội dung chi tiết của tin tức test tự động bởi Playwright.';
  28  | 
  29  | /**
  30  |  * Hàm đăng nhập dùng chung cho các test.
  31  |  * Điều chỉnh selector theo đúng form login thật (NextAuth credentials).
  32  |  */
  33  | async function login(page: Page) {
  34  |   await page.goto(`${BASE_URL}/login`);
  35  | 
  36  |   // Điều chỉnh selector theo tên field thật trong form login
> 37  |   await page.getByLabel(/email|tên đăng nhập|username/i).fill(LOGIN_EMAIL);
      |                                                          ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  38  |   await page.getByLabel(/mật khẩu|password/i).fill(LOGIN_PASSWORD);
  39  | 
  40  |   await page.getByRole('button', { name: /đăng nhập|login/i }).click();
  41  | 
  42  |   // Chờ chuyển hướng sau khi đăng nhập thành công (điều chỉnh route đích)
  43  |   await page.waitForURL(/\/admin/, { timeout: 15000 });
  44  | }
  45  | 
  46  | test.describe('Quản lý Tin tức - CRUD', () => {
  47  |   test.beforeEach(async ({ page }) => {
  48  |     await login(page);
  49  |     // Điều chỉnh route danh sách tin tức cho đúng thực tế
  50  |     await page.goto(`${BASE_URL}/admin/news`);
  51  |     await expect(page).toHaveURL(/\/admin\/news/);
  52  |   });
  53  | 
  54  |   test('Thêm mới tin tức', async ({ page }) => {
  55  |     // Mở form thêm mới
  56  |     await page.getByRole('button', { name: /thêm mới|thêm tin|add/i }).click();
  57  | 
  58  |     // Điền form - điều chỉnh selector theo field thật
  59  |     await page.getByLabel(/tiêu đề|title/i).fill(TEST_NEWS_TITLE);
  60  |     await page.getByLabel(/mô tả ngắn|summary/i).fill(TEST_NEWS_SUMMARY);
  61  | 
  62  |     // Nếu content dùng rich text editor (ví dụ TinyMCE như thấy trong log lỗi trước đó),
  63  |     // cần xử lý riêng vì nó chạy trong iframe:
  64  |     const editorFrame = page.frameLocator('iframe.tox-edit-area__iframe');
  65  |     if (await editorFrame.locator('body').count() > 0) {
  66  |       await editorFrame.locator('body').fill(TEST_NEWS_CONTENT);
  67  |     } else {
  68  |       // Fallback nếu content là textarea/input thường
  69  |       await page.getByLabel(/nội dung|content/i).fill(TEST_NEWS_CONTENT);
  70  |     }
  71  | 
  72  |     // Lưu
  73  |     await page.getByRole('button', { name: /lưu|thêm|save/i }).click();
  74  | 
  75  |     // Kiểm tra thông báo thành công
  76  |     await expect(page.getByText(/thành công|success/i)).toBeVisible({ timeout: 10000 });
  77  | 
  78  |     // Kiểm tra tin mới xuất hiện trong danh sách
  79  |     await expect(page.getByText(TEST_NEWS_TITLE)).toBeVisible({ timeout: 10000 });
  80  |   });
  81  | 
  82  |   test('Sửa tin tức', async ({ page }) => {
  83  |     // Tìm dòng chứa tin vừa tạo và bấm nút Sửa tương ứng
  84  |     const row = page.locator('tr', { hasText: TEST_NEWS_TITLE });
  85  |     await expect(row).toBeVisible({ timeout: 10000 });
  86  | 
  87  |     await row.getByRole('button', { name: /sửa|edit/i }).click();
  88  | 
  89  |     // Cập nhật tiêu đề
  90  |     const titleInput = page.getByLabel(/tiêu đề|title/i);
  91  |     await titleInput.fill('');
  92  |     await titleInput.fill(TEST_NEWS_TITLE_EDITED);
  93  | 
  94  |     await page.getByRole('button', { name: /lưu|cập nhật|save/i }).click();
  95  | 
  96  |     await expect(page.getByText(/thành công|success/i)).toBeVisible({ timeout: 10000 });
  97  |     await expect(page.getByText(TEST_NEWS_TITLE_EDITED)).toBeVisible({ timeout: 10000 });
  98  |   });
  99  | 
  100 |   test('Ẩn / Hiện tin tức (đổi trạng thái)', async ({ page }) => {
  101 |     // Theo entity ENewsStatus chỉ có 2 trạng thái: Show / Hidden
  102 |     const row = page.locator('tr', { hasText: TEST_NEWS_TITLE_EDITED });
  103 |     await expect(row).toBeVisible({ timeout: 10000 });
  104 | 
  105 |     // Điều chỉnh selector nút/toggle đổi trạng thái theo UI thật
  106 |     await row.getByRole('button', { name: /ẩn|hidden/i }).click();
  107 | 
  108 |     // Xác nhận nếu có dialog confirm
  109 |     const confirmBtn = page.getByRole('button', { name: /xác nhận|đồng ý|ok/i });
  110 |     if (await confirmBtn.isVisible().catch(() => false)) {
  111 |       await confirmBtn.click();
  112 |     }
  113 | 
  114 |     await expect(page.getByText(/thành công|success/i)).toBeVisible({ timeout: 10000 });
  115 |   });
  116 | 
  117 |   test('Xóa tin tức', async ({ page }) => {
  118 |     const row = page.locator('tr', { hasText: TEST_NEWS_TITLE_EDITED });
  119 |     await expect(row).toBeVisible({ timeout: 10000 });
  120 | 
  121 |     await row.getByRole('button', { name: /xóa|delete/i }).click();
  122 | 
  123 |     // Xác nhận xóa (thường có modal confirm)
  124 |     await page.getByRole('button', { name: /xác nhận|đồng ý|có|yes/i }).click();
  125 | 
  126 |     await expect(page.getByText(/thành công|success/i)).toBeVisible({ timeout: 10000 });
  127 | 
  128 |     // Kiểm tra tin đã biến mất khỏi danh sách
  129 |     await expect(page.getByText(TEST_NEWS_TITLE_EDITED)).not.toBeVisible({ timeout: 10000 });
  130 |   });
  131 | });
  132 | 
```