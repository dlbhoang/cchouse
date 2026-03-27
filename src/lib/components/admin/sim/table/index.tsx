import { Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import TableBase from "@/lib/components/shared/TableBase";
import { appConst } from "@/lib/core/configs/appConst";
import { FormatNumber } from "@/lib/core/utils/myFormat";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { ISimResponse } from "@/lib/interfaces/ISim";
import simApi from "@/services/api/simApi";

const { Text } = Typography;
type Props = {
  data: ISimResponse[];
  total: number;
  loading: boolean;
  searchOptions: ISearchOptions;

  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
  // onSelect: (val: IUserAdminV1Response) => void;
  handleRequestModal: (item: ISimResponse) => void;
  handleMutate: () => void;
};

const SimTable = ({
  data,
  total,
  loading,
  searchOptions,
  onPageIndexChange,
  handleRequestModal,
  handleMutate,
}: Props) => {
  const { data: session } = useSession();

  const cols: ColumnsType<ISimResponse> = [
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
      title: "Số điện thoại",
      dataIndex: "PhoneNumber",
    },
    {
      title: "Nhân viên sử dụng",
      dataIndex: "UserAdminName",
      render(value, record) {
        return (
          <Space direction="vertical">
            {value ?? "Công ty"}
            <Typography.Text>{record.UserAdminPhone}</Typography.Text>
          </Space>
        );
      },
    },
    {
      title: "Nhà mạng",
      dataIndex: "MobileNetworkName",
    },
    {
      title: "Loại sim",
      dataIndex: "IsPrepaid",
      render(value) {
        return value ? "Trả trước" : "Trả sau";
      },
    },
    {
      title: "Cước phí (/tháng)",
      dataIndex: "MoneySupport",
      render: (value) => `${FormatNumber(value)} VNĐ`,
    },
    {
      title: "Ngày nhận",
      dataIndex: "ReceivedDate",
      render: (value) =>
        `${value ? dayjs(value).format(appConst.DATE_FORMAT) : ""}`,
    },
    {
      key: "action",
      title: "Thao tác",
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
            <BtnConfirm
              type="icon"
              btnShape="circle"
              icon={<Trash2Icon className="size-4" />}
              danger
              onOkClick={async () => {
                await simApi.delete(record.Id);
                handleMutate();
              }}
            />
          </Space>
        );
      },
    },
    // {
    //     title: 'Người tạo/Ngày tạo',
    //     dataIndex: 'createdBy',
    //     render: (value, record, index) => {
    //         return (<>
    //             <Space direction="vertical">
    //                 {value}
    //                 <Text type="secondary">{moment(record.createdDate).format('DD-MM-YYYY')}</Text>
    //             </Space>
    //         </>)
    //     }
    // },
  ];

  return (
    <TableBase
      loading={loading}
      total={total}
      searchOptions={searchOptions}
      data={data}
      cols={
        [1, 2].includes(session?.user?.RoleId ?? 0)
          ? cols
          : cols.filter((x) => x.key !== "action")
      }
      // defaultSelectRow={[1]}
      // onSelect={onSelect}
      onPageIndexChange={onPageIndexChange}
    />
  );
};

export default SimTable;
