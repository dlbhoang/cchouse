import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

import SelectBase from "./base/SelectBase";

export const GenderSelect = ({
  mode,
  value,
  onChange,
  ...props
}: SelectType) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      {...props}
      mode={mode}
      placeholder="Chọn"
      allowClear
      options={enumList.Sex.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
    />
  );
};
