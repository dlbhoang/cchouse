import { SelectProps } from "antd";
import { useAdminContext } from "@/lib/stored";
import SelectBase from "../MySelect/base/SelectBase";

const ProvinceAutocomplete = (props: SelectProps) => {
  const { provinces } = useAdminContext();

  return (
    <SelectBase
      options={provinces.map((e) => ({
        label: e.Name,
        value: e.Name,
      }))}
      placeholder="Tỉnh / Thành"
      filterOption={(inputValue, option) =>
        option!.value
          ?.toString()
          .toUpperCase()
          .indexOf(inputValue.toUpperCase()) !== -1
      }
      allowClear
      {...props}
    />
  );
};

export default ProvinceAutocomplete;
