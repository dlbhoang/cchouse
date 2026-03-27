import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { UserAdminStatusSelect } from "@/lib/components/shared/MySelect";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import {
  IUserAdminQU,
  IUserAdminResponse,
} from "@/services/api/userAdmin/IUserAdmin";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";
import authApi from "@/services/auth/authApi";

const { TextArea } = Input;
type Props = {
  isModalOpen: boolean;
  model: IUserAdminResponse;
  handleCancel: () => void;
  handleMutate: () => void;
};

const QuickUpdateModal = ({
  isModalOpen,
  model,
  handleCancel,
  handleMutate,
}: Props) => {
  // const status = Object.entries(EUserAdminStatus);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async (item: IUserAdminQU) => {
    console.log("Success:", item);
    try {
      setConfirmLoading(true);
      if (model.Id) {
        await userAdminApi.quickUpdate(item);

        handleMutate();
      }
      handleCancel();
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    if (model?.Id) {
      form.setFieldsValue({
        ...model,
      });
    }
  }, [form, model]);

  return (
    <Modal
      title="Thông tin khác & Thao tác"
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
      footer={
        model && (
          <Space>
            <Button
              danger
              onClick={async () => {
                if (model.Id) await authApi.resetPassword(model.Id);
              }}
            >
              Cấp lại mật khẩu
            </Button>
            <Button onClick={handleCancel}>Đóng</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Lưu
            </Button>
          </Space>
        )
      }
    >
      <Form
        name={`basic_${model.Id}`}
        // initialValues={{ ...model }}
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
            <Typography.Text italic strong>
              *{model?.Code} - {model?.Name}
            </Typography.Text>
          </Col>
          <Col span={24}>
            <Form.Item name="Note" label="Ghi chú">
              <TextArea />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="Rank" label="Xếp hạng">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="ShowWebsite" label="Hiển thị trang chủ">
              <Radio.Group>
                <Radio value>Hiển thị</Radio>
                <Radio value={false}>Ẩn</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="Status" label="Trạng thái">
              <UserAdminStatusSelect />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="Evaluation"
              label="Đánh giá nhân sự"
              dependencies={["Status"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      getFieldValue("Status") === 2 &&
                      !value &&
                      value === ""
                    ) {
                      // nghỉ
                      return Promise.reject(
                        new Error("Vui lòng nhập đánh giá")
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default QuickUpdateModal;
