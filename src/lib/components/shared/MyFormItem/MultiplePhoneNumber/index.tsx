import { Form, Select } from 'antd';
import { Rule } from 'antd/es/form';
import { ReactNode } from 'react';

type Props = {
  label?: ReactNode;
  name: string | string[];
  required?: boolean | undefined;
};
const validatePhoneNumber = (
  rule: Rule,
  value: any[],
  showMessageError: (error?: string) => void
) => {
  // Phone number regex pattern
  const phoneNumberRegex = /^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b$/;

  if (Array.isArray(value)) {
    value.forEach((item) => {
      // Kiểm tra số điện thoại có khớp với regex không
      if (!phoneNumberRegex.test(item)) {
        showMessageError(`Số điện thoại ${item.toString()} không hợp lệ`);
      }
    });
  }

  showMessageError(); // Validation passed
};

export const MultiplePhoneNumber = ({ label, name, required }: Props) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          required,
          message: 'Số điện thoại không để trống!',
        },
        {
          // pattern: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
          // message,
          validator: validatePhoneNumber,
        },
      ]}
    >
      <Select mode="tags" maxTagCount="responsive" />
    </Form.Item>
  );
};
