import { Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";

import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import {
  IPropTypeRequest,
  IPropTypeResponse,
} from "@/lib/interfaces/Property/IPropType";
import propTypeApi from "@/services/api/property/propTypeApi";

const { TextArea } = Input;

type Props = {
  isModalOpen: boolean;
  model?: IPropTypeResponse;
  handleCancel: () => void;
  handleMutate: () => void;
};

const PropTypeRequestModal = ({
  isModalOpen,
  model,
  handleCancel,
  handleMutate,
}: Props) => {
  // const status = Object.entries(EUserAdminStatus);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async (item: IPropTypeRequest) => {
    console.log("Success:", item);
    try {
      setConfirmLoading(true);
      if (model) {
        Object.assign(model, item);
        await propTypeApi.update({
          ...model,
        });
      } else {
        await propTypeApi.add(item);
      }
    } finally {
      handleMutate();
      setConfirmLoading(false);
      handleCancel();
    }
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
        TransTypes: model?.TransTypes
          ? model?.TransTypes?.toString().split(",")
          : [],
      });
    }
  }, [form, model]);

  return (
    <Modal
      title={(model?.Id ?? 0) > 0 ? "Chỉnh sửa" : "Thêm mới"}
      maskClosable={false}
      open={isModalOpen}
      confirmLoading={confirmLoading}
      width={800}
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
        style={{ padding: 10 }}
      >
        <Form.Item name="Id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="ShowWebsite" hidden>
          <Input />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24}>
            <Form.Item
              label="Tên loại"
              name="Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          {/* <Col xs={12}>
            <Form.Item
              label="Loại giao dịch"
              name="TransTypes"
              rules={[{ required: true }]}
            >
              <TransTypeSelect mode="multiple" />
            </Form.Item>
          </Col> */}

          <Col span={24}>
            <Form.Item label="Ghi chú" name="Note">
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PropTypeRequestModal;
