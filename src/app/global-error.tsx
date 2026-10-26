"use client";
import { useEffect } from "react";
import { reportClientError } from "@/lib/errors/report";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError({
      kind: "react",
      message: error.message,
      stack: error.stack,
    });
  }, [error]);
  return (
    <html lang="vi">
      <body>
        <main
          style={{ padding: 48, fontFamily: "sans-serif", textAlign: "center" }}
        >
          <h1>Đã xảy ra lỗi hệ thống</h1>
          <p>Vui lòng thử lại hoặc quay về trang chủ.</p>
          <button type="button" onClick={reset}>
            Thử lại
          </button>
          <p>
            <a href="/admin/property?TransType=1">Về trang chủ</a>
          </p>
        </main>
      </body>
    </html>
  );
}
