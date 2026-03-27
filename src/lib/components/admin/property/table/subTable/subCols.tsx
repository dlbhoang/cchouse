import { Space, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";

const { Text } = Typography;

export const subCols: ColumnsType<IPropResponse> = [
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
    title: "Giá",
    dataIndex: "DisplayPrice",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${AppRoutes.property.url}/${record.Id}`}>
            <Typography>{value}</Typography>
          </Link>
          {record.IsMonopoly && <Tag color="orange">Độc quyền</Tag>}
        </Space>
      );
    },
  },
  {
    title: "Số nhà",
    dataIndex: ["PropAddress", "AddressNumber"],
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${AppRoutes.property.url}/${record.Id}`}>
            <Typography>{`${value} ${
              record.PropAddress.SubAddressName
                ? `(${record.PropAddress.SubAddressName})`
                : ""
            }`}</Typography>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Đường",
    dataIndex: ["PropAddress", "StreetName"],
  },
  {
    title: "Phường",
    dataIndex: ["PropAddress", "WardName"],
  },
  {
    title: "Quận",
    dataIndex: ["PropAddress", "DistrictName"],
  },
  {
    title: "Kết cấu",
    dataIndex: "CustomDisplayStructures",
    render(value, record) {
      return <Text>{value?.toString()}</Text>;
    },
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
            backSide={record.BackSide}
          />
          {record.PropAddress.AreaLegal > 0 &&
            record.TransType === ETransType.sell && (
              <RenderArea
                title="DTCN: "
                area={record.PropAddress.AreaLegal}
                length={record.PropAddress.LengthLegal}
                width={record.PropAddress.WidthLegal}
                backSide={record.PropAddress.BackSideLegal}
              />
            )}
        </Space>
      );
    },
  },
  {
    title: "Chức năng",
    key: "action",
    dataIndex: "Id",
  },
];
