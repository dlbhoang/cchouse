"use client";
import { Result } from "antd";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Result
      style={{ minHeight: "100vh" }}
      status="500"
      title="Lỗi hệ thống"
      subTitle="Hệ thống đang bảo trì, vui lòng quay lại sau!"
      // extra={<Button type="primary">Back Home</Button>}
    />
  );
}
