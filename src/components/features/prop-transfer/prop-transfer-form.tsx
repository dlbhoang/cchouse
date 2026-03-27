import { Button, Form, Input } from "antd";
import { useState } from "react";
import type { IPropTransferRequest } from "@/services/property/models/prop-transfer";
import propTransferApi from "@/services/property/propTransferApi";
import { UserAdminSelect } from "../../../lib/components/shared/MySelect";

const PropTransferForm = ({
  propId,
  oldUserId,
  onSuccess,
}: {
  propId: number;
  oldUserId: number;
  onSuccess?: () => void;
}) => {
  const [form] = Form.useForm<IPropTransferRequest>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: IPropTransferRequest) => {
    try {
      setSubmitting(true);
      await propTransferApi.add(values);
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      disabled={submitting}
      initialValues={{ PropId: propId, OldUserId: oldUserId }}
    >
      <Form.Item name="PropId" label="Mã bất động sản">
        <Input disabled />
      </Form.Item>
      <Form.Item name="OldUserId" label="Người nhập cũ">
        <UserAdminSelect disabled />
      </Form.Item>
      <Form.Item name="NewdUserId" label="Người nhập mới">
        <UserAdminSelect />
      </Form.Item>
      <Form.Item name="RequestNotes" label="Lý do chuyển đổi">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Gửi yêu cầu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PropTransferForm;
