import { Col, Form, Input, InputNumber, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { FormatNumber } from "@/lib/core/utils/myFormat";
import {
  IFeedPricingRequest,
  IFeedPricingResponse,
} from "@/services/api/feed/IFeedPricing";
import feedPricingApi from "@/services/api/feedPricingApi";

const { TextArea } = Input;

type Props = {
  isModalOpen: boolean;
  arrDays: number[];
  model?: IFeedPricingResponse;
  handleCancel: () => void;
  handleMutate: () => void;
};

const AddUpdateFeedPricingModal = ({
  isModalOpen,
  arrDays,
  model,
  handleCancel,
  handleMutate,
}: Props) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async (item: IFeedPricingRequest) => {
    console.log("Success:", item);
    try {
      setConfirmLoading(true);
      if (item.Id > 0) {
        const result = await feedPricingApi.update(item);
        NotiBase("success", result.message ?? "Cập nhật thành công");
      } else {
        const result = await feedPricingApi.add(item);
        NotiBase("success", result.message ?? "Thêm thành công");
      }
      handleMutate();
    } finally {
      setConfirmLoading(false);
      handleCancel();
    }
  };

  useEffect(() => {
    if (model) form.setFieldsValue(model);
  }, [form, model]);

  return (
    <Modal
      title="Thông tin khác & Thao tác"
      maskClosable={false}
      open={isModalOpen}
      confirmLoading={confirmLoading}
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
        style={{ padding: 10 }}
      >
        <Form.Item name="Id" hidden>
          <Input />
        </Form.Item>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="Title"
              label="Loại tin"
              rules={[
                { required: true, message: "Vui lòng nhập tên loại tin" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="Content" label="Mô tả">
              <TextArea />
            </Form.Item>
          </Col>
          {arrDays.map((e, idx) => (
            <Col span={12}>
              <Form.Item
                key={e}
                name={["ArrTotalPrice", idx]}
                label={`Phí ${e} ngày`}
                rules={[
                  { required: true, message: "Vui lòng nhập phí ra tin" },
                ]}
              >
                <InputNumber
                  min={0}
                  formatter={FormatNumber}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

export default AddUpdateFeedPricingModal;