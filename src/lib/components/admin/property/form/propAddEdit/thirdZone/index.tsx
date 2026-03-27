import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Typography,
} from "antd";
import { AdvStructures } from "@/lib/components/shared/MyFormItem";
import { FloorSelect } from "@/lib/components/shared/MySelect";
import { ETransType } from "@/lib/core/enum";

// Types
interface Props {
  isFull: boolean;
  form: FormInstance;
}

interface AreaProps {
  hidden: boolean;
  isFull: boolean;
  form: FormInstance;
}

interface DimensionFieldProps {
  label: string;
  name: string | string[];
}

// Common configurations
const DIMENSION_SUFFIX = <Typography.Text type="secondary">m</Typography.Text>;
const AREA_SUFFIX = (
  <Typography.Text type="secondary">
    m<sup>2</sup>
  </Typography.Text>
);

// Reusable components
const DimensionField = ({ label, name }: DimensionFieldProps) => (
  <Col lg={12} xl={6} xs={12}>
    <Form.Item label={label} name={name}>
      <InputNumber style={{ width: "100%" }} suffix={DIMENSION_SUFFIX} />
    </Form.Item>
  </Col>
);

const AreaField = ({ label, name }: DimensionFieldProps) => (
  <Col lg={12} xl={6} xs={12}>
    <Form.Item label={<Typography.Text>{label}</Typography.Text>} name={name}>
      <InputNumber style={{ width: "100%" }} suffix={AREA_SUFFIX} />
    </Form.Item>
  </Col>
);

// Hidden fields configuration
const HIDDEN_FIELDS = [
  ["PropAddress", "WidthLegal"],
  ["PropAddress", "LengthLegal"],
  ["PropAddress", "BackSideLegal"],
  ["PropAddress", "AreaLegal"],
];

const Area = ({ hidden, isFull, form }: AreaProps) => {
  if (!isFull) {
    return (
      <Row gutter={12}>
        <DimensionField label="Chiều rộng (m)" name="Width" />
        <DimensionField label="Chiều dài (m)" name="Length" />
        <DimensionField label="Mặt hậu (m)" name="BackSide" />
        <AreaField label="Tổng DTTT (m²)" name="Area" />
        <Col lg={12} xl={6} xs={12}>
          <Form.Item label="Số lầu" name="Floors" rules={[{ required: true }]}>
            <FloorSelect />
          </Form.Item>
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={12}>
      <DimensionField label="Chiều rộng" name="Width" />
      <DimensionField label="Chiều dài" name="Length" />
      <DimensionField label="Mặt hậu" name="BackSide" />
      <AreaField label="Tổng DTTT" name="Area" />

      {hidden ? (
        HIDDEN_FIELDS.map((field) => (
          <Form.Item key={field.toString()} name={field} hidden>
            <Input />
          </Form.Item>
        ))
      ) : (
        <>
          <DimensionField
            label="Chiều rộng"
            name={["PropAddress", "WidthLegal"]}
          />
          <DimensionField
            label="Chiều dài"
            name={["PropAddress", "LengthLegal"]}
          />
          <DimensionField
            label="Mặt hậu"
            name={["PropAddress", "BackSideLegal"]}
          />
          <AreaField label="Tổng DTCN" name={["PropAddress", "AreaLegal"]} />
        </>
      )}

      <AreaField label="Tổng DT sàn" name="FloorArea" />

      <Col lg={16} xs={24} xl={12}>
        <Form.Item
          label="Kết cấu"
          name="AdvStructures"
          required
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (Number(getFieldValue("Floors")) >= 0) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Kết cấu không để trống!"));
              },
            }),
          ]}
        >
          <AdvStructures
            form={form}
            namePath={{
              BasementItem: "Basement",
              FloorsItem: "Floors",
              StructuresItem: "Structures",
            }}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

const ThirdZone = ({ form, isFull }: Props) => {
  const transTypeWatch = Form.useWatch("TransType", form);
  return (
    <Area
      hidden={Number(transTypeWatch) === ETransType.rent}
      isFull={isFull}
      form={form}
    />
  );
};

export default ThirdZone;
