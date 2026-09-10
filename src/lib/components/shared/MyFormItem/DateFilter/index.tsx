// DateFilter.tsx
import { Form, FormInstance } from "antd";
import { DateRangeFilter } from "./DateRangeFilter";

type DateFilterProps = {
  form: FormInstance;
};

export const DateFilter = ({ form }: DateFilterProps) => {
  const fromDate: string | undefined = Form.useWatch("fromDate", form);
  const toDate: string | undefined = Form.useWatch("toDate", form);

  return (
    <DateRangeFilter
      fromDate={fromDate}
      toDate={toDate}
      onChange={({ fromDate, toDate }) => {
        form.setFieldsValue({ fromDate, toDate });
      }}
    />
  );
};