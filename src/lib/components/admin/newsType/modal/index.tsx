import { Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import type { INewsType } from "@/services/api/news/INews";
import newsTypeApi from "@/services/api/news/newsTypeApi";
import FloatLabel from "./FloatLabel"; // đường dẫn tùy cấu trúc project của bạn

type Props = {
  isModalOpen: boolean;
  model?: INewsType;
  handleCancel: () => void;
};

const AddEditModal = ({ isModalOpen, model, handleCancel }: Props) => {
  const [form] = Form.useForm<INewsType>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  // theo dõi giá trị Name để biết label có nên nổi lên hay không
  const nameValue = Form.useWatch("Name", form);

  const onFinish = async (item: INewsType) => {
    try {
      setConfirmLoading(true);
      if (item.Id) {
        await newsTypeApi.update(item);
      } else {
        await newsTypeApi.add(item);
      }
      handleCancel();
    } finally {
      mutate(newsTypeApi.mutateKey);
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({ ...model });
    }
  }, [form, model]);

  return (
    <Modal
      open={isModalOpen}
      title="Thêm mới chủ đề"
      width={400}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      onOk={() => form.submit()}
      okText="Thêm"
      cancelText="Hủy bỏ"
      okButtonProps={{
        style: { backgroundColor: "#1677ff", borderColor: "#1677ff" },
      }}
    >
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={globalHandleFailed(form)}
        autoComplete="off"
        form={form}
        layout="vertical"
        disabled={confirmLoading}
      >
        <Form.Item name="Id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={12} align="bottom">
          <Col span={24}>
            <Form.Item name="Name" rules={[{ required: true }]} noStyle>
              <FloatLabel label="Chủ đề" value={nameValue}>
                <Input placeholder="Nhập" />
              </FloatLabel>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddEditModal;