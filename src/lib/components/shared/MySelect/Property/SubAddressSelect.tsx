import SelectBase from "../base/SelectBase";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

export const SubAddressSelect = ({ mode, value, onChange }: SelectType) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      mode={mode}
      placeholder="Chi tiết"
      allowClear
      options={enumList?.SubAddresses.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
    />
  );
};
