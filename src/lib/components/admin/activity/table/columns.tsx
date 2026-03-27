/* eslint-disable no-nested-ternary */
import { Avatar, Col, Image, Row, Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { IHistory } from "@/services/api/history/IHistory";

const { Text, Paragraph } = Typography;

const ellipsis = { rows: 1, expandable: true, symbol: "Xem thêm" };

const TableNameItem = ({
  value,
  instanceId,
}: {
  value: "tblProp";
  instanceId: number;
}) => {
  return (
    <Link href={`${AppRoutes.property.url}/${instanceId}`}>
      Bất động sản - Mã : {instanceId}
    </Link>
  );
};

const columns: ColumnsType<IHistory> = [
  {
    title: "Người chỉnh sửa",
    dataIndex: "CreatedBy",
    render(value, record) {
      return (
        <Space>
          {record.UserAdmin?.Avatar && (
            <Avatar
              src={
                <Image
                  height="100%"
                  style={{ objectFit: "cover" }}
                  src={record.UserAdmin?.Avatar.toString()}
                />
              }
              size={{ xl: 38 }}
            />
          )}
          <Space direction="vertical">
            <Text>{value}</Text>
            <Text>{record.ActionDate}</Text>
          </Space>
        </Space>
      );
    },
  },

  {
    title: "Thông tin chỉnh sửa",
    dataIndex: "HistoryDetails",
    width: 650,
    render(value, record) {
      return record.HistoryDetails.map((e) => (
        <Row key={`${record.Id}_${e.ColumnNameVietnamese}`} gutter={[12, 12]}>
          <Col span={6}>
            <Text strong ellipsis={{ tooltip: e.ColumnNameVietnamese }}>
              {e.ColumnNameVietnamese}:{" "}
            </Text>
          </Col>
          <Col span={8}>
            <Paragraph ellipsis={ellipsis}>{e.OldValue}</Paragraph>
          </Col>
          <Col span={2}>
            <ArrowRightIcon />
          </Col>
          <Col span={8}>
            <Paragraph ellipsis={ellipsis}>{e.NewValue}</Paragraph>
          </Col>
        </Row>
      ));
    },
  },

  {
    title: "Bảng liên quan",
    dataIndex: "TableName",
    render(value, record) {
      return <TableNameItem instanceId={record.InstanceId} value={value} />;
    },
  },
];

export default columns;
