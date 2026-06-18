"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Upload, RefreshCw, CheckCircle2, XCircle, ImageIcon, Eye, Trash2 } from "lucide-react";

const BANNER_SERVER = process.env.NEXT_PUBLIC_BANNER_SERVER!;
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL!;

const BANNERS = [
  { name: "bn-1.jpg",    label: "Banner 1",      desc: "Slide đầu tiên",     tag: "Trang chủ" },
  { name: "bn-2.png",    label: "Banner 2",      desc: "Slide thứ hai",      tag: "Trang chủ" },
  { name: "bn-3.jpg",    label: "Banner 3",      desc: "Slide thứ ba",       tag: "Trang chủ" },
  { name: "bn-main.jpg", label: "Banner Popup",  desc: "Hiển thị khi vào",   tag: "Modal" },
];

type Toast = { type: "success" | "error"; msg: string };

export default function BannerPage() {
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [ts, setTs] = useState(Date.now());
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleFileChange = useCallback((name: string, file: File) => {
    setPreviews(p => ({ ...p, [name]: URL.createObjectURL(file) }));
  }, []);

  const clearPreview = useCallback((name: string) => {
    setPreviews(p => { const n = { ...p }; delete n[name]; return n; });
    if (inputRefs.current[name]) inputRefs.current[name]!.value = "";
  }, []);

  const handleUpload = async (name: string) => {
    const input = inputRefs.current[name];
    if (!input?.files?.[0]) return;
    setUploading(name);
    const formData = new FormData();
    formData.append("image", input.files[0]);
    try {
      const res = await fetch(`${BANNER_SERVER}/upload/${name}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", msg: `"${name}" đã được cập nhật!` });
        clearPreview(name);
        setTs(Date.now());
      } else {
        setToast({ type: "error", msg: data.error || "Lỗi không xác định" });
      }
    } catch {
      setToast({ type: "error", msg: "Không thể kết nối server" });
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium animate-in slide-in-from-top-2 ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.type === "success"
            ? <CheckCircle2 className="w-4 h-4 shrink-0" />
            : <XCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[80vh] aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image src={lightbox} alt="preview" fill className="object-contain" unoptimized />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">Quản lý Banner</h1>
              <p className="text-xs text-gray-400 mt-0.5">Thay đổi hiển thị ngay trên website người dùng</p>
            </div>
          </div>
          <button
            onClick={() => setTs(Date.now())}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tải lại ảnh
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-8 max-w-5xl mx-auto">
        {/* Info bar */}
        <div className="mb-6 flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-100 rounded-xl px-4 py-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Hover lên ảnh để chọn file mới · Nhấn <strong className="text-gray-600 mx-1">Cập nhật</strong> để lưu lên server
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BANNERS.map(({ name, label, desc, tag }) => {
            const hasPreview = !!previews[name];
            const imgSrc = previews[name] || `${WEBSITE_URL}/images/${name}?t=${ts}`;

            return (
              <div
                key={name}
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all duration-200 ${
                  hasPreview ? "border-amber-300 shadow-amber-100" : "border-gray-100 hover:shadow-md"
                }`}
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-50 group">
                  <Image src={imgSrc} alt={label} fill className="object-cover" unoptimized />

                  {/* Hover overlay */}
                  <label
                    htmlFor={`file-${name}`}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2 text-white">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium bg-black/30 px-3 py-1 rounded-full">Chọn ảnh mới</span>
                    </div>
                  </label>

                  <input
                    ref={(el) => { inputRefs.current[name] = el; }}
                    id={`file-${name}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) handleFileChange(name, e.target.files[0]); }}
                  />

                  {/* Tag */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${
                      tag === "Modal" ? "bg-purple-500/90 text-white" : "bg-blue-500/90 text-white"
                    }`}>
                      {tag}
                    </span>
                  </div>

                  {/* Unsaved badge */}
                  {hasPreview && (
                    <div className="absolute top-3 right-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-400 text-white">
                        Chưa lưu
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3.5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-300 bg-gray-50 px-2 py-1 rounded-lg border mt-0.5">
                      {name}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* Preview button */}
                    <button
                      onClick={() => setLightbox(imgSrc)}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors"
                      title="Xem toàn màn hình"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Clear preview */}
                    {hasPreview && (
                      <button
                        onClick={() => clearPreview(name)}
                        className="p-2 rounded-xl border border-red-100 hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                        title="Huỷ chọn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Upload button */}
                    <button
                      onClick={() => handleUpload(name)}
                      disabled={!hasPreview || uploading === name}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {uploading === name
                        ? <><RefreshCw className="w-4 h-4 animate-spin" /> Đang tải...</>
                        : <><Upload className="w-4 h-4" /> Cập nhật</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
