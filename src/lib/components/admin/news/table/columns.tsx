import { Image, Space, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { mutate } from "swr";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import type { INewsResponse } from "@/services/api/news/INews";
import newsApi from "@/services/api/news/newsApi";

const { Text } = Typography;

const formatDateCell = (value?: string) => {
  if (!value) {
    return null;
  }

  const date = dayjs(value);
  return (
    <div className="news-date-cell">
      <span>{date.format("DD/MM/YYYY")}</span>
      <span>{date.format("HH:mm:ss")}</span>
    </div>
  );
};

const columns: ColumnsType<INewsResponse> = [
  {
    title: "Mã tin",
    dataIndex: "Id",
    width: 120,
    align: "center",
    render(value) {
  return <span className="news-id-badge">{value}</span>;
    },
  },
  {
    title: "Hình ảnh",
    dataIndex: "Thumbnail",
    width: 80,
    align: "center",
    render(value) {
      if (!value) {
        return null;
      }

      return (
        <Image
          src={value.toString()}
          alt=""
          width={48}
          height={48}
          className="news-thumbnail"
          preview={false}
        />
      );
    },
  },
  {
    title: "Tiêu đề",
    dataIndex: "Title",
    ellipsis: true,
    render(value, record) {
      return (
        <Link href={`${AppRoutes.news.url}/edit/${record.Id}`}>
          <Text className="news-title-link">{value}</Text>
        </Link>
      );
    },
  },
  {
    title: "Người viết",
    dataIndex: "CreatedBy",
    width: 140,
    render(value) {
      return <Text>{value || "—"}</Text>;
    },
  },
  {
    title: "Ngày ra tin",
    dataIndex: "CreatedDate",
    width: 120,
    render: (_, record) => formatDateCell(record.CreatedDate),
  },
  {
    title: "Người duyệt",
    dataIndex: "ApprovedBy",
    width: 140,
    render(value, record) {
      const approver =
        value || (record.Status !== 0 ? record.CreatedBy : undefined);
      return <Text>{approver || "—"}</Text>;
    },
  },
  {
    title: "Ngày duyệt",
    dataIndex: "ApprovedDate",
    width: 120,
    render(value, record) {
      const date =
        value || (record.Status !== 0 ? record.UpdatedDate : undefined);
      return formatDateCell(date);
    },
  },
  {
    key: "Action",
    title: "Chức năng",
    width: 100,
    align: "center",
    render(_, record) {
      return (
        <Space size={8}>
          <BtnConfirm
            onOkClick={async () => {
              await newsApi.delete(record.Id ?? 0);
              mutate(newsApi.mutateKey);
            }}
            type="icon"
            danger
            style={{ width: 32, height: 32 }}
            icon={<Trash2Icon className="size-4 text-[#ff4d4f]" />}
          />
          <Link href={`${AppRoutes.news.url}/edit/${record.Id}`}>
            <button type="button" className="news-action-btn">
              <SquarePenIcon className="size-4" />
            </button>
          </Link>
        </Space>
      );
    },
  },
];

export default columns;
