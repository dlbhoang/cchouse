import { Col, Form, FormInstance, Row } from "antd";

import { TransStatusConfirm } from "@/lib/components/shared/MyConfirm";
import {
  DirectionSelect,
  TransStatusSelect,
} from "@/lib/components/shared/MySelect";
import { ApartmentUnitTypeSelect } from "@/lib/components/shared/MySelect/apartment-unit-type";
import {
  IApartmentUnitRequest,
  IApartmentUnitResponse,
} from "@/services/api/apartment/unit/IApartmentUnit";

type Props = {
  form: FormInstance<IApartmentUnitRequest>;
  model?: IApartmentUnitResponse;
};

const FirstZone = ({ model, form }: Props) => {
  const transTypeWatch = Form.useWatch("TransType", form);

  return (
    <Row gutter={12}>
      <Col lg={8} xl={8} xs={12}>
        <Form.Item
          label="Trạng thái giao dịch"
          name="Status"
          rules={[{ required: true }]}
        >
          {model?.Id ? (
            <TransStatusConfirm
              propId={model.Id}
              transType={Number(model.TransType)}
              transStatus={model.Status}
              handleOkClick={(status, reason) => {
                form.setFieldValue("Status", status);
                if (reason && reason !== "") form.setFieldValue("Note", reason);
              }}
            />
          ) : (
            <TransStatusSelect
              transType={Number(transTypeWatch)}
              disabled={!model?.Id}
            />
          )}
        </Form.Item>
      </Col>
      <Col lg={8} xl={8} xs={24}>
        <Form.Item
          label={"Loại hình căn hộ"}
          name={"ApartmentUnitType"}
          rules={[{ required: true }]}
        >
          <ApartmentUnitTypeSelect />
        </Form.Item>
      </Col>

      <Col lg={8} xl={8} xs={24}>
        <Form.Item label={"Hướng cửa"} name={"Direction"}>
          <DirectionSelect />
        </Form.Item>
      </Col>
      <Col lg={8} xl={8} xs={24}>
        <Form.Item label={"Hướng ban công"} name={"BalconyDirection"}>
          <DirectionSelect />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default FirstZone;
