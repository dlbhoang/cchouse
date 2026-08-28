import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";
import SelectBase from "./base/SelectBase";

export const NewsStatusSelect = ({
  mode,
  value,
  onChange,
  placeholder = "Chọn",
}: SelectType) => {
  const { enumList, loading } = useAdminContext();
  return (
    <SelectBase
      mode={mode}
      placeholder={placeholder}
      allowClear
      options={(enumList.NewsStatus ?? []).map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
      loading={loading}
    />
  );
};
