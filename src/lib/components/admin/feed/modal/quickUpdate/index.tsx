import { Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";

import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import feedApi from "@/services/api/feed/feedApi";
import { IFeedRequest, IFeedResponse } from "@/services/api/feed/IFeed";

const { TextArea } = Input;
type Props = {
  isModalOpen: boolean;
  model: IFeedResponse;
  handleCancel: () => void;
  handleMutate: () => void;
};

const FeedQU = ({ isModalOpen, model, handleCancel, handleMutate }: Props) => {
  // const status = Object.entries(EUserAdminStatus);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async (item: IFeedRequest) => {
    console.log("Success:", item);
    try {
      setConfirmLoading(true);
      if (model.Id) {
        await feedApi.changeStatus({ ...item, Status: 3 });
        handleMutate();
      }
      handleCancel();
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    if (model?.Id) {
      form.setFieldsValue(model);
    }
  }, [form, model]);

  return (
    <Modal
      title="Vui lòng nhập lý do"
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
        name={`basic_${model.Id}`}
        initialValues={{ ...model }}
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
        <Form.Item
          name="ReasonDeny"
          label="Lý do"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeedQU;
