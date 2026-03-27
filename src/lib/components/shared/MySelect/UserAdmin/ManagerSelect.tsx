import SelectBase from "../base/SelectBase";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

export const ManagerSelect = ({ value, mode, onChange }: SelectType) => {
  const { managers } = useAdminContext();

  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Quản lý bởi"
      allowClear
      options={managers.map((e) => ({
        label: e.Name,
        value: e.Id ?? 0,
      }))}
      onChange={onChange}
    />
  );
};
