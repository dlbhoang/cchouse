/* eslint-disable no-nested-ternary */

import { Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { mutate } from "swr";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { FormatDateTime } from "@/lib/core/utils/myFormat";
import { INewsResponse } from "@/services/api/news/INews";
import newsApi from "@/services/api/news/newsApi";

const { Text } = Typography;

const columns: ColumnsType<INewsResponse> = [
  {
    title: "Mã",
    dataIndex: "Id",
    align: "center",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${AppRoutes.news.url}/edit/${record.Id}`}>
            <Text>{value}</Text>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Tiêu đề",
    dataIndex: "Title",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${AppRoutes.news.url}/edit/${record.Id}`}>
            <Text>{value}</Text>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Nội dung tóm tắt",
    dataIndex: "Summary",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${AppRoutes.news.url}/edit/${record.Id}`}>
            <Text>{value}</Text>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Ngày tạo",
    dataIndex: "CreadtedDate",
    render(value, record) {
      return <Space direction="vertical">{FormatDateTime(value)}</Space>;
    },
  },
  {
    key: "Action",
    title: "Thao tác",
    dataIndex: "CreatedDate",
    render(value, record) {
      return (
        <Space>
          <BtnConfirm
            onOkClick={async () => {
              await newsApi.delete(record.Id ?? 0);
              mutate(newsApi.mutateKey);
            }}
            type="icon"
            danger
            icon={<Trash2Icon className="size-4" />}
          />
        </Space>
      );
    },
  },
];

export default columns;
