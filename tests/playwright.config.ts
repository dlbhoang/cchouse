import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false, // Chạy tuần tự vì các test phụ thuộc dữ liệu lẫn nhau (sửa/xóa tin vừa tạo)
  retries: 0,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3003',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
