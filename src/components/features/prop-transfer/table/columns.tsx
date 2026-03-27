/* eslint-disable no-nested-ternary */
import { Badge, Button, Space, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";

import {
  EPropTransferStatus,
  type IPropTransferResponse,
} from "@/services/property/models/prop-transfer";
import RejectModal from "../reject-modal";

const { Text } = Typography;

type Props = {
  handleApprove: (id: number) => void;
  handleMutate: () => void;
  handleOpenHistory: (id: number) => void;
};

const columns = ({
  handleApprove,
  handleMutate,
  handleOpenHistory,
}: Props): ColumnsType<IPropTransferResponse> => {
  return [
    {
      title: "Mã BĐS",
      dataIndex: "PropId",
      align: "center",
      render(value) {
        return (
          <Space direction="vertical">
            <Text>{value}</Text>
            <Button size="small" onClick={() => handleOpenHistory(value)}>
              Lịch sử
            </Button>
          </Space>
        );
      },
    },
    {
      title: "Người nhập SĐT cũ",
      dataIndex: "OlddUserName",
    },
    {
      title: "Người nhập SĐT mới",
      dataIndex: "NewdUserName",
    },

    //lí do
    {
      title: "Lí do chuyển đổi",
      dataIndex: "RequestNotes",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Text>{value}</Text>
            {record.Status === EPropTransferStatus.Rejected && (
              <Text type="danger">Lý do từ chối: {record.ApproveNotes}</Text>
            )}
          </Space>
        );
      },
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
    {
      title: "Chức năng",
      dataIndex: "Action",
      render(value, record) {
        if (record.Status !== EPropTransferStatus.Pending) return null;

        return (
          <Space>
            <RejectModal id={record.Id ?? 0} onSuccess={handleMutate} />
            <Button
              type="primary"
              onClick={async () => {
                await handleApprove(record.Id ?? 0);
              }}
            >
              Đồng ý
            </Button>
          </Space>
        );
      },
    },
  ];
};

export default columns;
