import { Button, Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";

import { appConst } from "@/lib/core/configs/appConst";
import { IFeedReport } from "../types/feed-report";

type Props = {
  onPreview: (feedId: number) => void;
};

const columns = ({ onPreview }: Props): ColumnsType<IFeedReport> => [
  {
    title: "Mã tin",
    dataIndex: "Id",
    align: "center",
    render: (value, record) => (
      <div className="flex flex-col gap-2">
        <span>{value}</span>
        <Button onClick={() => onPreview(record.Id)} size="small">
          Xem tin
        </Button>
      </div>
    ),
  },
  {
    title: "Lượt xem",
    dataIndex: "ViewCount",
    align: "center",
  },
  {
    title: "Tiêu đề",
    width: 350,
    dataIndex: "Title",
  },
  {
    title: "Người đăng",
    dataIndex: "UserAdminName",
  },
  {
    title: "Ngày ra tin",
    dataIndex: "StartDate",
    render: (value) => (
      <Space direction="vertical">
        {dayjs(value).format(appConst.DATE_FORMAT)}
      </Space>
    ),
  },
  {
    title: "Ngày hết hạn",
    dataIndex: "ExpiredDate",
    render: (value) => (
      <Typography.Text type="danger">
        {dayjs(value).format(appConst.DATE_FORMAT)}
      </Typography.Text>
    ),
  },
];

export default columns;
