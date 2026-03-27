import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

import SelectBase from "./base/SelectBase";

export const UsageLawSelect = ({ value, mode, onChange }: SelectType) => {
  const { enumList, loading } = useAdminContext();

  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Mục đích sử dụng"
      allowClear
      options={enumList.UsageLaw.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      loading={loading}
    />
  );
};
