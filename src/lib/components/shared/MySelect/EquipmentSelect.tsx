import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

import SelectBase from "./base/SelectBase";

export const EquipmentSelect = ({ value, onChange, ...props }: SelectType) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      placeholder="Trang thiết bị"
      options={enumList.Equipments.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};
