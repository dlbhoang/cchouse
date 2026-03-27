import { Button, Popover } from "antd";
import { PhoneIcon } from "lucide-react";
import Link from "next/link";

const BtnPhone = ({
  phone,
  customerType = "Tiêu dùng",
}: {
  phone: string;
  customerType?: string;
}) => {
  let color;
  if (customerType === "Tiêu dùng") color = "grey";
  if (customerType === "Đấu giá") color = "orange";
  if (customerType === "Đại diện") color = "green";
  return (
    <Popover
      content={<Link href={`tel:${phone}`}>{phone}</Link>}
      trigger="hover"
      zIndex={1500}
    >
      <Button
        type="link"
        danger={customerType === "Môi giới"}
        icon={<PhoneIcon className="size-4" />}
        style={{
          color,
        }}
      />
    </Popover>
  );
};

export default BtnPhone;
