import { DatePicker, TimeRangePickerProps } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { appConst } from "@/lib/core/configs/appConst";
const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "7 ngày trước", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "14 ngày trước", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "30 ngày trước", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "7 ngày", value: [dayjs().add(7, "d"), dayjs()] },
  { label: "14 ngày", value: [dayjs().add(14, "d"), dayjs()] },
  { label: "30 ngày", value: [dayjs().add(30, "d"), dayjs()] },
];

const DateRange = (props: RangePickerProps) => {
  return (
    <RangePicker
      allowEmpty={[true, true]}
      presets={rangePresets}
      format={appConst.DATE_FORMAT}
      {...props}
    />
  );
};

export default DateRange;
