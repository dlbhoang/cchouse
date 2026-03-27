import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

import SelectBase from "./base/SelectBase";

export const StructuresSelect = ({
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
      options={enumList.Structures.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
    />
  );
};
