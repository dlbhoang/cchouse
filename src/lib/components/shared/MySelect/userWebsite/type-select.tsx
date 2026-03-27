import { SelectProps } from "antd";
import { useAdminContext } from "@/lib/stored";
import SelectBase from "../base/SelectBase";

export const UserWebsiteTypeSelect = ({ ...props }: SelectProps) => {
  const {
    enumList: { UserWebsiteType },
  } = useAdminContext();
  return (
    <SelectBase
      {...props}
      placeholder="Chọn đối tượng"
      options={UserWebsiteType.map((e) => ({
        label: `${e.Name}`,
        value: e.Value,
      }))}
    />
  );
};
