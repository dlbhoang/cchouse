import SelectBase from "../base/SelectBase";
import { SelectType } from "@/lib/types/common";

export const TransTypeSelect = ({
  value,
  mode,
  onChange,
  ...props
}: SelectType) => {
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Loại giao dịch"
      allowClear
      options={["Mua bán", "Cho thuê"].map((e, index) => ({
        label: e,
        value: index + 1,
      }))}
      onChange={onChange}
      {...props}
    />
  );
};
