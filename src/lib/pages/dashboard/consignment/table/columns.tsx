import { Space, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { CheckIcon, ImageIcon, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import BtnPhone from "@/lib/components/shared/BtnPhone";
import ReadMore from "@/lib/components/shared/ReadMore";
import { appConst } from "@/lib/core/configs/appConst";
import { ETransType } from "@/lib/core/enum";
import { FormatDate } from "@/lib/core/utils/myFormat";
import type { IConsignmentResponse } from "@/services/api/consignment/IConsignment";
import { FormatNumber } from "../../../../core/utils/myFormat";

const { Text } = Typography;

type Props = {
  handleOpenImages: (val: string[]) => void;
  handleOpenVideo: (val: string) => void;
};

export const columns = ({
  handleOpenImages,
  handleOpenVideo,
}: Props): ColumnsType<IConsignmentResponse> => [
  {
    title: "STT",
    dataIndex: "Id",
    align: "center",
    render(value) {
      return (
        <Space direction="vertical">
          <Button variant="link">
            <Text strong>{value}</Text>
          </Button>
        </Space>
      );
    },
  },

  {
    title: "Địa chỉ",
    dataIndex: "Address",
    render(value, record) {
      return (
        <Space direction="vertical">
          <ReadMore>{value}</ReadMore>
          <Space>
            {record.Images && (
              <Button
                type="button"
                size="icon-sm"
                className="rounded-full"
                onClick={() => {
                  handleOpenImages(record.Images ?? []);
                }}
              >
                <ImageIcon />
              </Button>
            )}
            {record.Video && (
              <Button
                type="button"
                size="icon-sm"
                className="rounded-full"
                onClick={() => {
                  handleOpenVideo(record.Video ?? "");
                }}
              >
                <VideoIcon />
              </Button>
            )}
          </Space>
        </Space>
      );
    },
  },
  {
    title: "Gửi bán",
    dataIndex: "TransTypes",
    render(value: number[], record) {
      return value.includes(ETransType.sell) ? (
        <Space direction="vertical">
          <Text>Giá: {FormatNumber(record.SellPrice)}đ</Text>
        </Space>
      ) : (
        "---------"
      );
    },
  },
  {
    title: "Gửi thuê",
    dataIndex: "TransTypes",
    render(value: number[], record) {
      return value.includes(ETransType.rent) ? (
        <Space direction="vertical">
          <Text>Giá: {FormatNumber(record.RentPrice)}đ</Text>
        </Space>
      ) : (
        "---------"
      );
    },
  },
  {
    title: "Loại BĐS",
    dataIndex: "PropTypeName",
  },
  {
    title: "Thông tin liên hệ",
    dataIndex: "ContactName",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Typography.Text>Họ tên: {value}</Typography.Text>
          <BtnPhone phone={record.ContactPhone} />
          <Typography.Text>
            Email: {record.ContactEmail || appConst.TEXT_DEFAULT}{" "}
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
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={() => {
            console.log(val);
          }}
        >
          <CheckIcon /> Đã xử lý
        </Button>
      );
    },
  },
];
