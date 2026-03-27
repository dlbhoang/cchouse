import { Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { IPropCheckAddress } from "@/lib/interfaces/Property/IProp";

const { Text } = Typography;

export const subCols: ColumnsType<IPropCheckAddress> = [
  {
    title: "Mã",
    dataIndex: "Id",
    align: "center",
    render(value, record) {
      return (
        <Link href={`${AppRoutes.property.url}/${record.Id}`} target="_blank">
          {value}
        </Link>
      );
    },
  },
  {
    title: "Số nhà",
    dataIndex: "AddressNumber",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${AppRoutes.property.url}/${record.Id}`}>
            <Typography>{`${value} ${
              record.SubAddressName ? `(${record.SubAddressName})` : ""
            }`}</Typography>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Đường",
    dataIndex: "StreetName",
  },
  {
    title: "Phường",
    dataIndex: "WardName",
  },
  {
    title: "Quận",
    dataIndex: "DistrictName",
  },

  {
    title: "Diện tích",
    dataIndex: "Area",
    render(value, record) {
      return (
        <Space direction="vertical">
          <RenderArea
            title="DTTT: "
            area={value}
            length={record.Length}
            width={record.Width}
          />
        </Space>
      );
    },
  },
  {
    title: "Người nhập",
    dataIndex: "CreatedBy",
  },
  {
    title: "Chức năng",
    key: "action",
    dataIndex: "Id",
  },
];
