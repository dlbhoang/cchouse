"use client";
import { useEffect } from "react";
import { reportClientError } from "@/lib/errors/report";
export default function AdminError({
  error,
  reset,
}: {
  error: Error;
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
    <div className="rounded-xl border bg-white p-8 text-center">
      <h2 className="text-xl font-semibold">Không thể hiển thị trang này</h2>
      <p className="my-4 text-neutral-500">
        Vui lòng thử lại. Quản trị viên có thể kiểm tra trong mục Theo dõi lỗi.
      </p>
      <button
        type="button"
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        onClick={reset}
      >
        Thử lại
      </button>
    </div>
  );
}
