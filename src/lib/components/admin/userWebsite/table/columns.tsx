import { FacebookOutlined } from "@ant-design/icons";
import { Popconfirm, Space, Switch, Tag, Tooltip, Typography } from "antd";
import type { TagProps } from "antd/lib";
import type { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import Link from "next/link";
import RenderPhone from "@/lib/components/shared/CustomRender/RenderPhone";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import type { IUserWebsiteResponse } from "@/services/api/userWebsite/model";
import UserWebsiteStatus from "../user-status";

const { Text } = Typography;
const { url } = AppRoutes.userWebsite;

const tagColorMap: Record<string, TagProps["color"]> = {
  "Cá nhân": "blue",
  "Công ty": "green",
  "Môi giới": "red",
};

type Props = {
  onBlock: (id: number) => void;
};

export const columns = ({
  onBlock,
}: Props): ColumnsType<IUserWebsiteResponse> => [
  {
    title: "STT",
    dataIndex: "Id",
    render(value, record) {
      return (
        <Link href={`${url}/${record.Id}`}>
          <Text>{value}</Text>
        </Link>
      );
    },
  },
  {
    title: "Họ và tên",
    dataIndex: "FullName",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${url}/${record.Id}`}>
            <Text strong>{value}</Text>
          </Link>
          <Tag color={tagColorMap[record.TypeName]}>{record.TypeName}</Tag>
        </Space>
      );
    },
  },
  {
    title: "Thông tin",
    dataIndex: "Phone",
    render(value, record) {
      return (
        <Space direction="vertical">
          {record.ZaloId && (
            <Tooltip title="Tài khoản có liên kết Zalo">
              <Space align="center">
                <Text>Có liên kết Zalo</Text>
              </Space>
            </Tooltip>
          )}
          {record.FacebookId && (
            <Tooltip title="Tài khoản có liên kết Facebook">
              <Space align="center">
                <FacebookOutlined />
                <Text>Có liên kết Facebook</Text>
              </Space>
            </Tooltip>
          )}
          {value && <RenderPhone phones={[value]} />}
        </Space>
      );
    },
  },
  {
    title: "Mục đích",
    dataIndex: ["UserWebsiteDemand", "BasicDemandNames"],
    render: (value, record) => {
      return (
        <Space direction="vertical">
          <Text>{value?.join(", ")}</Text>
          {/* <Tag>{record.TypeName}</Tag> */}
        </Space>
      );
    },
    width: 300,
  },
  {
    title: "Ngày đăng ký",
    dataIndex: "CreatedDate",
    render: (value) => dayjs(value).format(appConst.DATE_TIME_FORMAT),
  },
  {
    title: "Trạng thái",
    dataIndex: "StatusName",
    render: (value) => <UserWebsiteStatus value={value} />,
  },
  {
    title: "Ngày duyệt",
    dataIndex: "ApproveDate",
    render: (value) =>
      value ? dayjs(value).format(appConst.DATE_TIME_FORMAT) : "",
  },
  {
    title: "Hoạt động / Khoá",
    dataIndex: "IsActive",
    render: (value, record) => {
      return (
        <Space>
          <Popconfirm
            title={
              value ? "Xác nhận khoá tài khoản?" : "Kích hoạt lại tài khoản?"
            }
            onConfirm={() => onBlock(record.Id ?? 0)}
          >
            <Switch checked={value} />
          </Popconfirm>
        </Space>
      );
    },
  },
];
