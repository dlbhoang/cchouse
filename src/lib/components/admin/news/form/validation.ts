import type { INewsRequest } from "@/services/api/news/INews";

export type ErrorKey = "NewsTypeId" | "SourceType" | "Thumbnail" | "Title" | "Summary" | "Content" | "Source";
export type FormErrors = Partial<Record<ErrorKey, string>>;

export const isContentEmpty = (html?: string) => !html || html
  .replace(/<[^>]*>/g, "")
  .replace(/&nbsp;|&#160;|&#xa0;/gi, " ")
  .trim().length === 0;

export const validateNews = (values: INewsRequest): FormErrors => {
  const next: FormErrors = {};
  const files = Array.isArray(values.Thumbnail) ? values.Thumbnail : [];
  if (!values.NewsTypeId) next.NewsTypeId = "Vui lòng chọn loại tin";
  if (!values.SourceType) next.SourceType = "Vui lòng chọn nguồn tin";
  if (values.SourceType === "share" && !values.Source?.trim()) next.Source = "Vui lòng nhập nguồn thông tin";
  if (!files.length) next.Thumbnail = "Vui lòng chọn hình minh hoạ";
  else if (files.some((file) => file.status === "error")) next.Thumbnail = "Ảnh không thể tải, vui lòng chọn ảnh khác";
  else if (files.some((file) => file.status === "uploading")) next.Thumbnail = "Vui lòng chờ tải ảnh hoàn tất";
  if (!values.Title?.trim()) next.Title = "Vui lòng nhập tiêu đề";
  else if (values.Title.length > 150) next.Title = "Không được nhập nhiều hơn 150 kí tự";
  if (!values.Summary?.trim()) next.Summary = "Vui lòng nhập tóm tắt";
  else if (values.Summary.length > 350) next.Summary = "Không được nhập nhiều hơn 350 kí tự";
  if (isContentEmpty(values.Content)) next.Content = "Vui lòng nhập nội dung";
  return next;
};
