import { Checkbox } from "antd";

import { useAdminContext } from "@/lib/stored";
import { CheckboxType } from "@/lib/types/common";

export const StructuresCbx = ({ value, onChange }: CheckboxType) => {
  const { enumList } = useAdminContext();
  return (
    <Checkbox.Group
      options={enumList.Structures.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      value={value}
      onChange={(e) => {
        if (onChange) onChange(e as string[]);
      }}
    />
  );
};
