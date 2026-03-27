import { Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import type { INewsType } from "@/services/api/news/INews";
import newsTypeApi from "@/services/api/news/newsTypeApi";

type Props = {
  isModalOpen: boolean;
  model?: INewsType;
  handleCancel: () => void;
};

const AddEditModal = ({ isModalOpen, model, handleCancel }: Props) => {
  const [form] = Form.useForm<INewsType>();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async (item: INewsType) => {
    try {
      setConfirmLoading(true);
      console.log("Success:", item);
      if (item.Id) {
        await newsTypeApi.update(item);
      } else await newsTypeApi.add(item);
      // TODO: xử lý add/update
      handleCancel();
    } finally {
      mutate(newsTypeApi.mutateKey);
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
      });
    }
  }, [form, model]);

  return (
    <Modal
      open={isModalOpen}
      title={model?.Id ? "Chỉnh sửa" : "Thêm mới"}
      width={600}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Đóng"
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
            <Form.Item
              label="Tên loại"
              name="Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
