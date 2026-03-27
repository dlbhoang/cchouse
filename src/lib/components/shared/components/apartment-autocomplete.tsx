import { AutoComplete, type AutoCompleteProps } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useState } from "react";
import apartmentApi from "@/services/api/apartment/apartmentApi";
import type { IApartmentResponse } from "@/services/api/apartment/IApartment";

type CustomOption = DefaultOptionType & { item: IApartmentResponse };

const ApartmentAutoComplete = (props: AutoCompleteProps) => {
  const [options, setOptions] = useState<CustomOption[]>([]);
  const handleSearch = async (value: string) => {
    if (!value) {
      setOptions([]);
    }

    const result = await apartmentApi.get({
      pageIndex: 1,
      pageSize: 5,
      search: value,
    });
    if (result.data) {
      setOptions(
        result.data.map<CustomOption>((item) => ({
          label: item.Name,
          value: item.Name,
          item: item,
        }))
      );
    } else setOptions([]);
  };
  return (
    <AutoComplete
      {...props}
      options={options}
      placeholder="Nhập tên chung cư"
      onSearch={handleSearch}
    />
  );
};

export default ApartmentAutoComplete;
