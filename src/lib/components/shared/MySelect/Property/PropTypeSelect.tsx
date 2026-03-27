import SelectBase from "../base/SelectBase";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

export const PropTypeSelect = ({
  mode,
  value,
  onChange,
  ...props
}: SelectType) => {
  const { propType } = useAdminContext();
  return (
    <SelectBase
      {...props}
      mode={mode}
      placeholder="Loại BĐS"
      allowClear
      options={propType.map((e) => ({
        label: e.Name,
        value: e.Id,
        disabled: !e.IsActive,
      }))}
      onChange={onChange}
      value={value}
    />
  );
};
