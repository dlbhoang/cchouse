import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { Input, Modal } from "antd";
import { ChevronDown, ImageIcon, Pencil, Plus, X } from "lucide-react";
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
import { newsEditorIcons } from "./editor-icons";
import { validateNews, type ErrorKey, type FormErrors } from "./validation";

type Props = {
  model?: INewsRequest | INewsResponse;
  onClose?: () => void;
  hideHeader?: boolean;
  onReject?: (item: INewsResponse, reason: string) => Promise<void>;
  onApprove?: (item: INewsResponse) => Promise<void>;
};

const TITLE_MAX = 150;
const SUMMARY_MAX = 350;

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
  const content = item?.Content;
  const meta = parseContentMeta(content);
  const thumbnail = Array.isArray(item?.Thumbnail)
    ? item.Thumbnail
    : item?.Thumbnail
      ? fileServices.mapFromString(String(item.Thumbnail))
      : [];

  return {
    ...(item as INewsRequest),
    NewsTypeId: item?.NewsTypeId,
    Title: item?.Title ?? meta.title ?? "",
    Summary: item?.Summary ?? meta.summary ?? "",
    Source: item?.Source ?? meta.source ?? "",
    SourceType: item?.SourceType || "write",
    Content: meta.content || content || "",
    Thumbnail: thumbnail as any,
  } as INewsRequest;
};

const NewsForm = ({ model, onClose, hideHeader = false, onReject, onApprove }: Props) => {
  const router = useRouter();

  const [isSubmit, setIsSubmit] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [thumbnailImageOpen, setThumbnailImageOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [shakeField, setShakeField] = useState<ErrorKey | null>(null);
  const [rejectPanelOpen, setRejectPanelOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approvePanelOpen, setApprovePanelOpen] = useState(false);

  const [values, setValues] = useState<INewsRequest>(() => getEditableValues(model));

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
    const selectedFile = e.target.files?.[0];
    e.target.value = "";
    if (!selectedFile) return;
    // Some browsers identify .svg as application/octet-stream; the API accepts image/svg+xml.
    const file = /\.svg$/i.test(selectedFile.name) && selectedFile.type !== "image/svg+xml"
      ? new File([selectedFile], selectedFile.name, { type: "image/svg+xml", lastModified: selectedFile.lastModified })
      : selectedFile;
    if (file.size > 8 * 1024 * 1024) {
      NotiBase("error", "Ảnh tải lên không được vượt quá 8 MB");
      return;
    }

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
      formData.append("Files", file);
      formData.append("TableName", String(ETableName.News));
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
    } catch (error: unknown) {
      const response = error as { data?: { message?: string; traceId?: string }; message?: string };
      const errorMessage = response?.data?.message || response?.message || "Tải ảnh thất bại, vui lòng thử lại";
      const traceId = response?.data?.traceId;
      NotiBase("error", traceId ? `${errorMessage} (Mã lỗi: ${traceId})` : errorMessage);
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
  const runValidation = () => {
    const next = validateNews(values);
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

  const handleOpenReject = () => {
    if (!model?.Id || !onReject) return;
    setRejectPanelOpen(true);
  };

  const handleReject = async () => {
    if (!model?.Id || !onReject) return;
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

  const handleApprove = async () => {
    if (!model?.Id || !onApprove) return;
    setIsSubmit(true);
    try {
      await onApprove(model as INewsResponse);
      setApprovePanelOpen(false);
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
            <button type="button" className={styles["news-form-close"]} onClick={onClose} aria-label="Đóng bài viết">
              <X size={24} />
            </button>
          )}
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
                    <ChevronDown size={16} />
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
                        <Plus size={16} /> Thêm
                      </button>
                    </div>
                  </div>
                )}

                <span className={[styles["field-label"], !typeOpen && !values.NewsTypeId ? styles["field-label-resting"] : "", typeOpen ? styles["field-label-active"] : ""].join(" ")}>
                  Loại tin <span className={styles["required"]}>*</span>
                </span>
                {errors.NewsTypeId && <div className={styles["field-error"]}>{errors.NewsTypeId}</div>}
              </div>

              {model && (
                <div className={styles["field-wrapper"]}>
                  <span className={styles["field-label-plain"]}>Nguồn <span className={styles["required"]}>*</span></span>
                  <div className={styles["radio-group"]} role="radiogroup" aria-label="Nguồn bài viết">
                    {[{ value: "write", label: "Viết bài" }, { value: "share", label: "Chia sẻ" }].map((option) => (
                      <button type="button" role="radio" aria-checked={values.SourceType === option.value}
                        key={option.value} className={styles["radio-option"]}
                        onClick={() => handleFieldChange("SourceType", option.value as "write" | "share")}>
                        <span className={[styles["radio-circle"], values.SourceType === option.value ? styles["radio-circle-active"] : ""].join(" ")}>
                          <span className={styles["radio-circle-inner"]} />
                        </span>
                        <span className={styles["radio-label"]}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                  <button
                    type="button"
                    className={styles["upload-preview-image-button"]}
                    onClick={() => setThumbnailImageOpen(true)}
                    aria-label="Xem ảnh minh họa"
                    disabled={thumbnailPreview.status === "uploading"}
                  >
                    <img
                      className={[
                        styles["upload-preview-img"],
                        thumbnailPreview.status === "uploading" ? styles["upload-preview-loading"] : "",
                      ].join(" ")}
                      src={thumbnailPreview.url}
                      alt="Ảnh minh họa bài viết"
                      onError={handleThumbnailLoadError}
                    />
                  </button>
                  {thumbnailPreview.status === "uploading" && <span className={styles["upload-spinner"]} />}
                  <button type="button" className={styles["upload-edit-btn"]} onClick={handleFilePick} aria-label="Chỉnh sửa ảnh">
                    <Pencil size={24} />
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
                  <ImageIcon size={24} />
                  <span className={styles["upload-hint"]}>Tải ảnh</span>
                </button>
              )}
              {errors.Thumbnail && <div className={styles["field-error"]}>{errors.Thumbnail}</div>}
              <Modal
                open={thumbnailImageOpen && Boolean(thumbnailPreview?.url)}
                title="Hình minh họa"
                footer={null}
                centered
                onCancel={() => setThumbnailImageOpen(false)}
                width={720}
              >
                {thumbnailPreview?.url && (
                  <img
                    src={thumbnailPreview.url}
                    alt="Ảnh minh họa bài viết"
                    style={{ display: "block", width: "100%", maxHeight: "70vh", objectFit: "contain" }}
                  />
                )}
              </Modal>
            </div>
          </div>

          <div className={styles["form-article-fields"]}>
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
            <span className={[styles["field-label"], !titleFocused && !values.Title ? styles["field-label-resting"] : "", titleFocused ? styles["field-label-active"] : ""].join(" ")}>
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
                rows={2}
                maxLength={SUMMARY_MAX}
                placeholder="Nhập tóm tắt bài viết..."
                value={values.Summary || ""}
                onFocus={() => setSummaryFocused(true)}
                onBlur={() => setSummaryFocused(false)}
                onChange={(e) => handleFieldChange("Summary", e.target.value as any)}
              />
            </div>
            <span className={[styles["field-label"], !summaryFocused && !values.Summary ? styles["field-label-resting"] : "", summaryFocused ? styles["field-label-active"] : ""].join(" ")}>
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
            <div
              className={[
                styles["editor-wrapper"],
                errors.Content ? styles["field-error-border"] : "",
                shakeField === "Content" ? styles["shake"] : "",
              ].join(" ")}
            >
              {/* NOTE: TinyEditor cần nhận prop value/onChange — chỉnh lại tên prop nếu component thật dùng tên khác (vd initialValue/onEditorChange) */}
              <TinyEditor statusbar={false} icons={newsEditorIcons} height={168} toolbar="bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | link | bullist numlist blockquote | image media" value={values.Content} onChange={(html: string) => handleFieldChange("Content", html as any)} />
            </div>
            {errors.Content && <div className={styles["field-error"]}>{errors.Content}</div>}
          </div>

          </div>

          {/* Nguồn thông tin */}
          <div className={`${styles["field-wrapper"]} ${styles["form-source-field"]} ${model ? styles["form-source-field-edit"] : ""}`}>
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
              className={[styles["field-label"], !sourceFocused && !values.Source ? styles["field-label-resting"] : "", sourceFocused ? styles["field-label-active"] : ""].join(
                " "
              )}
            >
              {model ? "Nguồn thông tin" : "Nguồn"}
            </span>
            <div className={styles["field-footer"]}>
              {errors.Source && <span className={styles["field-error"]}>{errors.Source}</span>}
              {model && <span className={styles["source-hint"]}>các thông tin chia sẻ từ nơi khác bắt buộc ghi đường link trích dẫn</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className={styles["news-form-bottom-fixed"]}>
        <div className={styles["bottom-actions"]}>
          <button type="button" className={styles["preview-button"]} onClick={handlePreview}>
            Xem trước
          </button>
          {model && (model as INewsResponse).Status === 2 && onReject && (
            <button
              type="button"
              className={styles["reject-button"]}
              onClick={handleOpenReject}
              disabled={isSubmit}
            >
              Từ chối
            </button>
          )}
          {model && (model as INewsResponse).Status === 2 && onApprove && (
            <button
              type="button"
              className={styles["approve-button"]}
              onClick={() => setApprovePanelOpen(true)}
              disabled={isSubmit}
            >
              Duyệt bài
            </button>
          )}
          <button
            type="button"
            className={styles["submit-button"]}
            onClick={handleSubmit}
            disabled={isSubmit}
          >
            {isSubmit && <span className={styles["btn-spinner"]} />}
            {model ? "Xác nhận" : "Gửi duyệt bài"}
          </button>
        </div>
      </div>

      <Modal
        title="Duyệt bài viết?"
        open={approvePanelOpen}
        onCancel={() => !isSubmit && setApprovePanelOpen(false)}
        onOk={handleApprove}
        confirmLoading={isSubmit}
        okText="Duyệt bài"
        cancelText="Hủy"
        maskClosable={false}
      >
        <p>Bài viết sẽ được hiển thị công khai. Sau khi duyệt, nội dung không thể chỉnh sửa.</p>
      </Modal>

      {/* Modal lý do từ chối */}
      <Modal
        title="Từ chối bài viết?"
        open={rejectPanelOpen}
        onCancel={() => {
          if (isSubmit) return;
          setRejectPanelOpen(false);
          setRejectReason("");
        }}
        onOk={handleReject}
        confirmLoading={isSubmit}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true, disabled: !rejectReason.trim() }}
        cancelText="Huỷ"
        maskClosable={false}
      >
        <p style={{ marginBottom: 8 }}>
          Bài viết sẽ không được duyệt. Vui lòng nhập lý do để người đăng biết và chỉnh sửa lại.
        </p>
        <Input.TextArea
          placeholder="Nhập lý do từ chối để người đăng biết và chỉnh sửa lại..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
          autoFocus
        />
      </Modal>

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
