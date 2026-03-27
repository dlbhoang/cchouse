import { SelectType } from "@/lib/types/common";

import SelectBase from "./base/SelectBase";

const items = [
  "Nội thất cơ bản",
  "Nội thất cao cấp",
  "Nhà không nội thất",
  "Nhà bàn giao thô",
];

export const FurnitureSelect = ({
  value,
  mode,
  onChange,
  ...props
}: SelectType) => {
  return (
    <SelectBase
      mode={mode}
      placeholder="Nội thất"
      allowClear
      options={items.map((e) => ({ label: e, value: e }))}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};
