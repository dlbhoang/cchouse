import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import TinyEditor from "@/lib/components/shared/tiny-editor";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETableName } from "@/lib/core/enum";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import imagesApi from "@/services/api/imagesApi";
import type { INewsRequest, INewsResponse } from "@/services/api/news/INews";
import newsApi from "@/services/api/news/newsApi";
import newsTypeApi from "@/services/api/news/newsTypeApi";
import { fileServices } from "@/services/api/services/fileServices";
import NewPreview from "../preview";
import styles from "./index.module.css";

type Props = {
  model?: INewsRequest | INewsResponse;
  onClose?: () => void;
  hideHeader?: boolean;
  onReject?: (item: INewsResponse, reason: string) => Promise<void>;
};

type ErrorKey =
  | "NewsTypeId"
  | "SourceType"
  | "Thumbnail"
  | "Title"
  | "Summary"
  | "Content"
  | "Source";

type FormErrors = Partial<Record<ErrorKey, string>>;

const TITLE_MAX = 150;
const SUMMARY_MAX = 350;

/* ---------------------------------------------------------
   Icon nhỏ tự vẽ (thay @ant-design/icons) — không kéo thêm lib
   --------------------------------------------------------- */
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const IconUploadCloud = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 18a4.6 4.4 0 0 1-1.4-8.9A5.5 5.5 0 0 1 16.6 7.5 4.5 4.5 0 0 1 18 16.5" />
    <path d="M12 12v9" />
    <path d="m8 16 4-4 4 4" />
  </svg>
);

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);

const IconPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const SquarePenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 3 5 5L8 21H3v-5L16 3Z" />
    <path d="M18 6l-3-3" />
    <path d="M9 15l6-6" />
  </svg>
);

const isContentEmpty = (html?: string) => {
  if (!html) return true;
  const text = html.replace(/<[^>]*>/g, "").trim();
  return text.length === 0;
};

// Try to extract a readable source string from the article HTML.
const extractSourceFromContent = (html?: string): string | undefined => {
  if (!html) return undefined;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const anchors = Array.from(doc.querySelectorAll("a"));
    // Prefer anchors whose text mentions 'Nguồn' (case-insensitive)
    for (const a of anchors) {
      const txt = (a.textContent || "").trim();
      if (!txt) continue;
      if (/Nguồn/i.test(txt)) {
        const parts = txt.split(":").map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 2) return parts.slice(1).join(":");
        try {
          const u = new URL(a.href);
          return u.hostname.replace(/^www\./, "");
        } catch (e) {
          return txt;
        }
      }
    }
    // Fallback: return hostname of last anchor if any
    if (anchors.length) {
      try {
        const last = anchors[anchors.length - 1];
        const u = new URL(last.href);
        return u.hostname.replace(/^www\./, "");
      } catch (e) {
        const txt = (anchors[anchors.length - 1].textContent || "").trim();
        if (txt) return txt;
      }
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

const parseContentMeta = (html?: string) => {
  if (!html) {
    return { title: undefined, summary: undefined, source: undefined, content: undefined };
  }

  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const titleEl = doc.querySelector("h1.title-detail, h1.title");
    const summaryEl = doc.querySelector("p.description, p.summary");
    const sourceAnchor = Array.from(doc.querySelectorAll("a")).find((a) => /Nguồn/i.test(a.textContent || ""));

    const title = titleEl?.textContent?.trim();
    const summary = summaryEl?.textContent?.trim();
    const source = sourceAnchor ? extractSourceFromContent(sourceAnchor.outerHTML) : extractSourceFromContent(html);

    if (titleEl) titleEl.remove();
    if (summaryEl) summaryEl.remove();
    if (sourceAnchor) {
      const parent = sourceAnchor.closest("p");
      if (parent) parent.remove();
    }

    const content = doc.body.innerHTML.trim();
    return { title, summary, source, content: content || undefined };
  } catch (e) {
    return { title: undefined, summary: undefined, source: undefined, content: undefined };
  }
};

const getEditableValues = (model?: INewsRequest | INewsResponse): INewsRequest => {
  const item = model as INewsResponse | undefined;
  const usePending = item?.HasPendingChanges;
  const content = usePending ? item?.PendingContent : item?.Content;
  const meta = parseContentMeta(content);
  const thumbnail = usePending ? item?.PendingThumbnail : item?.Thumbnail;

  return {
    ...(item as INewsRequest),
    NewsTypeId: usePending ? item?.PendingNewsTypeId ?? item?.NewsTypeId : item?.NewsTypeId,
    Title: usePending ? item?.PendingTitle ?? "" : item?.Title ?? meta.title ?? "",
    Summary: usePending ? item?.PendingSummary ?? "" : item?.Summary ?? meta.summary ?? "",
    Source: usePending ? item?.PendingSource ?? "" : item?.Source ?? meta.source ?? "",
    SourceType: usePending ? item?.PendingSourceType || "write" : item?.SourceType || "write",
    Content: meta.content || content || "",
    Thumbnail: thumbnail ? (fileServices.mapFromString(thumbnail) as any) : [],
  } as INewsRequest;
};

const NewsForm = ({ model, onClose, hideHeader = false, onReject }: Props) => {
  const router = useRouter();

  const [isSubmit, setIsSubmit] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [shakeField, setShakeField] = useState<ErrorKey | null>(null);
  const [rejectPanelOpen, setRejectPanelOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [values, setValues] = useState<INewsRequest>(() => getEditableValues(model));

  // ✅ FIX: đồng bộ lại values mỗi khi model prop thay đổi.
  // Cần thiết vì model thường được fetch bất đồng bộ từ trang cha
  // (model = undefined lúc mount, có giá trị thật sau khi API trả về),
  // trong khi useState(() => ...) chỉ chạy đúng 1 lần lúc mount nên
  // không tự cập nhật lại khi model đổi.
  useEffect(() => {
    if (model) {
      setValues(getEditableValues(model));
    } else {
      setValues({
        ...({} as INewsRequest),
        SourceType: "write",
        Thumbnail: [],
      } as unknown as INewsRequest);
    }
  }, [model]);

  // If model provided but Content is missing, fetch full record to populate the editor
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (model && model.Id && !(model.Content && model.Content.trim().length)) {
          const res = await newsApi.getById(model.Id);
          if (!mounted) return;
          const full = res.data as INewsResponse;
          const meta = parseContentMeta(full.Content);
          setValues((prev) => ({
            ...prev,
            ...(full as INewsRequest),
            Title: full.Title || meta.title || prev.Title,
            Summary: full.Summary || meta.summary || prev.Summary,
            Source: full.Source || meta.source || prev.Source || "",
            Content: meta.content || full.Content || prev.Content,
            SourceType: (full as INewsRequest)?.SourceType || prev.SourceType || "write",
            Thumbnail: full.Thumbnail ? (fileServices.mapFromString(full.Thumbnail) as any) : prev.Thumbnail,
          }));
        }
      } catch (e) {
        // ignore fetch errors — leave existing values
      }
    })();
    return () => {
      mounted = false;
    };
  }, [model?.Id]);

  // ----------------------------------------------------------------
  // Loại tin — custom select
  // ----------------------------------------------------------------
  const { data: newsTypeData } = newsTypeApi.useGet({ pageIndex: 1, pageSize: 100 });
  const newsTypeOptions = useMemo(
    () => newsTypeData?.data?.map((e) => ({ value: e.Id ?? 0, label: e.Name ?? "" })) ?? [],
    [newsTypeData]
  );

  const [typeOpen, setTypeOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const typeWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (typeWrapperRef.current && !typeWrapperRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectedTypeLabel = newsTypeOptions.find((o) => o.value === values.NewsTypeId)?.label;

  // ----------------------------------------------------------------
  // Focus state cho floating label
  // ----------------------------------------------------------------
  const [titleFocused, setTitleFocused] = useState(false);
  const [summaryFocused, setSummaryFocused] = useState(false);
  const [sourceFocused, setSourceFocused] = useState(false);

  // ----------------------------------------------------------------
  // Thumbnail upload
  // ----------------------------------------------------------------
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailList = (values.Thumbnail as IMyUploadFile[]) || [];
  const thumbnailPreview = thumbnailList[0];

  const handleFieldChange = <K extends keyof INewsRequest>(key: K, val: INewsRequest[K]) => {
    if (key === "Content" && typeof val === "string") {
      setValues((prev) => ({
        ...prev,
        Content: val,
      }));
    } else {
      setValues((prev) => ({ ...prev, [key]: val }));
    }
    setErrors((prev) => ({ ...prev, [key as unknown as ErrorKey]: undefined }));
  };

  const handleSelectType = (value: number) => {
    handleFieldChange("NewsTypeId", value as any);
    setTypeOpen(false);
  };

  const handleAddNewType = async () => {
    if (!newTypeName.trim()) {
      NotiBase("error", "Vui lòng nhập tên loại");
      return;
    }
    await newsTypeApi.add({ Name: newTypeName.trim(), NewsCount: 0 });
    mutate(newsTypeApi.mutateKey);
    setNewTypeName("");
  };

  const handleFilePick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    // Preview cục bộ ngay lập tức trong lúc upload cho mượt
    const localUrl = URL.createObjectURL(file);
    const tempUid = `temp-${Date.now()}`;

    setValues((prev) => ({
      ...prev,
      Thumbnail: [{ uid: tempUid, name: file.name, status: "uploading", url: localUrl } as IMyUploadFile],
    }));
    setErrors((prev) => ({ ...prev, Thumbnail: undefined }));

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("TableName", ETableName.News as unknown as string);
      formData.append("resize", "false");
      formData.append("watermark", "false");

      const data = await imagesApi.upload(formData);
      const uploadItem = Array.isArray(data) ? data[0] : data;
      const responseData = Array.isArray(data?.data) ? data.data[0] : data?.data;
      const remoteUrl: string =
        (typeof uploadItem === "string" ? uploadItem : "") ||
        (typeof responseData === "string" ? responseData : "") ||
        uploadItem?.Path ||
        uploadItem?.path ||
        uploadItem?.url ||
        uploadItem?.Url ||
        responseData?.Path ||
        responseData?.path ||
        responseData?.url ||
        responseData?.Url ||
        "";
      if (!remoteUrl) throw new Error("Image URL missing from upload response");

      setValues((prev) => ({
        ...prev,
        Thumbnail: [
          {
            uid: tempUid,
            name: file.name,
            status: "done",
            url: remoteUrl,
            thumbUrl: remoteUrl,
          } as IMyUploadFile,
        ],
      }));
    } catch {
      NotiBase("error", "Tải ảnh thất bại, vui lòng thử lại");
      setValues((prev) => ({ ...prev, Thumbnail: [] }));
    }
  };

  const handleThumbnailLoadError = () => {
    const message = "Ảnh không thể tải, vui lòng chọn ảnh khác";
    NotiBase("error", message);
    setErrors((prev) => ({ ...prev, Thumbnail: message }));
    setValues((prev) => ({
      ...prev,
      Thumbnail: thumbnailList.map((file) => ({ ...file, status: "error" })),
    }));
  };

  const handleRemoveThumbnail = () => {
    setValues((prev) => ({ ...prev, Thumbnail: [] }));
  };

  // ----------------------------------------------------------------
  // Validate tay
  // ----------------------------------------------------------------
  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!values.NewsTypeId) next.NewsTypeId = "Vui lòng chọn loại tin";
    if (!values.SourceType) next.SourceType = "Vui lòng chọn nguồn tin";
    if (!thumbnailList.length) next.Thumbnail = "Vui lòng chọn hình minh hoạ";
    else if (thumbnailList.some((file) => file.status === "error")) {
      next.Thumbnail = "Ảnh không thể tải, vui lòng chọn ảnh khác";
    }
    if (!values.Title?.trim()) next.Title = "Vui lòng nhập tiêu đề";
    if (!values.Summary?.trim()) next.Summary = "Vui lòng nhập tóm tắt";
    if (isContentEmpty(values.Content)) next.Content = "Vui lòng nhập nội dung";
    return next;
  };

  const runValidation = () => {
    const next = validate();
    setErrors(next);
    const firstKey = Object.keys(next)[0] as ErrorKey | undefined;
    if (firstKey) {
      setShakeField(firstKey);
      window.setTimeout(() => setShakeField(null), 400);
      return false;
    }
    return true;
  };

  const handlePreview = () => {
    if (runValidation()) setOpenPreview(true);
  };

  const handleSubmit = async () => {
    if (!runValidation()) return;
    try {
      setIsSubmit(true);
      const payload: INewsRequest = {
        ...values,
        SourceType: values.Source?.trim() ? "share" : "write",
      };
      if (payload.Thumbnail && Array.isArray(payload.Thumbnail)) {
        const res = fileServices.processFiles(payload.Thumbnail as any);
        payload.Thumbnail = res.toString();
      }
      if (model?.Id) {
        await newsApi.update(payload);
      } else {
        await newsApi.add(payload);
      }
      // ⚠️ Phải await revalidate — nếu không, modal đóng lại trước khi
      // SWR cache của danh sách kịp cập nhật, nên bảng (và form sửa mở
      // lại lần sau) vẫn thấy dữ liệu cũ cho tới khi có một hành động
      // khác (vd bấm Duyệt) vô tình kích hoạt revalidate.
      await newsApi.revalidate();
      if (onClose) {
        onClose();
        router.refresh();
      } else {
        router.replace(AppRoutes.news.url);
      }
    } finally {
      setIsSubmit(false);
    }
  };

  const handleReject = async () => {
    if (!model?.Id || !onReject) return;
    if (!rejectPanelOpen) {
      setRejectPanelOpen(true);
      return;
    }
    if (!rejectReason.trim()) {
      NotiBase("error", "Vui lòng nhập lý do từ chối");
      return;
    }
    setIsSubmit(true);
    try {
      await onReject({ ...(values as INewsResponse), Id: model.Id }, rejectReason.trim());
      setRejectPanelOpen(false);
      setRejectReason("");
    } finally {
      setIsSubmit(false);
    }
  };

  const titleLen = values.Title?.length ?? 0;
  const summaryLen = values.Summary?.length ?? 0;

  return (
    <div className={styles["news-form-wrapper"]}>
      {!hideHeader && (
        <div className={styles["news-form-header"]}>
          <h1 className={styles["news-form-title"]}>
            {model ? "CHỈNH SỬA BÀI VIẾT" : "THÊM BÀI VIẾT"}
          </h1>
          {onClose && (
            <button type="button" className={styles["news-form-close"]} onClick={onClose}>
              <IconClose />
            </button>
          )}
        </div>
      )}

      {/* Bản công khai được giữ nguyên đến khi bản sửa được duyệt. */}
      {model && (model as INewsResponse)?.Status === 1 && (
        <div className={styles["status-warning-banner"]}>
          Bài viết này đang <strong>hiển thị công khai</strong>. Khi lưu, phiên bản hiện tại vẫn hiển thị;
          bản sửa sẽ <strong>chờ duyệt</strong> và chỉ thay thế sau khi được duyệt.
        </div>
      )}

      {/* Bài từng bị từ chối — cho người viết biết lý do trước khi sửa lại. */}
      {model && (model as INewsResponse)?.Status === 3 && (
        <div className={styles["status-warning-banner"]}>
          Bài viết này đã bị <strong>từ chối</strong>
          {(model as INewsResponse)?.RejectReason
            ? <>: <strong>{(model as INewsResponse).RejectReason}</strong>. </>
            : ". "}
          Sửa lại và bấm Gửi duyệt bài để gửi lại chờ duyệt.
        </div>
      )}

      {/* Content */}
      <div className={styles["news-form-content"]}>
        <div className={styles["form-scrollable-area"]}>
          {/* Row: Loại tin / Nguồn  +  Hình minh hoạ */}
          <div className={styles["form-row-top"]}>
            <div className={styles["form-meta-column"]}>
              {/* Loại tin — custom select */}
              <div className={styles["field-wrapper"]} ref={typeWrapperRef}>
                <div
                  className={[
                    styles["select-trigger"],
                    typeOpen ? styles["select-trigger-open"] : "",
                    errors.NewsTypeId ? styles["field-error-border"] : "",
                    shakeField === "NewsTypeId" ? styles["shake"] : "",
                  ].join(" ")}
                  onClick={() => setTypeOpen((o) => !o)}
                >
                  <span className={styles["select-value"]}>
                    {selectedTypeLabel || <span className={styles["placeholder"]}>Chọn loại tin</span>}
                  </span>
                  <span
                    className={[styles["select-chevron"], typeOpen ? styles["select-chevron-open"] : ""].join(" ")}
                  >
                    <IconChevron />
                  </span>
                </div>

                {typeOpen && (
                  <div className={styles["select-dropdown"]}>
                    <div className={styles["select-options"]}>
                      {newsTypeOptions.map((opt) => (
                        <div
                          key={opt.value}
                          className={[
                            styles["select-option"],
                            opt.value === values.NewsTypeId ? styles["select-option-active"] : "",
                          ].join(" ")}
                          onClick={() => handleSelectType(opt.value as number)}
                        >
                          {opt.label}
                        </div>
                      ))}
                      {!newsTypeOptions.length && (
                        <div className={styles["select-empty"]}>Chưa có loại tin</div>
                      )}
                    </div>
                    <div className={styles["select-footer"]}>
                      <input
                        className={styles["select-add-input"]}
                        placeholder="Thêm loại tin mới"
                        value={newTypeName}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setNewTypeName(e.target.value)}
                      />
                      <button type="button" className={styles["select-add-btn"]} onClick={handleAddNewType}>
                        <IconPlus /> Thêm
                      </button>
                    </div>
                  </div>
                )}

                <span className={styles["field-label"]}>
                  Loại tin <span className={styles["required"]}>*</span>
                </span>
                {errors.NewsTypeId && <div className={styles["field-error"]}>{errors.NewsTypeId}</div>}
              </div>

              {/* Nguồn — custom radio */}
              <div className={styles["field-wrapper"]}>
                <span className={styles["field-label-plain"]}>
                  Nguồn <span className={styles["required"]}>*</span>
                </span>
                <div
                  className={[styles["radio-group"], shakeField === "SourceType" ? styles["shake"] : ""].join(" ")}
                >
                  {[
                    { value: "write", label: "Viết bài" },
                    { value: "share", label: "Chia sẻ" },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className={styles["radio-option"]}
                      onClick={() => handleFieldChange("SourceType", opt.value as any)}
                    >
                      <span
                        className={[
                          styles["radio-circle"],
                          values.SourceType === opt.value ? styles["radio-circle-active"] : "",
                        ].join(" ")}
                      >
                        <span className={styles["radio-circle-inner"]} />
                      </span>
                      <span className={styles["radio-label"]}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hình minh hoạ */}
            <div className={styles["form-thumbnail-column"]}>
              <div className={styles["field-label-static"]}>
                Hình minh hoạ <span className={styles["required"]}>*</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />

              {thumbnailPreview ? (
                <div className={styles["upload-preview-wrap"]}>
                  <img
                    className={[
                      styles["upload-preview-img"],
                      thumbnailPreview.status === "uploading" ? styles["upload-preview-loading"] : "",
                    ].join(" ")}
                    src={thumbnailPreview.url}
                    alt="thumbnail"
                    onError={handleThumbnailLoadError}
                  />
                  {thumbnailPreview.status === "uploading" && <span className={styles["upload-spinner"]} />}
                  <button type="button" className={styles["upload-edit-btn"]} onClick={handleFilePick} aria-label="Chỉnh sửa ảnh">
                    <SquarePenIcon />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={[
                    styles["upload-box"],
                    errors.Thumbnail ? styles["field-error-border"] : "",
                    shakeField === "Thumbnail" ? styles["shake"] : "",
                  ].join(" ")}
                  onClick={handleFilePick}
                >
                  <IconUploadCloud />
                  <span className={styles["upload-hint"]}>Tải ảnh</span>
                </button>
              )}
              {errors.Thumbnail && <div className={styles["field-error"]}>{errors.Thumbnail}</div>}
            </div>
          </div>

          {/* Tiêu đề */}
          <div className={styles["field-wrapper"]}>
            <div
              className={[
                styles["textarea-box"],
                titleFocused ? styles["textarea-box-active"] : "",
                errors.Title ? styles["field-error-border"] : "",
                shakeField === "Title" ? styles["shake"] : "",
              ].join(" ")}
            >
              <textarea
                className={styles["textarea"]}
                rows={2}
                maxLength={TITLE_MAX}
                placeholder="Nhập tiêu đề bài viết..."
                value={values.Title || ""}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
                onChange={(e) => handleFieldChange("Title", e.target.value as any)}
              />
            </div>
            <span className={[styles["field-label"], titleFocused ? styles["field-label-active"] : ""].join(" ")}>
              Tiêu đề <span className={styles["required"]}>*</span>
            </span>
            <div className={styles["field-footer"]}>
              {errors.Title && <span className={styles["field-error"]}>{errors.Title}</span>}
              <span
                className={[
                  styles["char-counter"],
                  titleLen >= TITLE_MAX * 0.9 ? styles["char-counter-warn"] : "",
                ].join(" ")}
              >
                {titleLen} / {TITLE_MAX} kí tự
              </span>
            </div>
          </div>

          {/* Tóm tắt */}
          <div className={styles["field-wrapper"]}>
            <div
              className={[
                styles["textarea-box"],
                summaryFocused ? styles["textarea-box-active"] : "",
                errors.Summary ? styles["field-error-border"] : "",
                shakeField === "Summary" ? styles["shake"] : "",
              ].join(" ")}
            >
              <textarea
                className={styles["textarea"]}
                rows={4}
                maxLength={SUMMARY_MAX}
                placeholder="Nhập tóm tắt bài viết..."
                value={values.Summary || ""}
                onFocus={() => setSummaryFocused(true)}
                onBlur={() => setSummaryFocused(false)}
                onChange={(e) => handleFieldChange("Summary", e.target.value as any)}
              />
            </div>
            <span className={[styles["field-label"], summaryFocused ? styles["field-label-active"] : ""].join(" ")}>
              Tóm tắt <span className={styles["required"]}>*</span>
            </span>
            <div className={styles["field-footer"]}>
              {errors.Summary && <span className={styles["field-error"]}>{errors.Summary}</span>}
              <span
                className={[
                  styles["char-counter"],
                  summaryLen >= SUMMARY_MAX * 0.9 ? styles["char-counter-warn"] : "",
                ].join(" ")}
              >
                {summaryLen} / {SUMMARY_MAX} kí tự
              </span>
            </div>
          </div>

          {/* Nội dung */}
          <div className={styles["field-wrapper"]}>
            <div className={styles["field-label-static"]}>
              Nội dung <span className={styles["required"]}>*</span>
            </div>
            <div
              className={[
                styles["editor-wrapper"],
                errors.Content ? styles["field-error-border"] : "",
                shakeField === "Content" ? styles["shake"] : "",
              ].join(" ")}
            >
              {/* NOTE: TinyEditor cần nhận prop value/onChange — chỉnh lại tên prop nếu component thật dùng tên khác (vd initialValue/onEditorChange) */}
              <TinyEditor value={values.Content} onChange={(html: string) => handleFieldChange("Content", html as any)} />
            </div>
            {errors.Content && <div className={styles["field-error"]}>{errors.Content}</div>}
          </div>

          {/* Nguồn thông tin */}
          <div className={styles["field-wrapper"]}>
            <div
              className={[
                styles["input-box"],
                sourceFocused ? styles["input-box-active"] : "",
                errors.Source ? styles["field-error-border"] : "",
                shakeField === "Source" ? styles["shake"] : "",
              ].join(" ")}
            >
              <input
                className={styles["text-input"]}
                type="url"
                inputMode="url"
                placeholder="Dán link nguồn báo (VD: https://vnexpress.net/...)..."
                value={values.Source || ""}
                onFocus={() => setSourceFocused(true)}
                onBlur={() => setSourceFocused(false)}
                onChange={(e) => {
                  const source = e.target.value;
                  setValues((prev) => ({
                    ...prev,
                    Source: source,
                    SourceType: source.trim() ? "share" : "write",
                  }));
                  setErrors((prev) => ({ ...prev, Source: undefined }));
                }}
              />
            </div>
            <span
              className={[styles["field-label"], sourceFocused || values.Source ? styles["field-label-active"] : ""].join(
                " "
              )}
            >
              Nguồn thông tin
            </span>
            <div className={styles["field-footer"]}>
              {errors.Source && <span className={styles["field-error"]}>{errors.Source}</span>}
              <span className={styles["source-hint"]}>
                các thông tin chia sẻ từ nơi khác bắt buộc ghi đường link trích dẫn
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className={styles["news-form-bottom-fixed"]}>
        {rejectPanelOpen && (
          <div className={styles["reject-panel"]}>
            <span className={styles["reject-panel-label"]}>
              Lý do từ chối <span className={styles["required"]}>*</span>
            </span>
            <textarea
              className={styles["reject-panel-textarea"]}
              placeholder="Nhập lý do từ chối để người đăng biết và chỉnh sửa lại..."
              rows={3}
              autoFocus
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className={styles["reject-panel-actions"]}>
              <button
                type="button"
                className={styles["reject-panel-cancel"]}
                onClick={() => {
                  setRejectPanelOpen(false);
                  setRejectReason("");
                }}
                disabled={isSubmit}
              >
                Huỷ
              </button>
              <button
                type="button"
                className={styles["reject-panel-confirm"]}
                onClick={handleReject}
                disabled={isSubmit || !rejectReason.trim()}
              >
                {isSubmit && <span className={styles["btn-spinner"]} />}
                Xác nhận từ chối
              </button>
            </div>
          </div>
        )}
        <div className={styles["bottom-actions"]}>
          <button type="button" className={styles["preview-button"]} onClick={handlePreview}>
            <IconEye /> Xem trước
          </button>
          {model && onReject && !rejectPanelOpen && (
            <button
              type="button"
              className={styles["reject-button"]}
              onClick={handleReject}
              disabled={isSubmit}
            >
              Từ chối
            </button>
          )}
          <button
            type="button"
            className={styles["submit-button"]}
            onClick={handleSubmit}
            disabled={isSubmit}
          >
            {isSubmit && <span className={styles["btn-spinner"]} />}
            {model ? "Gửi duyệt bài" : "Gửi duyệt bài"}
          </button>
        </div>
      </div>

      {/* Preview modal */}
      <NewPreview
        hiddenEdit
        model={values as INewsResponse}
        isModalOpen={openPreview}
        handleCancel={() => setOpenPreview(false)}
      />
    </div>
  );
};

export default NewsForm;