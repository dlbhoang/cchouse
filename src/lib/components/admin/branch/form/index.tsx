import { Col, Form, FormInstance, Input, Row } from "antd";

import { PhoneNumber } from "@/lib/components/shared/MyFormItem";
import {
  DistrictSelect,
  ProvinceSelect,
  StreetSelect,
  WardSelect,
} from "@/lib/components/shared/MySelect";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { IBranchRequest } from "@/services/api/branch/IBranch";

type Props = {
  form: FormInstance<IBranchRequest>;
  model?: IBranchRequest;
  onSubmit: (data: IBranchRequest) => void;
};

const BranchForm = ({ form, model, onSubmit }: Props) => {
  const provinceVal = Form.useWatch("ProvinceId", form);
  const districtVal = Form.useWatch("DistrictId", form);

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

      <Row gutter={12} align="bottom">
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item
            label="Mã chi nhánh"
            name="Code"
            rules={[{ required: true }]}
          >
            <Input disabled={model !== undefined} />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item
            label="Tên chi nhánh"
            name="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item
            label="Tỉnh / Thành"
            name="ProvinceId"
            rules={[{ required: true }]}
            initialValue="1"
          >
            <ProvinceSelect />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item
            label="Quận / Huyện"
            name="DistrictId"
            rules={[{ required: true }]}
          >
            <DistrictSelect parentVal={provinceVal} />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item
            label="Phường / Xã"
            name="WardId"
            rules={[{ required: true }]}
          >
            <WardSelect parentVal={districtVal?.toString()} />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item
            label="Số nhà"
            name="AddressNumber"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item label="Đường" name="StreetId" rules={[{ required: true }]}>
            <StreetSelect parentVal={districtVal?.toString()} />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item
            label="Người liên hệ"
            name="ContactName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={24} xs={24}>
          <PhoneNumber label="SĐT liên hệ" name="ContactPhone" required />
        </Col>
        <Col xl={12} lg={12} md={24} xs={24}>
          <Form.Item label="Email" name="ContactEmail">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default BranchForm;
