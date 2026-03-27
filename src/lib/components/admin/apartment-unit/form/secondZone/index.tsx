import { Col, Form, FormInstance, Input, InputNumber, Row } from "antd";
import Link from "next/link";
import { useState } from "react";
import FloorAutoComplete from "@/lib/components/shared/components/FloorAutoComplete";
import { FurnitureSelect, LawSelect } from "@/lib/components/shared/MySelect";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import apartmentUnitApi from "@/services/api/apartment/unit/apartmentUnitApi";
import {
  IApartmentUnitRequest,
  IApartmentUnitResponse,
} from "@/services/api/apartment/unit/IApartmentUnit";

type Props = {
  form: FormInstance<IApartmentUnitRequest>;
  model?: IApartmentUnitResponse;
};

const colRes = {
  xs: 24,
  lg: 8,
};

const SecondZone = ({ model, form }: Props) => {
  const [exist, setExist] = useState<IApartmentUnitResponse>(); //kiem tra trung

  const watchTransType = Form.useWatch("TransType", form);
  const watchCode = Form.useWatch("Code", form);
  const watchApartmentId = Form.useWatch("ApartmentId", form);
  const handleCodeBlur = async () => {
    if (watchApartmentId && watchCode) {
      const res = await apartmentUnitApi.checkExists(
        watchTransType,
        watchApartmentId,
        watchCode,
        model?.Id
      );
      if (res.data) {
        setExist(res.data);
      } else setExist(undefined);
    }
  };

  return (
    <Row gutter={12}>
      <Col {...colRes}>
        <Form.Item label={"Block"} name={"Block"} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col {...colRes}>
        <Form.Item
          label={"Mã căn"}
          name={"Code"}
          rules={[{ required: true }]}
          extra={
            exist && (
              <Link
                href={`${AppRoutes.apartmentUnit.url}/${exist.Id}`}
                target="_blank"
              >
                Căn hộ có thể bị trùng, click để xem thông tin
              </Link>
            )
          }
        >
          <Input onBlur={handleCodeBlur} />
        </Form.Item>
      </Col>
      <Col {...colRes}>
        <Form.Item
          label={"Tầng số"}
          name={"FloorNumber"}
          rules={[{ required: true }]}
        >
          <FloorAutoComplete placeholder="Tầng" />
        </Form.Item>
      </Col>
      <Col {...colRes}>
        <Form.Item label={"Đường nội khu"} name={"InternalRoad"}>
          <Input />
        </Form.Item>
      </Col>
      <Col {...colRes}>
        <Form.Item label={"Pháp lý"} name={"Law"} rules={[{ required: true }]}>
          <LawSelect onlyMain />
        </Form.Item>
      </Col>
      <Col {...colRes}>
        <Form.Item
          label="Diện tích sử dụng"
          name="Area"
          rules={[{ required: true }]}
        >
          <InputNumber
            suffix={
              <span>
                m<sup>2</sup>
              </span>
            }
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
      <Col {...colRes}>
        <Form.Item label="Số phòng" name="Bedroom">
          <InputNumber />
        </Form.Item>
      </Col>
      <Col {...colRes}>
        <Form.Item label="Số toilet" name="Bathroom">
          <InputNumber />
        </Form.Item>
      </Col>
      <Col {...colRes}>
        <Form.Item label="Nội thất" name="Furniture">
          <FurnitureSelect />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default SecondZone;
