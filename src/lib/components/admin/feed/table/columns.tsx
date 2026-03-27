import { Space, Tag, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { ImageIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PhoneBtn from "@/components/ui/button/phone-btn";
import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { FormatNumber } from "@/lib/core/utils/myFormat";
import { IFeedResponse } from "@/services/api/feed/IFeed";

const { Text, Paragraph } = Typography;

type Props = {
  handleOpenPreview: (item: IFeedResponse) => void;
  handleOpenImages: (images: string[]) => void;
  handleOpenVideo: (val: string) => void;
};

const columns = ({
  handleOpenPreview,
  handleOpenImages,
  handleOpenVideo,
}: Props): ColumnsType<IFeedResponse> => [
  {
    title: "Mã tin",
    dataIndex: "Id",
    width: 100,
    align: "center",
    render: (val, record) => {
      return (
        <Space direction="vertical">
          <Text>{val}</Text>
          <Text type="secondary">{record.ViewCount} lượt xem</Text>
          <Space>
            {record.Status === 3 && (
              <Space direction="vertical">
                <Text type="danger"> Tin đã bị huỷ</Text>
                <Text type="danger">Lý do: {record.ReasonDeny}</Text>
              </Space>
            )}
          </Space>
        </Space>
      );
    },
  },
  {
    title: "Tiêu đề",
    width: 200,
    dataIndex: "Title",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Tag color={record.Property.TransType === 1 ? "success" : "blue"}>
            {record.Property.TransTypeName}
          </Tag>
          <Link href={`${AppRoutes.feed.url}/${record.Id}`}>
            <Text>{value}</Text>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Nội dung",
    width: 300,
    dataIndex: "Title",
    render(value, record) {
      return (
        <Link href={`${AppRoutes.feed.url}/${record.Id}`}>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: "xem thêm" }}
          >
            {record.Content}
          </Paragraph>
        </Link>
      );
    },
  },

  {
    title: "Thông tin bất động sản",
    width: 300,
    dataIndex: ["Property", "DisplayPrice"],
    render(value, record) {
      return (
        <Space direction="vertical">
          <Text strong>{record.Property.PropTypeName}</Text>
          <Text>
            Địa chỉ:{" "}
            {`${record.Property.AddressNumber ?? ""} ${
              record.Property.StreetName
            }, ${record.Property.WardName}, ${record.Property.DistrictName}`}
          </Text>
          <Text>
            Diện tích:{" "}
            <RenderArea
              area={record.Property.Area}
              length={record.Property.Length}
              width={record.Property.Width}
            />
          </Text>
          <Text>Giá: {FormatNumber(value)}</Text>
          <Space>
            {(record.Property.Images?.length ?? 0) > 0 && (
              <Button
                type="button"
                size="icon-sm"
                className="rounded-full"
                onClick={() => {
                  handleOpenImages(record.Property.Images as string[]);
                }}
              >
                <ImageIcon />
              </Button>
            )}

            {record.Property.Video && (
              <Button
                type="button"
                size="icon-sm"
                className="rounded-full"
                onClick={() => {
                  handleOpenVideo(record.Property.Video?.toString() ?? "");
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
    title: "Liên hệ",
    width: 100,
    dataIndex: ["Author", "FullName"],
    render(value, record) {
      return (
        <Space direction="vertical">
          <Text>{value}</Text>
          {record.Author?.Phone && <PhoneBtn phone={record.Author?.Phone} />}
        </Space>
      );
    },
  },
  {
    title: "Ngày ra tin",
    width: 100,
    dataIndex: "StartDate",
    render: (value, record) => (
      <Space direction="vertical">
        {dayjs(value).format(appConst.DATE_FORMAT)}

        <Button onClick={() => handleOpenPreview(record)}>Xem tin</Button>
      </Space>
    ),
  },
  {
    title: "Ngày hết hạn",
    dataIndex: "ExpiredDate",
    width: 100,
    render: (value) => (
      <Typography.Text type="danger">
        {dayjs(value).format(appConst.DATE_FORMAT)}
      </Typography.Text>
    ),
  },
  {
    key: "AcceptDate",
    width: 100,
    title: "Ngày duyệt/Từ chối",
    dataIndex: "AcceptDate",
    render: (value, record) => (
      <Space direction="vertical">
        {value ? dayjs(value).format(appConst.DATE_FORMAT) : ""}
        <Text>{record.AcceptBy}</Text>
      </Space>
    ),
  },
];

export default columns;
