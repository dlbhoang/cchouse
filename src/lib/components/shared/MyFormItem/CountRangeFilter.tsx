import { Form, FormInstance, Input, Typography } from "antd";

const { Text } = Typography;

type Props = {
  form: FormInstance;
  label: string;
  nameFrm: string;
  nameTo: string;
  /** giá trị pill cuối cùng, hiển thị dạng "n+" */
  max?: number;
};

export const CountRangeFilter = ({
  form,
  label,
  nameFrm,
  nameTo,
  max = 5,
}: Props) => {
  const from = Form.useWatch(nameFrm, form);
  const to = Form.useWatch(nameTo, form);

  const handleClick = (value: number) => {
    const f = from == null ? undefined : Number(from);
    const t = to == null ? undefined : Number(to);

    if (f == null || t == null) {
      form.setFieldValue(nameFrm, value);
      form.setFieldValue(nameTo, value);
      return;
    }
    if (f === t && value === f) {
      form.setFieldValue(nameFrm, undefined);
      form.setFieldValue(nameTo, undefined);
      return;
    }
    if (value < f) {
      form.setFieldValue(nameFrm, value);
      return;
    }
    if (value > t) {
      form.setFieldValue(nameTo, value);
      return;
    }
    form.setFieldValue(nameFrm, value);
    form.setFieldValue(nameTo, value);
  };

  const isActive = (value: number) => {
    if (from == null || to == null) return false;
    return value >= Number(from) && value <= Number(to);
  };

  return (
    <div className="property-count-range">
      <Text className="property-count-range-label">{label}</Text>
      <div className="property-count-range-pills">
        {Array.from({ length: max }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            className={`property-count-pill${isActive(value) ? " active" : ""}`}
            onClick={() => handleClick(value)}
          >
            {value === max ? `${value}+` : value}
          </button>
        ))}
      </div>
      <Form.Item name={nameFrm} hidden>
        <Input />
      </Form.Item>
      <Form.Item name={nameTo} hidden>
        <Input />
      </Form.Item>
    </div>
  );
};