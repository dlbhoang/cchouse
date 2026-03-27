import SelectBase from "../base/SelectBase";
import { SelectType } from "@/lib/types/common";

export const WeekendSelect = ({ value, mode, onChange }: SelectType) => {
  console.log("WeekendSelect", value);

  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Chọn"
      allowClear
      options={["Chiều thứ 7", "Chủ nhật"].map((e, index) => ({
        label: e,
        value: index + 1,
      }))}
      onChange={onChange}
    />
  );
};
