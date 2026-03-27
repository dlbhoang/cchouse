/* eslint-disable no-nested-ternary */
import { Badge, Button, Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";

import {
  EPropTransferStatus,
  IPropTransferResponse,
} from "@/services/property/models/prop-transfer";

const { Text } = Typography;

type Props = {
  handleOpenDetail: (transfer: IPropTransferResponse) => void;
};

const columns = ({
  handleOpenDetail,
}: Props): ColumnsType<IPropTransferResponse> => {
  return [
    {
      title: "Mã BĐS",
      dataIndex: "PropId",
      align: "center",
      render(value) {
        return <Text>{value}</Text>;
      },
    },
    {
      title: "Người nhập cũ",
      dataIndex: "OlddUserName",
    },
    {
      title: "Người nhập mới",
      dataIndex: "NewdUserName",
    },

    {
      title: "Người kiểm duyệt",
      dataIndex: "ApproveUserName",
    },
    {
      title: "Trạng thái",
      dataIndex: "StatusName",
      render(value, record) {
        return (
          <Badge
            status={
              record.Status === EPropTransferStatus.Pending
                ? "processing"
                : record.Status === EPropTransferStatus.Approved
                ? "success"
                : "error"
            }
            text={value}
          />
        );
      },
    },
    // Chi tiết
    {
      title: "Chi tiết",
      dataIndex: "RequestNotes",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Button
              size="small"
              type="primary"
              onClick={() => handleOpenDetail(record)}
            >
              Xem chi tiết
            </Button>
            {record.Status === EPropTransferStatus.Rejected && (
              <Text type="danger">Lý do từ chối: {record.ApproveNotes}</Text>
            )}
          </Space>
        );
      },
    },
  ];
};

export default columns;
