import { Button, ButtonProps, Tooltip } from "antd";
import { Phone } from "lucide-react";

type Props = {
  typeName:
    | "Đầu tư"
    | "Môi giới"
    | "Tiêu dùng"
    | "Đại diện"
    | "Đấu giá"
    | "Ngân hàng"
    | "Nhân viên công ty"
    | string;
};

const customerTypeColors: Record<string, string> = {
  "Tiêu dùng": "#8C8C8C",
  "Môi giới": "#E53935",
  "Đầu tư": "#1677FF",
  "Đại diện": "#22A447",
  "Đấu giá": "#F5B301",
  "Ngân hàng": "#F5B301",
};

const CustomerPhoneButton = ({
  typeName,
  ...props
}: Props & ButtonProps) => {
  if (typeName === "Tìm chủ")
    return (
      <Tooltip title="Tìm chủ" placement="top">
        <Button type="link" danger aria-label="Tìm chủ" {...props}>
          {typeName}
        </Button>
      </Tooltip>
    );

  const color = customerTypeColors[typeName] ?? "#8C8C8C";
  return (
    <Tooltip title={typeName || "Chưa phân loại khách hàng"} placement="top">
      <Button
        type="link"
        aria-label={`Số điện thoại khách hàng, nhóm ${typeName || "chưa phân loại"}`}
        icon={<Phone size={16} strokeWidth={2} style={{ color }} />}
        style={{ color }}
        {...props}
      />
    </Tooltip>
  );
};

export default CustomerPhoneButton;
