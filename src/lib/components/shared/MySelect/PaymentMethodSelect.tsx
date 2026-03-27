import { useAdminContext } from "@/lib/stored";

import { SelectProps } from "antd";
import SelectBase from "./base/SelectBase";

export const PaymentMethodSelect = ({
  value,
  mode,
  onChange,
  ...props
}: SelectProps) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      {...props}
      mode={mode}
      placeholder="Đơn vị"
      allowClear
      options={enumList.PaymentMethod.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
    />
  );
};
