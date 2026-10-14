// DateFilter.tsx
import { Form, FormInstance } from "antd";
import { DateRangeFilter } from "./DateRangeFilter";

type DateFilterProps = {
  form: FormInstance;
  placeholderText?: string;
};

export const DateFilter = ({ form, placeholderText }: DateFilterProps) => {
  const fromDate: string | undefined = Form.useWatch("fromDate", form);
  const toDate: string | undefined = Form.useWatch("toDate", form);

  return (
    <DateRangeFilter
      fromDate={fromDate}
      toDate={toDate}
      placeholderText={placeholderText}
      onChange={({ fromDate, toDate }) => {
        form.setFieldsValue({ fromDate, toDate });
      }}
    />
  );
};
