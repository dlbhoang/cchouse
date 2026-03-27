import { Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import type { IApartmentUnitResponse } from "@/services/api/apartment/unit/IApartmentUnit";

const { Text } = Typography;

const { url } = AppRoutes.apartmentUnit;

export const subCols: ColumnsType<IApartmentUnitResponse> = [
  {
    title: "Mã căn",
    dataIndex: "Code",
    align: "center",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${url}/${record.Id}`}>
            <Text>{value}</Text>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Giá",
    dataIndex: ["Contact", "DisplayPrice"],
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${url}/${record.Id}`}>
            <Text>{value}</Text>
          </Link>
          {/* {record.IsMonopoly && <Tag color="orange">Độc quyền</Tag>} */}
        </Space>
      );
    },
  },
  {
    title: "Tầng (lầu) số",
    dataIndex: "FloorNumber",
    render(value, record) {
      return (
        <Link href={`${url}/${record.Id}`}>
          <Text>{value}</Text>
        </Link>
      );
    },
  },
  {
    title: "Block",
    dataIndex: "Block",
    render(value, record) {
      return (
        <Link href={`${url}/${record.Id}`}>
          <Text>{value ?? "Không có"}</Text>
        </Link>
      );
    },
  },
  {
    title: "Khu vực",
    dataIndex: "Zone",
    render(value, record) {
      return (
        <Link href={`${url}/${record.Id}`}>
          <Text>{value ?? "Không có"}</Text>
        </Link>
      );
    },
  },
  {
    title: "Diện tích",
    dataIndex: "Area",
    render(value, record) {
      return (
        <Link href={`${url}/${record.Id}`}>
          <RenderArea area={value} />
        </Link>
      );
    },
  },

  {
    title: "Số phòng",
    dataIndex: "Bedroom",
    render(value, record) {
      return (
        <Link href={`${url}/${record.Id}`}>
          <Text>{value ?? appConst.TEXT_DEFAULT}</Text>
        </Link>
      );
    },
  },
  {
    title: "Số toilet",
    dataIndex: "Bathroom",
    render(value, record) {
      return (
        <Link href={`${url}/${record.Id}`}>
          <Text>{value ?? appConst.TEXT_DEFAULT}</Text>
        </Link>
      );
    },
  },

  {
    title: "Loại BĐS",
    dataIndex: "PropTypeName",
    render: (value, record) => (
      <Link href={`${url}/${record.Id}`}>
        <Text>{value}</Text>
      </Link>
    ),
  },

  {
    title: "Hướng",
    dataIndex: "DirectionName",
  },
];
