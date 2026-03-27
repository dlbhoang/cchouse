import { Select, type SelectProps } from "antd";

import apartmentApi from "@/services/api/apartment/apartmentApi";

export const ApartmentSelect = ({ ...props }: SelectProps) => {
  const { data, isLoading } = apartmentApi.useGet({
    pageIndex: 1,
    pageSize: 1000,
  });
  return (
    <Select
      {...props}
      style={{ width: "100%" }}
      loading={isLoading}
      placeholder="Chọn chung cư"
      options={data?.data.map((e) => ({
        label: `${e.Name}`,
        value: e.Id ?? 0,
        desc: `${e.Name} (${e.DistrictName})`,
      }))}
      optionRender={(option) => option.data.desc}
    />
  );
};
