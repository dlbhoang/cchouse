import type { SelectType } from "@/lib/types/common";
import newsTypeApi from "@/services/api/news/newsTypeApi";
import SelectBase from "../base/SelectBase";

type Props = {
  placeholder?: string;
};

export const NewsTypeSelect = ({
  placeholder = "Chọn",
  value,
  mode,
  allowClear,
  onChange,
  ...props
}: SelectType & Props) => {
  const { data, isLoading } = newsTypeApi.useGet(
    { pageIndex: 1, pageSize: 100 }
  );

  const options = data?.data?.map((e) => ({
    label: e.Name,
    value: e.Id ?? 0,
  })) || [];

  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder={placeholder}
      allowClear={allowClear}
      options={options}
      onChange={onChange}
      loading={isLoading}
      {...props}
    />
  );
};
