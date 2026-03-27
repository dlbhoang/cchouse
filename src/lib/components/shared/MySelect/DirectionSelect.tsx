import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

import SelectBase from "./base/SelectBase";

export const DirectionSelect = ({
  value,
  mode,
  onChange,
  ...props
}: SelectType) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      mode={mode}
      placeholder="Chọn hướng"
      allowClear
      options={enumList.Direction.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};
