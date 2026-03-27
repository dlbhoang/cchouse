import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

import SelectBase from "./base/SelectBase";

export const RoleSelect = ({ value, mode, onChange }: SelectType) => {
  const { roles } = useAdminContext();
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Chức vụ"
      allowClear
      options={roles.map((e) => ({
        label: e.Name,
        value: e.Id,
      }))}
      onChange={onChange}
    />
  );
};
