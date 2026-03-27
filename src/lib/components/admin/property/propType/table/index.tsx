import { Checkbox, Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SquarePenIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import BadgeConfirm from "@/lib/components/shared/BadgeConfirm";
import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import { FormatNumber } from "@/lib/core/utils/myFormat";
import { IPropTypeResponse } from "@/lib/interfaces/Property/IPropType";
import propTypeApi from "@/services/api/property/propTypeApi";

const { Text } = Typography;
type Props = {
  data: IPropTypeResponse[];
  loading: boolean;
  handleRequestModal: (item: IPropTypeResponse) => void;
  handleMutate: () => void;
};

const PropTypeTable = ({
  data,
  loading,
  handleRequestModal,
  handleMutate,
}: Props) => {
  const { data: session } = useSession();

  const cols: ColumnsType<IPropTypeResponse> = [
    {
      title: "Mã",
      dataIndex: "Id",
      sorter: true,
      align: "center",
      render(value) {
        return (
          <Space direction="vertical">
            <Text strong>{value}</Text>
          </Space>
        );
      },
    },
    {
      title: "Tên loại",
      dataIndex: "Name",
    },
    {
      title: "Người tạo",
      dataIndex: "CreatedBy",
    },
    {
      title: "Tình trạng",
      dataIndex: "IsActive",
      render(value, record) {
        return (
          <BadgeConfirm
            value={value}
            onOkClick={async () => {
              await propTypeApi.toggleActive(record.Id);
              handleMutate();
            }}
          />
        );
      },
    },
    {
      title: "Số lượng mua bán",
      dataIndex: "PropSellCount",
      align: "right",
      render: (val) => FormatNumber(val),
    },
    {
      title: "Số lượng cho thuê",
      dataIndex: "PropRentCount",
      align: "right",
      render: (val) => FormatNumber(val),
    },
    {
      title: "Hiển thị website",
      dataIndex: "ShowWebsite",
      align: "center",
      render: (val, record) => (
        <Checkbox
          checked={val}
          onChange={async (e) => {
            await propTypeApi.update({
              ...record,
              ShowWebsite: e.target.checked,
            });
            mutate(propTypeApi.mutateKey);
          }}
        />
      ),
    },

    {
      key: "action",
      title: "Thao tác",
      align: "center",
      render: (value, record) => {
        return (
          <Space>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleRequestModal(record)}
            >
              <SquarePenIcon />
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <TableNoPaging
      loading={loading}
      data={data}
      cols={
        [1, 2].includes(session?.user?.RoleId ?? 0)
          ? cols
          : cols.filter((x) => x.key !== "action")
      }
    />
  );
};

export default PropTypeTable;
