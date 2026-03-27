import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";
import SelectBase from "../base/SelectBase";

export const UserAdminStatusSelect = ({
  value,
  mode,
  onChange,
}: SelectType) => {
  const { enumList } = useAdminContext();
  const data = enumList.UserStatus;
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Chọn"
      allowClear
      options={data.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
    />
  );
};
