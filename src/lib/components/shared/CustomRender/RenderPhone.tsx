import { PhoneOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { useState } from "react";
import { appConst } from "@/lib/core/configs/appConst";

const { Text, Link } = Typography;

const EllipsisText = ({ text }: { text: string }) => {
  const [hide, setHide] = useState(true);

  const start = text.slice(0, text.length - 4).trim();
  const suffix = "****";
  return hide ? (
    <Text onClick={() => setHide(false)}>{start + suffix}</Text>
  ) : (
    <Link href={`tel:${text}`}>{text}</Link>
  );
};

const RenderPhone = ({
  phones,
  showIcon,
}: {
  phones?: string[];
  showIcon?: boolean;
}) => {
  return (
    <Space>
      {showIcon && <PhoneOutlined />}
      {phones && phones.length > 0 ? (
        phones.map((e) => <EllipsisText text={e} />)
      ) : (
        <Text>{appConst.TEXT_DEFAULT}</Text>
      )}
    </Space>
  );
};
export default RenderPhone;
