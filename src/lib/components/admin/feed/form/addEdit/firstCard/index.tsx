import {
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Tag,
  Typography,
} from "antd";
import ApartmentAutoComplete from "@/lib/components/shared/components/apartment-autocomplete";
import FloorAutoComplete from "@/lib/components/shared/components/FloorAutoComplete";

import MyCard from "@/lib/components/shared/MyCard";
import { AdvAddress, AdvStructures } from "@/lib/components/shared/MyFormItem";
import {
  DirectionSelect,
  LawSelect,
  LocationSelect,
  PropTypeSelect,
} from "@/lib/components/shared/MySelect";
import { ApartmentUnitTypeSelect } from "@/lib/components/shared/MySelect/apartment-unit-type";
import { IApartmentResponse } from "@/services/api/apartment/IApartment";
import { IFeedResponse } from "@/services/api/feed/IFeed";

type Props = {
  form: FormInstance<IFeedResponse>;
};

const ApartmentUnitItem = ({ form }: Props) => {
  const showAddressNumberWatch = Form.useWatch(
    ["Property", "ShowAddressNumber"],
    form
  );
  return (
    <MyCard title="1. Địa chỉ / Kết cấu">
      <Row gutter={12}>
        <Col xs={24} lg={12} xl={6}>
          <Form.Item
            label="Loại BĐS"
            name={["Property", "PropTypeId"]}
            rules={[{ required: true }]}
          >
            <PropTypeSelect />
          </Form.Item>
        </Col>

        <Col xs={24} lg={12} xl={6}>
          <Form.Item
            label={
              <div className="form-item-checkbox">
                <Typography.Text>Vị trí</Typography.Text>
                <Form.Item noStyle name={["Property", "IsCorner"]}>
                  <Checkbox>Căn góc</Checkbox>
                </Form.Item>
              </div>
            }
            name={["Property", "Location"]}
            rules={[{ required: true, message: "Vị trí không để trống!" }]}
          >
            <LocationSelect />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12} xl={12}>
          <Form.Item
            label="Tên chung cư"
            name={["Property", "ApartmentName"]}
            rules={[{ required: true }]}
          >
            <ApartmentAutoComplete
              onSelect={(value, option: any) => {
                const item = option.item as IApartmentResponse;

                form.setFieldsValue({
                  Property: {
                    Location: item.Location,
                    ProvinceId: item.ProvinceId,
                    DistrictId: item.DistrictId,
                    DistrictName: item.DistrictName,
                    WardId: item.WardId,
                    WardName: item.WardName,
                    StreetId: item.StreetId,
                    StreetName: item.StreetName,
                    AddressNumber: item.AddressNumber,
                  },
                });
                console.log(option.item);
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={16} xl={12}>
          <Form.Item
            label={
              <div className="form-item-checkbox">
                Địa chỉ
                <Tag>
                  {showAddressNumberWatch
                    ? "Cho phép hiện số nhà"
                    : "Không hiển thị số nhà"}
                </Tag>
              </div>
            }
            name="CustomAddress"
            required
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue(["Property", "DistrictId"])) {
                    return Promise.reject(new Error("Địa chỉ không để trống!"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <AdvAddress form={form} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Form.Item
            label="Loại hình"
            name={["Property", "ApartmentUnitType"]}
            rules={[{ required: true }]}
          >
            <ApartmentUnitTypeSelect />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Form.Item
            label="Mã căn hộ"
            name={["Property", "Code"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} lg={12} xl={6}>
          <Form.Item label="Tháp / Block" name={["Property", "Block"]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8} xl={6}>
          <Form.Item
            label="Pháp lý Nhà, Đất"
            name={["Property", "Laws"]}
            rules={[{ required: true }]}
          >
            <LawSelect onlyMain />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8} xl={6}>
          <Form.Item label="Hướng cửa" name={["Property", "Direction"]}>
            <DirectionSelect />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8} xl={6}>
          <Form.Item
            label="Hướng ban công"
            name={["Property", "BalconyDirection"]}
          >
            <DirectionSelect />
          </Form.Item>
        </Col>

        <Col xs={24} lg={8} xl={6}>
          <Form.Item
            label="Tầng số"
            name={["Property", "FloorNumber"]}
            required
            rules={[{ required: true }]}
          >
            <FloorAutoComplete placeholder="Tầng" />
          </Form.Item>
        </Col>
      </Row>
    </MyCard>
  );
};

const FirstCard = ({ form }: Props) => {
  const showAddressNumberWatch = Form.useWatch(
    ["Property", "ShowAddressNumber"],
    form
  );

  const propTypeWatch: number = Form.useWatch(["Property", "PropTypeId"]);

  if (propTypeWatch === 3) return <ApartmentUnitItem form={form} />;

  return (
    <MyCard title="1. Địa chỉ / Kết cấu">
      <Row gutter={12}>
        <Col xs={24} lg={12} xl={6}>
          <Form.Item
            label="Loại BĐS"
            name={["Property", "PropTypeId"]}
            rules={[{ required: true }]}
          >
            <PropTypeSelect />
          </Form.Item>
        </Col>

        <Col xs={24} lg={12} xl={6}>
          <Form.Item
            label={
              <div className="form-item-checkbox">
                <Typography.Text>Vị trí</Typography.Text>
                <Form.Item noStyle name={["Property", "IsCorner"]}>
                  <Checkbox>Căn góc</Checkbox>
                </Form.Item>
              </div>
            }
            name={["Property", "Location"]}
            rules={[{ required: true, message: "Vị trí không để trống!" }]}
          >
            <LocationSelect />
          </Form.Item>
        </Col>

        <Col xs={24} lg={16} xl={12}>
          <Form.Item
            label={
              <div className="form-item-checkbox">
                Địa chỉ
                <Tag>
                  {showAddressNumberWatch
                    ? "Cho phép hiện số nhà"
                    : "Không hiển thị số nhà"}
                </Tag>
              </div>
            }
            name="CustomAddress"
            required
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue(["Property", "DistrictId"])) {
                    return Promise.reject(new Error("Địa chỉ không để trống!"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <AdvAddress form={form} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8} xl={6}>
          <Form.Item label="Hướng" name={["Property", "Direction"]}>
            <DirectionSelect />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8} xl={6}>
          <Form.Item
            label="Pháp lý Nhà, Đất"
            name={["Property", "Laws"]}
            rules={[{ required: true }]}
          >
            <LawSelect onlyMain />
          </Form.Item>
        </Col>

        <Col lg={16} xs={24} xl={12}>
          <Form.Item
            label="Kết cấu"
            name="AdvStructures"
            required
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (Number(getFieldValue(["Property", "Floors"])) >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Kết cấu không để trống!"));
                },
              }),
            ]}
          >
            <AdvStructures form={form} />
          </Form.Item>
        </Col>
      </Row>
    </MyCard>
  );
};

export default FirstCard;
