import { SelectType } from "@/lib/types/common";

import SelectBase from "./base/SelectBase";

export const LocationSelect = ({
  value,
  mode,
  onChange,
  ...props
}: SelectType) => {
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Vị trí"
      allowClear
      options={["Mặt tiền", "Hẻm"].map((e, index) => ({
        label: e,
        value: index + 1,
      }))}
      onChange={onChange}
      {...props}
    />
  );
};
