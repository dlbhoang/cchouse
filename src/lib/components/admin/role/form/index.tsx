import { Col, Form, FormInstance, Input, Row } from "antd";

import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { IRoleRequest } from "@/lib/interfaces/IRole";

type Props = {
  form: FormInstance;
  model?: IRoleRequest;
  onSubmit: (data: IRoleRequest) => void;
};

const RoleForm = ({ form, model, onSubmit }: Props) => {
  return (
    <Form
      name="basic"
      initialValues={model}
      onFinish={onSubmit}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      form={form}
      layout="vertical"
    >
      <Form.Item name="Id" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="Permission" hidden>
        <Input />
      </Form.Item>
      <Row gutter={12} align="bottom">
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item
            label="Mã chức vụ"
            name="Code"
            rules={[{ required: true, message: "Vui lòng nhập mã" }]}
          >
            <Input disabled={model !== undefined} />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item
            label="Tên chức vụ"
            name="Name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default RoleForm;
