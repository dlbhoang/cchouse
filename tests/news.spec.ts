import { test, expect, Page } from '@playwright/test';

/**
 * TEST: CRUD chức năng Tin tức (News) - cchouse admin
 *
 * LƯU Ý QUAN TRỌNG:
 * File này được viết dựa trên cấu trúc UI phổ biến của một trang admin
 * quản lý tin tức (danh sách -> nút Thêm -> form -> nút Sửa/Xóa).
 * Vì không có quyền truy cập trực tiếp vào source code / DOM thực tế
 * của cchouse_admin_website_v2, các selector dưới đây (đặc biệt là
 * data-testid, tên field, text nút bấm) CẦN được bạn kiểm tra và
 * chỉnh lại cho khớp với UI thật trước khi chạy.
 *
 * Khuyến nghị: thêm thuộc tính `data-testid` vào các phần tử quan trọng
 * trong code React (nút Thêm, nút Sửa, nút Xóa, input Title, nút Lưu...)
 * để test ổn định hơn, không phụ thuộc vào text hiển thị (dễ đổi theo UI).
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3003';
const LOGIN_EMAIL = 'DEV@CCHOUSE.VN';
const LOGIN_PASSWORD = 'Aa123456!';

// Tiêu đề tin test, gắn timestamp để tránh trùng lặp giữa các lần chạy
const TEST_NEWS_TITLE = `Tin test Playwright ${Date.now()}`;
const TEST_NEWS_TITLE_EDITED = `${TEST_NEWS_TITLE} - đã sửa`;
const TEST_NEWS_SUMMARY = 'Mô tả ngắn cho tin test tự động';
const TEST_NEWS_CONTENT = 'Nội dung chi tiết của tin tức test tự động bởi Playwright.';

/**
 * Hàm đăng nhập dùng chung cho các test.
 * Điều chỉnh selector theo đúng form login thật (NextAuth credentials).
 */
async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`);

  // Điều chỉnh selector theo tên field thật trong form login
  await page.getByLabel(/email|tên đăng nhập|username/i).fill(LOGIN_EMAIL);
  await page.getByLabel(/mật khẩu|password/i).fill(LOGIN_PASSWORD);

  await page.getByRole('button', { name: /đăng nhập|login/i }).click();

  // Chờ chuyển hướng sau khi đăng nhập thành công (điều chỉnh route đích)
  await page.waitForURL(/\/admin/, { timeout: 15000 });
}

test.describe('Quản lý Tin tức - CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Điều chỉnh route danh sách tin tức cho đúng thực tế
    await page.goto(`${BASE_URL}/admin/news`);
    await expect(page).toHaveURL(/\/admin\/news/);
  });

  test('Thêm mới tin tức', async ({ page }) => {
    // Mở form thêm mới
    await page.getByRole('button', { name: /thêm mới|thêm tin|add/i }).click();

    // Điền form - điều chỉnh selector theo field thật
    await page.getByLabel(/tiêu đề|title/i).fill(TEST_NEWS_TITLE);
    await page.getByLabel(/mô tả ngắn|summary/i).fill(TEST_NEWS_SUMMARY);

    // Nếu content dùng rich text editor (ví dụ TinyMCE như thấy trong log lỗi trước đó),
    // cần xử lý riêng vì nó chạy trong iframe:
    const editorFrame = page.frameLocator('iframe.tox-edit-area__iframe');
    if (await editorFrame.locator('body').count() > 0) {
      await editorFrame.locator('body').fill(TEST_NEWS_CONTENT);
    } else {
      // Fallback nếu content là textarea/input thường
      await page.getByLabel(/nội dung|content/i).fill(TEST_NEWS_CONTENT);
    }

    // Lưu
    await page.getByRole('button', { name: /lưu|thêm|save/i }).click();

    // Kiểm tra thông báo thành công
    await expect(page.getByText(/thành công|success/i)).toBeVisible({ timeout: 10000 });

    // Kiểm tra tin mới xuất hiện trong danh sách
    await expect(page.getByText(TEST_NEWS_TITLE)).toBeVisible({ timeout: 10000 });
  });

  test('Sửa tin tức', async ({ page }) => {
    // Tìm dòng chứa tin vừa tạo và bấm nút Sửa tương ứng
    const row = page.locator('tr', { hasText: TEST_NEWS_TITLE });
    await expect(row).toBeVisible({ timeout: 10000 });

    await row.getByRole('button', { name: /sửa|edit/i }).click();

    // Cập nhật tiêu đề
    const titleInput = page.getByLabel(/tiêu đề|title/i);
    await titleInput.fill('');
    await titleInput.fill(TEST_NEWS_TITLE_EDITED);

    await page.getByRole('button', { name: /lưu|cập nhật|save/i }).click();

    await expect(page.getByText(/thành công|success/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(TEST_NEWS_TITLE_EDITED)).toBeVisible({ timeout: 10000 });
  });

  test('Ẩn / Hiện tin tức (đổi trạng thái)', async ({ page }) => {
    // Theo entity ENewsStatus chỉ có 2 trạng thái: Show / Hidden
    const row = page.locator('tr', { hasText: TEST_NEWS_TITLE_EDITED });
    await expect(row).toBeVisible({ timeout: 10000 });

    // Điều chỉnh selector nút/toggle đổi trạng thái theo UI thật
    await row.getByRole('button', { name: /ẩn|hidden/i }).click();

    // Xác nhận nếu có dialog confirm
    const confirmBtn = page.getByRole('button', { name: /xác nhận|đồng ý|ok/i });
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();
    }

    await expect(page.getByText(/thành công|success/i)).toBeVisible({ timeout: 10000 });
  });

  test('Xóa tin tức', async ({ page }) => {
    const row = page.locator('tr', { hasText: TEST_NEWS_TITLE_EDITED });
    await expect(row).toBeVisible({ timeout: 10000 });

    await row.getByRole('button', { name: /xóa|delete/i }).click();

    // Xác nhận xóa (thường có modal confirm)
    await page.getByRole('button', { name: /xác nhận|đồng ý|có|yes/i }).click();

    await expect(page.getByText(/thành công|success/i)).toBeVisible({ timeout: 10000 });

    // Kiểm tra tin đã biến mất khỏi danh sách
    await expect(page.getByText(TEST_NEWS_TITLE_EDITED)).not.toBeVisible({ timeout: 10000 });
  });
});
