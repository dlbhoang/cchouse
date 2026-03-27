import { Button, ButtonProps, Space, Tag } from "antd";
import { PhoneIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  typeName:
    | "Đầu tư"
    | "Môi giới"
    | "Tiêu dùng"
    | "Đại diện"
    | "Nhân viên công ty"
    | string;
  icon?: ReactNode;
};

const tagColorMap: Record<string, string | undefined> = {
  "Đầu tư": "blue",
  "Môi giới": "red",
  "Tiêu dùng": "grey",
  "Đại diện": "green",
  "Nhân viên công ty": "brown",
};

const CustomerPhoneButton = ({
  typeName,
  icon,
  ...props
}: Props & ButtonProps) => {
  const danger = typeName === "Môi giới";
  if (typeName === "Tìm chủ")
    return (
      <Button type="link" danger {...props}>
        {typeName}
      </Button>
    );
  if (["Đầu tư", "Môi giới"].includes(typeName))
    return (
      <Button
        type="link"
        danger={danger}
        icon={
          icon || (
            <PhoneIcon
              className="size-4"
              fill={tagColorMap[typeName] || "orange"}
            />
          )
        }
        {...props}
      />
    );

  return (
    <Space direction="vertical">
      <Button
        type="link"
        style={{ color: tagColorMap[typeName] || "orange" }}
        {...props}
        icon={
          icon || (
            <PhoneIcon
              className="size-4"
              fill={tagColorMap[typeName] || "orange"}
            />
          )
        }
      ></Button>
      {!tagColorMap[typeName] && <Tag>{typeName}</Tag>}
    </Space>
  );
};

export default CustomerPhoneButton;
