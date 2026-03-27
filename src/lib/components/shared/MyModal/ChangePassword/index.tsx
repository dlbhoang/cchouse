import { Form, Input, Modal } from "antd";
import { useState } from "react";

import authApi from "@/services/auth/authApi";
import { IChangePassword } from "@/services/user-admin/models/change-password";

type Props = {
  isModalOpen: boolean;
  onClose: () => void;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
export const ChangePasswordModal = ({ isModalOpen, onClose }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values: IChangePassword) => {
    try {
      setLoading(true);
      await authApi.changePassword(values);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      maskClosable
      title="Thay đổi mật khẩu"
      open={isModalOpen}
      onCancel={onClose}
      confirmLoading={loading}
      okText="Lưu"
      onOk={() => form.submit()}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="changePassword"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="oldPassword"
          label="Mật khẩu hiện tại"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            {
              required: true,
            },
            {
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              message: "Tối thiểu 8 kí tự gồm chữ, số và 1 kí tự đặc biệt",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Nhập lại mật khẩu mới"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Thông tin không khớp với "Mật khẩu mới"')
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};
