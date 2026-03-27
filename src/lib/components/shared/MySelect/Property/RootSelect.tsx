import SelectBase from "../base/SelectBase";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

export const RootSelect = ({ mode, value, onChange }: SelectType) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      mode={mode}
      placeholder="Nguồn gốc BĐS"
      allowClear
      options={enumList.Root.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
    />
  );
};
