import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { PhoneNumber } from "@/lib/components/shared/MyFormItem/PhoneNumber";
import {
  MobileNetworkSelect,
  UserAdminSelect,
} from "@/lib/components/shared/MySelect";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { FormatNumber } from "@/lib/core/utils/myFormat";
import { ISimRequest, ISimResponse } from "@/lib/interfaces/ISim";
import simApi from "@/services/api/simApi";

const { TextArea } = Input;

type Props = {
  isModalOpen: boolean;
  model?: ISimResponse;
  handleCancel: () => void;
  handleMutate: () => void;
};

const SimRequestModal = ({
  isModalOpen,
  model,
  handleCancel,
  handleMutate,
}: Props) => {
  // const status = Object.entries(EUserAdminStatus);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async (item: ISimRequest) => {
    console.log("Success:", item);
    try {
      setConfirmLoading(true);
      if (model) {
        Object.assign(model, item);
        await simApi.update(model);
      } else {
        await simApi.add(item);
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
        ReceivedDate: dayjs(model.ReceivedDate),
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

        <Row gutter={12}>
          <Col lg={8} xl={8} xs={24}>
            <Form.Item
              label="Loại sim"
              name="IsPrepaid"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value>Trả trước</Radio>
                <Radio value={false}>Trả sau</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col lg={8} xl={8} xs={24}>
            <PhoneNumber
              label="Số điện thoại"
              name="PhoneNumber"
              message="SĐT không hợp lệ"
              required
            />
          </Col>
          <Col lg={8} xl={8} xs={24}>
            <Form.Item
              label="Nhà mạng"
              name="MobileNetwork"
              rules={[{ required: true }]}
            >
              <MobileNetworkSelect />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8} xl={8}>
            <Form.Item
              label="Cước phí (/tháng)"
              name="MoneySupport"
              rules={[{ required: true }]}
            >
              <InputNumber formatter={FormatNumber} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8} xl={8}>
            <Form.Item label="Nhân viên sử dụng" name="UserAdminId">
              <UserAdminSelect />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8} xl={8}>
            <Form.Item label="Ngày nhận" name="ReceivedDate">
              <DatePicker
                format={["DD/MM/YYYY", "DD/MM/YY"]}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
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

export default SimRequestModal;
