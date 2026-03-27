import { Button, Form, Input, Space } from "antd";
import { NamePath } from "antd/es/form/interface";
import { PlusIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  label: ReactNode;
  name?: NamePath;
  message?: string;
  required?: boolean | undefined;
  hasMore?: boolean;
  onShowMore?: () => void;
};
export const PhoneNumber = ({
  label,
  name,
  message,
  required,
  hasMore,
  onShowMore,
}: Props) => {
  
  const rule = [
    {
      required,
      pattern: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
      message: message ?? "Số điện thoại không hợp lệ",
    },
  ];

  return hasMore ? (
    <Form.Item label={label} required>
      <Space.Compact>
        <Form.Item name={name} noStyle rules={rule}>
          <Input maxLength={10} />
        </Form.Item>
        <Form.Item noStyle>
          <Button icon={<PlusIcon className="size-4" />} onClick={onShowMore} />
        </Form.Item>
      </Space.Compact>
    </Form.Item>
  ) : (
    <Form.Item label={label} name={name} rules={rule}>
      <Input maxLength={10} />
    </Form.Item>
  );
};
