import { DatePicker, Form, FormInstance, Input } from "antd";
import type { TimeRangePickerProps } from "antd";
import dayjs from "dayjs";

import { appConst } from "@/lib/core/configs/appConst";

const { RangePicker } = DatePicker;
type Props = {
  form: FormInstance;
  placeholder?: [string, string];
  onValueChange?: () => void;
};

const hiddenFields = ["fromDate", "toDate"];

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Hôm nay", value: [dayjs(), dayjs()] },
  { label: "3 ngày trước", value: [dayjs().add(-3, "d"), dayjs()] },
  { label: "7 ngày trước", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "30 ngày trước", value: [dayjs().add(-30, "d"), dayjs()] },
];

export const DateFilter = ({
  form,
  placeholder = ["Từ ngày", "Đến ngày"],
  onValueChange,
}: Props) => {
  const fromDateWatch = Form.useWatch("fromDate", form);
  const toDateWatch = Form.useWatch("toDate", form);

  return (
    <>
      {hiddenFields.map((e) => (
        <Form.Item key={e} name={e} hidden>
          <Input />
        </Form.Item>
      ))}
      <RangePicker
        value={[
          fromDateWatch && dayjs(fromDateWatch),
          toDateWatch && dayjs(toDateWatch),
        ]}
        onChange={(values) => {
          form.setFieldValue("fromDate", values?.[0]?.format("YYYY-MM-DD"));
          form.setFieldValue("toDate", values?.[1]?.format("YYYY-MM-DD"));
          onValueChange?.();
        }}
        presets={rangePresets}
        allowEmpty={[true, true]}
        placeholder={placeholder}
        format={appConst.DATE_FORMAT}
        style={{ width: "100%" }}
      />
    </>
  );
};
