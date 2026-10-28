import { Button, ButtonProps } from "antd";
import { PhoneFilled } from "@ant-design/icons";

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
      <Button type="link" danger title="Tìm chủ" aria-label="Tìm chủ" {...props}>
        {typeName}
      </Button>
    );

  const color = customerTypeColors[typeName] ?? "#8C8C8C";
  return (
    <Button
      type="link"
      title={`Nhận diện khách hàng: ${typeName || "Chưa phân loại"}`}
      aria-label={`Số điện thoại khách hàng, nhóm ${typeName || "chưa phân loại"}`}
      icon={<PhoneFilled style={{ color }} />}
      style={{ color }}
      {...props}
    />
  );
};

export default CustomerPhoneButton;
