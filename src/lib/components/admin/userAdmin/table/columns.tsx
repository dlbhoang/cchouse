import { Avatar, Image, Space, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { CheckCircleIcon, EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { FormatDate } from "@/lib/core/utils/myFormat";
import { IUserAdminResponse } from "@/services/api/userAdmin/IUserAdmin";

const { Text, Paragraph } = Typography;

type Props = {
  districtLength: number;
  onEdit: (item: IUserAdminResponse) => void;
};

export const columns = ({
  districtLength,
  onEdit,
}: Props): ColumnsType<IUserAdminResponse> => [
  {
    title: "Mã",
    dataIndex: "Code",
    width: 100,
    sorter: true,
    align: "center",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${AppRoutes.userAdmin.url}/${record.Id}`}>
            <Text strong>{value}</Text>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Chi nhánh",
    dataIndex: "BranchName",
    width: 100,
    render(value, record) {
      return (
        <Link href={`${AppRoutes.userAdmin.url}/${record.Id}`}>
          <Text>{value}</Text>
        </Link>
      );
    },
  },
  {
    title: "Họ tên",
    dataIndex: "Name",
    render(value, record) {
      return (
        <Space>
          {record.Avatar && (
            <Avatar
              src={
                <Image
                  height="100%"
                  style={{ objectFit: "cover" }}
                  src={record.Avatar.toString()}
                />
              }
              size={{ xl: 38 }}
            />
          )}

          <Space direction="vertical">
            <Link href={`${AppRoutes.userAdmin.url}/${record.Id}`}>
              <Text>{value}</Text>
            </Link>
            {record.ShowWebsite && (
              <Tooltip title="Hiển thị trang chủ">
                <CheckCircleIcon className="size-4 text-green-500" />
              </Tooltip>
            )}
          </Space>
        </Space>
      );
    },
  },
  {
    title: "Loại giao dịch/Vị trí",
    dataIndex: ["UserAccess", "DisplayTransTypes"],
    render(value, record) {
      return (
        <Link href={`${AppRoutes.userAdmin.url}/${record.Id}`}>
          <Space direction="vertical">
            <Typography.Text>
              Loại giao dịch: {value?.join(", ")}
            </Typography.Text>
            <Typography.Text>
              Vị trí: {record.UserAccess?.DisplayLocations?.join(", ")}
            </Typography.Text>
          </Space>
        </Link>
      );
    },
  },
  {
    title: "Thông tin bán",
    dataIndex: ["UserAccess", "DisplayDistricts"],
    width: 200,
    render: (val, record) => (
      <Link href={`${AppRoutes.userAdmin.url}/${record.Id}`}>
        <Space direction="vertical">
          <Text>{`Giá: ${record.UserAccess?.PriceFrm} - ${record.UserAccess?.PriceTo} (tỷ)`}</Text>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: "xem thêm" }}
          >
            Quận: {val?.length === districtLength ? "Tất cả" : val?.join(", ")}
          </Paragraph>
        </Space>
      </Link>
    ),
  },
  {
    title: "Thông tin thuê",
    dataIndex: ["UserAccess", "DisplayDistrictsRent"],
    width: 200,
    render: (val, record) => (
      <Link href={`${AppRoutes.userAdmin.url}/${record.Id}`}>
        <Space direction="vertical">
          <Text>{`Giá: ${record.UserAccess?.PriceRentFrm} - ${record.UserAccess?.PriceRentTo} (triệu)`}</Text>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: "xem thêm" }}
          >
            Quận: {val?.length === districtLength ? "Tất cả" : val?.join(", ")}
          </Paragraph>
        </Space>
      </Link>
    ),
  },

  {
    title: "Ngày sinh",
    dataIndex: "DateOfBirth",
    width: 100,
    render: (value, record) => (
      <Space direction="vertical">
        <Text>
          {record.Sex === 1 ? "Nam" : record.Sex === 2 ? "Nữ" : "Khác"}
        </Text>
        <Text>{FormatDate(value)}</Text>
      </Space>
    ),
  },
  {
    title: "Chức vụ & Quản lý",
    dataIndex: "RoleName",
    render(value, record) {
      return (
        <Link href={`${AppRoutes.userAdmin.url}/${record.Id}`}>
          <Space direction="vertical">
            <Typography.Text>{value}</Typography.Text>
            <Typography.Text>
              Hoa hồng:{" "}
              {record.Commission ? `${record.Commission}%` : "Không có"}
            </Typography.Text>
            <Typography.Text>Quản lý: {record.ManagerName}</Typography.Text>
          </Space>
        </Link>
      );
    },
  },

  {
    title: "Thao tác",
    dataIndex: "Id",
    render: (val, record) => {
      if (record.Status === 3)
        return (
          <Link href={`${AppRoutes.userAdmin.url}/edit/${val}`}>Kích hoạt</Link>
        );
      return (
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => {
            onEdit(record);
          }}
        >
          <EllipsisVerticalIcon />
        </Button>
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
