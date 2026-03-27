import { SelectProps } from "antd";
import { useAdminContext } from "@/lib/stored";
import SelectBase from "../base/SelectBase";

export const UserWebsiteStatusSelect = ({ ...props }: SelectProps) => {
  const {
    enumList: { UserWebsiteStatus },
  } = useAdminContext();
  return (
    <SelectBase
      {...props}
      placeholder="Chọn trạng thái"
      options={UserWebsiteStatus.map((e) => ({
        label: `${e.Name}`,
        value: e.Value,
      }))}
    />
  );
};
