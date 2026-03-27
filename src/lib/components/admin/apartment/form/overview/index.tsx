import { Col, Form, FormInstance, Input, Row } from "antd";

import { PhoneNumber } from "@/lib/components/shared/MyFormItem";
import {
  DistrictSelect,
  LocationSelect,
  ProvinceSelect,
  StreetSelect,
  WardSelect,
} from "@/lib/components/shared/MySelect";
import { IApartmentRequest } from "@/services/api/apartment/IApartment";

const colResponsive = {
  xs: 12,
  xl: 8,
};

const ApartmentOverviewForm = ({
  form,
}: {
  form: FormInstance<IApartmentRequest>;
}) => {
  const provinceWatch = Form.useWatch("ProvinceId", form);
  const districtWatch = Form.useWatch("DistrictId", form);

  return (
    <Row gutter={12}>
      <Col {...colResponsive}>
        <Form.Item label="Vị trí" name="Location" rules={[{ required: true }]}>
          <LocationSelect />
        </Form.Item>
      </Col>
      <Col {...colResponsive}>
        <Form.Item
          label="Tỉnh / Thành"
          name="ProvinceId"
          rules={[{ required: true }]}
        >
          <ProvinceSelect
            onChange={(val) => {
              form.resetFields(["DistrictId", "WardId", "StreetId"]);
            }}
          />
        </Form.Item>
      </Col>
      <Col {...colResponsive}>
        <Form.Item
          label="Quận / Huyện"
          name="DistrictId"
          rules={[{ required: true }]}
        >
          <DistrictSelect
            parentVal={provinceWatch}
            onChange={(val) => {
              form.resetFields(["WardId", "StreetId"]);
            }}
          />
        </Form.Item>
      </Col>
      <Col {...colResponsive}>
        <Form.Item
          label="Phường / Xã"
          name="WardId"
          rules={[{ required: true }]}
        >
          <WardSelect parentVal={districtWatch?.toString()} />
        </Form.Item>
      </Col>
      <Col {...colResponsive}>
        <Form.Item
          label="Số nhà"
          name="AddressNumber"
          // rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col {...colResponsive}>
        <Form.Item
          label="Đường"
          name="StreetId"
          // rules={[{ required: true }]}
        >
          <StreetSelect parentVal={districtWatch?.toString()} />
        </Form.Item>
      </Col>
      <Col lg={12} xs={24}>
        <Form.Item label="Tên chủ đầu tư" name="Investor">
          <Input />
        </Form.Item>
      </Col>
      <Col lg={12} xs={24}>
        <PhoneNumber
          label="Số diện thoại"
          name="InvestorPhone"
          message="Số điện thoại không hợp lệ!"
        />
      </Col>
      <Col xs={24}>
        <Form.Item
          label="Tên chung cư / căn hộ"
          name="Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          label="Mô tả dự án"
          name="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={8} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ApartmentOverviewForm;
