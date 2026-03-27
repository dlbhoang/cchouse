import { useAdminContext } from "@/lib/stored";

import { SelectProps } from "antd";
import SelectBase from "./base/SelectBase";

export const ApartmentUnitTypeSelect = ({ ...props }: SelectProps) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      placeholder="Loại hình căn hộ"
      options={enumList.ApartmentUnitType.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      {...props}
    />
  );
};
