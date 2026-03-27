import SelectBase from "../base/SelectBase";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

export const LiteracySelect = ({ value, mode, onChange }: SelectType) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Trình độ học vấn"
      allowClear
      options={enumList.Literacy.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
    />
  );
};
