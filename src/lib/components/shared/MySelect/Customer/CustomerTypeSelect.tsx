import SelectBase from "../base/SelectBase";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

export const CustomerTypeSelect = ({
  mode,
  value,
  onChange,
  placeholder = "Nhận diện khách hàng",
}: SelectType) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      mode={mode}
      placeholder={placeholder}
      allowClear
      options={enumList.CustomerType.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
    />
  );
};
