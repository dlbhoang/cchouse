import { SelectType } from "@/lib/types/common";

import { useAdminContext } from "@/lib/stored";
import SelectBase from "./base/SelectBase";

export const MobileNetworkSelect = ({ value, mode, onChange }: SelectType) => {
  const { enumList } = useAdminContext();
  const data = enumList.MobileNetwork;
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Nhà mạng"
      allowClear
      options={data.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
    />
  );
};
