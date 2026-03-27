/* eslint-disable no-nested-ternary */
import { Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import { appConst } from "@/lib/core/configs/appConst";
import branchApi from "@/services/api/branch/branchApi";
import { IBranchResponse } from "@/services/api/branch/IBranch";

const { Text } = Typography;

type Props = {
  onEdit: (item: IBranchResponse) => void;
};

const columns = ({ onEdit }: Props): ColumnsType<IBranchResponse> => {
  return [
    {
      title: "Mã",
      dataIndex: "Id",
      align: "center",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Text>{record.Code}</Text>
          </Space>
        );
      },
    },
    {
      title: "Tên chi nhánh",
      dataIndex: "Name",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Text>{value}</Text>
          </Space>
        );
      },
    },
    {
      title: "Số lượng nhân viên",
      dataIndex: "NumberOfUsers",
      align: "center",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Text>{value}</Text>
          </Space>
        );
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "StreetName",
      render(value, record) {
        return (
          <Space direction="vertical">
            {`${record?.AddressNumber ?? ""} ${record?.StreetName}, ${
              record?.WardName
            }, ${record?.DistrictName}, ${record?.ProvinceName}
            `}
          </Space>
        );
      },
    },
    {
      title: "Thông tin liên hệ",
      dataIndex: "ContactPhone",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Text>Họ tên: {record.ContactName}</Text>
            <Text>SĐT: {value}</Text>
            <Text>Email: {record.ContactEmail ?? appConst.TEXT_DEFAULT}</Text>
          </Space>
        );
      },
    },
    {
      key: "Action",
      title: "Thao tác",
      dataIndex: "CreatedDate",
      render(value, record) {
        return (
          <Space>
            <Button variant="ghost" size="sm" onClick={() => onEdit(record)}>
              <SquarePenIcon />
            </Button>
            <BtnConfirm
              onOkClick={async () => {
                await branchApi.delete(record.Id ?? 0);
                mutate(branchApi.mutateKey);
              }}
              type="icon"
              danger
              icon={<Trash2Icon className="size-4" />}
            />
          </Space>
        );
      },
    },
  ];
};

export default columns;
