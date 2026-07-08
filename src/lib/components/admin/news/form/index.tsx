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

const isContentEmpty = (html?: string) => {
  if (!html) return true;
  const text = html.replace(/<[^>]*>/g, "").trim();
  return text.length === 0;
};

const NewsForm = ({ model, onClose }: Props) => {
  const router = useRouter();

  const [isSubmit, setIsSubmit] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [shakeField, setShakeField] = useState<ErrorKey | null>(null);

  const [values, setValues] = useState<INewsRequest>(() => ({
    ...(model as INewsRequest),
    SourceType: (model as INewsRequest)?.SourceType || "write",
    Thumbnail: model?.Thumbnail ? (fileServices.mapFromString(model.Thumbnail) as any) : [],
  }));

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
    setValues((prev) => ({ ...prev, [key]: val }));
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
    mutate(newsApi.mutateKey);
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
      formData.append("file", file);
      formData.append("TableName", ETableName.News as unknown as string);
      formData.append("resize", "false");
      formData.append("watermark", "false");

      const res = await fetch(imagesApi.uploadUrl, { method: "POST", body: formData });
      const data = await res.json();

      // NOTE: tuỳ theo response thật của imagesApi.uploadUrl, chỉnh lại field lấy url cho đúng
      const remoteUrl: string = data?.url ?? data?.Url ?? data?.data?.url ?? localUrl;

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
    if (!values.Title?.trim()) next.Title = "Vui lòng nhập tiêu đề";
    if (!values.Summary?.trim()) next.Summary = "Vui lòng nhập tóm tắt";
    if (isContentEmpty(values.Content)) next.Content = "Vui lòng nhập nội dung";
    if (!values.Source?.trim()) next.Source = "Vui lòng nhập nguồn thông tin";
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
      const payload: INewsRequest = { ...values };
      if (payload.Thumbnail && Array.isArray(payload.Thumbnail)) {
        const res = fileServices.processFiles(payload.Thumbnail as any);
        payload.Thumbnail = res.toString();
      }
      if (model?.Id) {
        await newsApi.update(payload);
      } else {
        await newsApi.add(payload);
      }
      mutate(newsApi.mutateKey);
      router.replace(AppRoutes.news.url);
    } finally {
      setIsSubmit(false);
    }
  };

  const titleLen = values.Title?.length ?? 0;
  const summaryLen = values.Summary?.length ?? 0;

  return (
    <div className={styles["news-form-wrapper"]}>
      {/* Header */}
      <div className={styles["news-form-header"]}>
        <h1 className={styles["news-form-title"]}>
          {model ? "CẬP NHẬT BÀI VIẾT" : "THÊM BÀI VIẾT"}
        </h1>
        {onClose && (
          <button type="button" className={styles["news-form-close"]} onClick={onClose}>
            <IconClose />
          </button>
        )}
      </div>

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
                  />
                  {thumbnailPreview.status === "uploading" && <span className={styles["upload-spinner"]} />}
                  <button type="button" className={styles["upload-remove-btn"]} onClick={handleRemoveThumbnail}>
                    <IconTrash />
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
                placeholder="Nhập tên nguồn (VD: báo Đại Đoàn Kết, VTC News)..."
                value={values.Source || ""}
                onFocus={() => setSourceFocused(true)}
                onBlur={() => setSourceFocused(false)}
                onChange={(e) => handleFieldChange("Source", e.target.value as any)}
              />
            </div>
            <span
              className={[styles["field-label"], sourceFocused || values.Source ? styles["field-label-active"] : ""].join(
                " "
              )}
            >
              Nguồn thông tin <span className={styles["required"]}>*</span>
            </span>
            <div className={styles["field-footer"]}>
              {errors.Source && <span className={styles["field-error"]}>{errors.Source}</span>}
              <span className={styles["source-hint"]}>
                các thông tin chia sẻ từ nơi khác bắt buộc ghi nguồn đường link trích dẫn
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className={styles["news-form-bottom-fixed"]}>
        <div className={styles["bottom-actions"]}>
          <button type="button" className={styles["preview-button"]} onClick={handlePreview}>
            <IconEye /> Xem trước
          </button>
          <button
            type="button"
            className={styles["submit-button"]}
            onClick={handleSubmit}
            disabled={isSubmit}
          >
            {isSubmit && <span className={styles["btn-spinner"]} />}
            {model ? "Cập nhật" : "Duyệt tin"}
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