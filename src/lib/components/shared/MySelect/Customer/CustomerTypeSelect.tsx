import SelectBase from "../base/SelectBase";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

export const CustomerTypeSelect = ({
  mode,
  value,
  onChange,
  placeholder = "Nhận diện khách hàng",
  popupClassName,
  placement,
  listHeight,
}: SelectType) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      mode={mode}
      placeholder={placeholder}
      popupClassName={popupClassName}
      placement={placement}
      listHeight={listHeight}
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
