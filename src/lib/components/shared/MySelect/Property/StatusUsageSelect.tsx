import SelectBase from "../base/SelectBase";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

export const StatusUsageSelect = ({
  mode,
  value,
  onChange,
  ...props
}: SelectType) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      mode={mode}
      placeholder="Chọn"
      allowClear
      options={enumList.StatusUsage.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};
