import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

import SelectBase from "./base/SelectBase";

export const BranchSelect = ({ value, mode, onChange }: SelectType) => {
  const { branches } = useAdminContext();

  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Chi nhánh"
      allowClear
      options={branches.map((e) => ({
        label: e.Name,
        value: e.Id ?? 0,
      }))}
      onChange={onChange}
    />
  );
};
