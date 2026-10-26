"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { errorKinds, type ClientErrorRecord } from "@/lib/errors/types";
const labels = {
  runtime: "JavaScript",
  promise: "Promise",
  react: "React",
  api: "API",
  resource: "Tài nguyên",
};
export default function ErrorMonitor() {
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<ClientErrorRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ClientErrorRecord>();
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      day,
      q: query,
      kind,
      page: String(page),
    });
    const timer = setTimeout(() => {
      void fetch(`/api/client-errors?${params}`, {
        signal: controller.signal,
        cache: "no-store",
      })
        .then(async (res) => {
          if (!res.ok)
            throw new Error(
              res.status === 403
                ? "Bạn không có quyền xem nhật ký lỗi."
                : "Không thể tải nhật ký lỗi.",
            );
          return res.json();
        })
        .then((result) => {
          setData(result.data);
          setTotal(result.total);
        })
        .catch((err) => {
          if (!controller.signal.aborted) setError(err.message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [day, query, kind, page, refresh]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") setRefresh((n) => n + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="flex min-w-0 flex-col gap-5 p-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Theo dõi lỗi</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Lỗi phát sinh khi sử dụng • Lưu 30 ngày • Tự cập nhật mỗi 30 giây
          </p>
        </div>
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => setRefresh((n) => n + 1)}
        >
          Làm mới
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4">
        <label className="text-sm">
          Ngày (UTC)
          <Input
            aria-label="Ngày ghi nhận"
            type="date"
            value={day}
            onChange={(e) => {
              setDay(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <label className="text-sm">
          Loại lỗi
          <select
            aria-label="Loại lỗi"
            className="mt-1 block h-9 rounded-md border px-3"
            value={kind}
            onChange={(e) => {
              setKind(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả</option>
            {errorKinds.map((k) => (
              <option key={k} value={k}>
                {labels[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-56 flex-1 text-sm">
          Tìm kiếm
          <Input
            placeholder="Thông báo, đường dẫn hoặc người dùng"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </label>
      </div>
      {error ? (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50">
              <tr>
                {[
                  "Thời gian",
                  "Loại",
                  "Thông báo",
                  "Trang",
                  "Người dùng",
                  "",
                ].map((label) => (
                  <th key={label || "actions"} className="p-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    Đang tải nhật ký…
                  </td>
                </tr>
              ) : !data.length ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    Chưa ghi nhận lỗi phù hợp.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="whitespace-nowrap p-3">
                      {new Date(row.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-3">
                      {labels[row.kind]}
                      {row.status ? ` ${row.status}` : ""}
                    </td>
                    <td className="max-w-sm truncate p-3" title={row.message}>
                      {row.message}
                    </td>
                    <td className="max-w-64 truncate p-3">{row.path}</td>
                    <td className="p-3">{row.userName || row.userId}</td>
                    <td className="p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelected(row)}
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>
          {total} lỗi • Trang {page}/{Math.max(1, Math.ceil(total / 50))}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1 || loading}
            onClick={() => setPage((n) => n - 1)}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            disabled={page * 50 >= total || loading}
            onClick={() => setPage((n) => n + 1)}
          >
            Sau
          </Button>
        </div>
      </div>
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(undefined);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogTitle>Chi tiết lỗi</DialogTitle>
          <DialogDescription>
            {selected?.id} •{" "}
            {selected && new Date(selected.createdAt).toLocaleString("vi-VN")}
          </DialogDescription>
          <p className="break-words font-semibold">{selected?.message}</p>
          <dl className="grid gap-2 text-sm">
            <div>Trang: {selected?.path}</div>
            <div>API / tài nguyên: {selected?.source}</div>
            <div>
              Người dùng: {selected?.userName} (#{selected?.userId})
            </div>
            <div className="break-words">
              Trình duyệt: {selected?.userAgent}
            </div>
          </dl>
          <pre className="overflow-auto whitespace-pre-wrap break-words rounded-lg bg-neutral-100 p-4 text-xs">
            {selected?.stack || "Không có stack trace."}
          </pre>
        </DialogContent>
      </Dialog>
    </section>
  );
}
