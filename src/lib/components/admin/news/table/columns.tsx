import type { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { CheckIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { mutate } from "swr";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import type { INewsResponse } from "@/services/api/news/INews";
import newsApi from "@/services/api/news/newsApi";
import newsTypeApi from "@/services/api/news/newsTypeApi";
import "./columns.css";

const formatDateCell = (value?: string) => {
  if (!value) {
    return null;
  }

  const date = dayjs(value);
  return (
    <div className="news-date-cell">
      <span className="news-date">{date.format("DD/MM/YYYY")}</span>
      <span className="news-time">{date.format("HH:mm:ss")}</span>
    </div>
  );
};

const statusNameClasses: { match: RegExp; className: string }[] = [
  { match: /ch[ờo]\s*duy[ệe]t/i, className: "news-status-pending" },
  { match: /t[ừu]\s*ch[ốo]i|l[ỗo]i/i, className: "news-status-rejected" },
  { match: /[ẩâ]n/i, className: "news-status-hidden" },
  { match: /duy[ệe]t|hi[ểe]n\s*th[ịi]/i, className: "news-status-approved" },
];

const statusIndexClasses: Record<number, string> = {
  0: "news-status-hidden",
  1: "news-status-approved",
  2: "news-status-pending",
};

const getStatusClassName = (status?: number, statusName?: string) => {
  if (statusName) {
    const found = statusNameClasses.find(({ match }) => match.test(statusName));
    if (found) return found.className;
  }
  return (status !== undefined && statusIndexClasses[status]) || "news-status-default";
};

const NEWS_STATUS_PENDING = 2;

const getThumbnailUrl = (value: unknown) => {
  const thumbnail = Array.isArray(value) ? value[0] : value;
  if (!thumbnail) return "";
  if (typeof thumbnail === "object" && thumbnail !== null) {
    const item = thumbnail as { url?: string; Path?: string };
    return item.url ?? item.Path ?? "";
  }
  return String(thumbnail).split("|")[0].trim();
};

const createColumns = (
  typeMap: Record<number, string>,
  onPreview?: (item: INewsResponse) => void,
  onEdit?: (item: INewsResponse) => void
): ColumnsType<INewsResponse> => [
  {
    title: () => <span className="news-th-label">Mã tin</span>,
    dataIndex: "Id",
    width: 90,
    align: "center",
    render(value) {
      return <span className="news-id-badge">{value}</span>;
    },
  },
  {
    title: () => <span className="news-th-label">Loại tin</span>,
    dataIndex: "NewsTypeId",
    width: 130,
    render(value, record) {
      const name = record.Source?.trim() ? "Chia sẻ" : "Viết bài";
      const id = Number(value);
      const fallbackName = typeMap?.[id] ?? (value as any) ?? "—";
      return (
        <span className="news-type-text" title={name || fallbackName}>
          {name || fallbackName}
        </span>
      );
    },
  },
  {
    title: () => <span className="news-th-label">Hình ảnh</span>,
    dataIndex: "Thumbnail",
    width: 90,
    minWidth: 90,
    align: "center",
    render(value, record) {
      const thumb = getThumbnailUrl(value);
      if (!thumb) return <div className="news-thumb-placeholder" />;
      return (
        <img
          src={thumb}
          alt={record.Title ?? ""}
          className="news-thumbnail"
          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
        />
      );
    },
  },
  {
    title: () => <span className="news-th-label">Tiêu đề</span>,
    dataIndex: "Title",
    width: 260,
    render(value, record) {
      return (
        <div className="news-title-cell">
          <div className="news-title-row">
            <span className="news-title-text" title={value}>
              {value || "—"}
            </span>
            {onEdit ? (
              <button
                type="button"
                className="news-see-more"
                onClick={() => onEdit(record)}
              >
                Xem thêm
              </button>
            ) : (
              <Link
                href={`${AppRoutes.news.url}/edit/${record.Id}`}
                className="news-see-more"
              >
                Xem thêm
              </Link>
            )}
          </div>
          {onPreview ? (
            <button
              type="button"
              className="news-view-btn"
              onClick={() => onPreview(record)}
            >
              Xem tin
            </button>
          ) : (
            <a
              className="news-view-btn"
              href={(record as any).PublicUrl ?? (record as any).Url ?? "#"}
              target="_blank"
              rel="noreferrer noopener"
            >
              Xem tin
            </a>
          )}
        </div>
      );
    },
  },
  {
    title: () => <span className="news-th-label">Nguồn/ Người đăng</span>,
    dataIndex: "Source",
    width: 160,
    render(value, record) {
      const firstLine = value || "Viết bài";
      const createdBy = record.CreatedBy;
      return (
        <div className="news-source-cell">
          <span className="news-source-line">{firstLine}</span>
          {createdBy && createdBy !== value ? (
            <span className="news-source-line">{createdBy}</span>
          ) : null}
        </div>
      );
    },
  },
  {
    title: () => <span className="news-th-label">Lượt xem</span>,
    dataIndex: "ViewCount",
    width: 90,
    align: "center",
    render(value) {
      return <span className="news-viewcount">{value ?? 0}</span>;
    },
  },
  {
    title: () => <span className="news-th-label">Ngày ra tin</span>,
    dataIndex: "CreatedDate",
    width: 140,
    render: (_, record) => formatDateCell(record.CreatedDate),
  },
  {
    title: () => <span className="news-th-label">Trạng thái</span>,
    dataIndex: "StatusName",
    width: 130,
    render(value, record) {
      const statusClass = getStatusClassName(record.Status, value);
      return (
        <span className={`news-status-tag ${statusClass}`}>{value || "—"}</span>
      );
    },
  },
  {
    title: () => <span className="news-th-label">Người duyệt</span>,
    dataIndex: "ApprovedBy",
    width: 160,
    render(value, record) {
      const isPending = record.Status === NEWS_STATUS_PENDING;
      const approvedDate =
        record.ApprovedDate || (!isPending ? record.UpdatedDate : undefined);

      if (!value && !approvedDate) {
        return <span className="news-approver-empty">—</span>;
      }

      return (
        <div className="news-approver-cell">
          {value ? <span className="news-approver-name">{value}</span> : null}
          {formatDateCell(approvedDate)}
        </div>
      );
    },
  },
  {
    key: "Action",
    title: () => <span className="news-th-label">Chức năng</span>,
    width: 150,
    align: "center",
    render(_, record) {
      return (
        <div className="news-action-cell">
          {record.Status === NEWS_STATUS_PENDING && (
            <BtnConfirm
              onOkClick={async () => {
                await newsApi.approve(record.Id ?? 0);
                newsApi.revalidate();
              }}
              type="icon"
              className="news-action-btn"
              style={{
                width: 40,
                height: 40,
                background: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
              }}
              title="Xác nhận duyệt bài?"
              description="Sau khi duyệt, bài viết sẽ hiển thị công khai trên trang tin."
              btnText=""
              icon={<CheckIcon className="size-4 text-[#22c55e]" />}
            />
          )}
          {onEdit ? (
            <button
              type="button"
              className="news-action-btn"
              onClick={() => onEdit(record)}
            >
              <SquarePenIcon className="size-4" />
            </button>
          ) : (
            <Link href={`${AppRoutes.news.url}/edit/${record.Id}`}>
              <button type="button" className="news-action-btn">
                <SquarePenIcon className="size-4" />
              </button>
            </Link>
          )}
          <BtnConfirm
            onOkClick={async () => {
              await newsApi.delete(record.Id ?? 0);
              newsApi.revalidate();
            }}
            type="icon"
            danger
            className="news-action-btn"
            style={{
              width: 40,
              height: 40,
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: 10,
            }}
            icon={<Trash2Icon className="size-4 text-[#ff4d4f]" />}
          />
        </div>
      );
    },
  },
];

export const useNewsColumns = (
  onPreview?: (item: INewsResponse) => void,
  onEdit?: (item: INewsResponse) => void
): ColumnsType<INewsResponse> => {
  const { data } = newsTypeApi.useGet({ pageIndex: 1, pageSize: 200 });
  const types = data?.data ?? [];
  const typeMap: Record<number, string> = {};
  types.forEach((t) => {
    if (t.Id) typeMap[t.Id] = t.Name;
  });
  return createColumns(typeMap, onPreview, onEdit);
};

export default createColumns({});