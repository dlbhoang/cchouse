/* eslint-disable no-nested-ternary */
import { CheckOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import BtnPhone from "@/lib/components/shared/BtnPhone";
import ReadMore from "@/lib/components/shared/ReadMore";
import { appConst } from "@/lib/core/configs/appConst";
import { FormatDate } from "@/lib/core/utils/myFormat";
import type { IReportSpamResponse } from "@/services/api/reportSpam/IReportSpam";

const { Text } = Typography;

export const columns = ({
  handlePreviewFeed,
}: {
  handlePreviewFeed: (feedId: number) => void;
}): ColumnsType<IReportSpamResponse> => [
  {
    title: "Mã tin đăng",
    dataIndex: "FeedId",
    align: "center",
    render(value) {
      return (
        <Space direction="vertical">
          <Button type="link">
            <Text strong>{value}</Text>
          </Button>
          <Button onClick={() => handlePreviewFeed(value)}>Xem tin</Button>
        </Space>
      );
    },
  },
  {
    title: "Nội dung báo xấu",
    dataIndex: "Description",
    width: 400,
    render(value, record) {
      const content = value
        ? [...record.SpamTypeNames, value]
        : record.SpamTypeNames;
      return <ReadMore>{content}</ReadMore>;
    },
  },

  {
    title: "Thông tin liên hệ",
    dataIndex: "ReporterPhone",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Typography.Text>Họ tên: {record.ReporterName}</Typography.Text>
          <BtnPhone phone={value} />
          <Typography.Text>
            Email: {record.ReporterEmail || appConst.TEXT_DEFAULT}{" "}
          </Typography.Text>
        </Space>
      );
    },
  },

  {
    title: "Ngày gửi",
    dataIndex: "CreatedDate",
    render: (value) => <Text>{FormatDate(value)}</Text>,
  },

  {
    title: "Thao tác",
    dataIndex: "Id",
    render: (val, record) => {
      return (
        <Button
          icon={<CheckOutlined />}
          onClick={() => {
            console.log(val);
          }}
        >
          Đã xử lý
        </Button>
      );
    },
  },
];
