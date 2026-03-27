import SelectBase from "../base/SelectBase";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

export const ProvinceSelect = ({ value, onChange, ...props }: SelectType) => {
  const { provinces } = useAdminContext();
  return (
    <SelectBase
      placeholder="Tỉnh / Thành"
      options={provinces.map((e) => ({
        label: e.Name,
        value: e.Id,
      }))}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};
