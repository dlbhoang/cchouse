import { Space, Tag, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SearchIcon, UserPlusIcon } from "lucide-react";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import PhoneBtn from "@/components/ui/button/phone-btn";
import NoteModal from "@/lib/components/shared/noteModal";
import { ETransType } from "@/lib/core/enum";
import { FormatDate } from "@/lib/core/utils/myFormat";
import customerApi from "@/services/api/customer/customerApi";
import { ICustomerResponse } from "@/services/api/customer/ICustomer";
import meApi from "@/services/api/meApi";

const { Paragraph, Text } = Typography;

type Props = {
  reqType: "BuyingRequirement" | "RentingRequirement";
  handlSelect: (id: number) => void;
  openRecommend: (item: ICustomerResponse, transType: ETransType) => void;
};

const columns = ({
  reqType,
  handlSelect,
  openRecommend,
}: Props): ColumnsType<ICustomerResponse> => [
  {
    title: "Mã",
    dataIndex: "Id",
    align: "center",
    render: (val, r) => (
      <Typography.Text onClick={() => handlSelect(val)}>{val}</Typography.Text>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: [reqType, "StatusName"],
    render: (value, record) => {
      let color = "success";
      let label = value;
      if ("Hết nhu cầu".includes(value)) {
        color = "default";
        label = reqType === "BuyingRequirement" ? "Đã mua" : "Đã thuê";
      }
      if (value === "Tạm ngưng") {
        color = "orange";
      }

      return <Tag color={color}>{label}</Tag>;
    },
  },
  {
    title: "Họ và tên",
    dataIndex: "Name",
    render: (val, r) => {
      // let color = 'blue';
      // if (r.TypeName === 'Tiêu dùng') color = 'grey';
      // if (r.TypeName === 'Đấu giá') color = 'orange';
      // if (r.TypeName === 'Đại diện') color = 'green';
      // if (r.TypeName === 'Môi giới') color = 'red';
      return (
        <Space direction="vertical">
          <Space>
            <Typography.Text onClick={() => handlSelect(r.Id)}>
              {val}
            </Typography.Text>
            {r.Phone.length > 0 &&
              r.Phone.map((phone) => <PhoneBtn key={phone} phone={phone} />)}
          </Space>
          {/* <Tag color={color}>{r.TypeName}</Tag> */}
        </Space>
      );
    },
  },
  {
    title: "Nhận diện KH",
    dataIndex: "TypeName",
    render: (val) => {
      let color = "blue";
      if (val === "Tiêu dùng") color = "grey";
      if (val === "Đấu giá") color = "orange";
      if (val === "Đại diện") color = "green";
      if (val === "Môi giới") color = "red";
      return (
        <Space direction="vertical">
          <Tag color={color}>{val}</Tag>
        </Space>
      );
    },
  },
  {
    title: "Nhân sự chăm sóc",
    dataIndex: "ViewableUserAdminNames",
    width: 200,
    render: (value: string[], r) => (
      <Space direction="vertical">
        {value.length === 0 ? (
          <Text>Không có</Text>
        ) : (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: "xem thêm" }}
          >
            {value.join(", ")}
          </Paragraph>
        )}
      </Space>
    ),
  },
  {
    title: "Loại BĐS & Quận",
    dataIndex: [reqType, "PropTypeName"],
    width: 300,
    render: (value, r) => (
      <Space direction="vertical">
        <Typography.Text onClick={() => handlSelect(r.Id)}>
          Loại: {value?.join(", ")}
        </Typography.Text>
        <Typography.Text onClick={() => handlSelect(r.Id)}>
          Quận: {r[reqType]?.DistrictName?.join(", ")}
        </Typography.Text>
        {r[reqType]?.Note && (
          <NoteModal
            value={r[reqType]?.Note ?? ""}
            handleChange={(note) => {
              customerApi.updateRequirement(r.Id, {
                Id: r[reqType]?.Id ?? 0,
                Note: note ?? "",
              });
              mutate(customerApi.mutateKey);
            }}
          />
        )}
      </Space>
    ),
  },
  {
    title: "Khoảng giá",
    dataIndex: [reqType, "PriceFrm"],
    render: (value, r) => (
      <Typography.Text onClick={() => handlSelect(r.Id)}>
        {`${value} - ${r[reqType]?.PriceTo} ${
          reqType === "BuyingRequirement" ? "tỷ" : "triệu"
        }`}
      </Typography.Text>
    ),
  },
  {
    title: "Diện tích",
    dataIndex: [reqType, "Area"],
    render: (value, record) => (
      <Space direction="vertical">
        {record[reqType]?.Width && (
          <Typography.Text>
            Chiều rộng: {record[reqType]?.Width}m
          </Typography.Text>
        )}
        {record[reqType]?.Length && (
          <Typography.Text>
            Chiều dài: {record[reqType]?.Length}m
          </Typography.Text>
        )}
        {value && <Typography.Text>Diện tích: {value}m2</Typography.Text>}
      </Space>
    ),
  },
  {
    title: "Khác",
    dataIndex: [reqType, "LocationName"],
    render: (value, record) => (
      <Space direction="vertical" onClick={() => handlSelect(record.Id)}>
        <Typography.Text>{`Vị trí: ${value ?? "Tất cả"}`}</Typography.Text>
        <Typography.Text>
          {record[reqType]?.LocationFeatureName}
        </Typography.Text>
        <Typography.Text>
          {(record[reqType]?.DirectionName.length ?? 0) > 0
            ? `Hướng: ${record[reqType]?.DirectionName}`
            : "Hướng: Tất cả"}
        </Typography.Text>
      </Space>
    ),
  },

  {
    title: "Ngày tạo",
    dataIndex: "CreatedDate",
    render: (val, r) => {
      return (
        <Space direction="vertical">
          {val ? FormatDate(val) : undefined}
          <Typography.Text>{r.CreatedBy}</Typography.Text>
        </Space>
      );
    },
  },
  {
    title: "Chức năng",
    render: (value, r) => {
      return (
        <Space>
          <Tooltip title={r.IsSaved ? "Bỏ lưu" : "Lưu khách hàng"}>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={async () => {
                await meApi.toggleSaveCustomer(r.Id);
                mutate(meApi.mutateSaveCustomersKey);
                mutate(customerApi.mutateKey);
              }}
            >
              <UserPlusIcon
                className={
                  r.IsSaved ? "text-blue-500 fill-blue-500" : undefined
                }
              />
            </Button>
          </Tooltip>
          <Tooltip title="Gợi ý bất động sản phù hợp">
            <Button
              onClick={() => {
                if (reqType === "BuyingRequirement") {
                  openRecommend(r, ETransType.sell);
                } else {
                  openRecommend(r, ETransType.rent);
                }
              }}
              size="icon-sm"
              variant="ghost"
            >
              <SearchIcon />
            </Button>
          </Tooltip>
        </Space>
      );
    },
  },
];

export default columns;
