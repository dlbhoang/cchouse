import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import type { SelectType } from "@/lib/types/common";
import feedPricingApi from "@/services/api/feedPricingApi";

import SelectBase from "./base/SelectBase";

export const FeedPricingSelect = ({ value, mode, onChange }: SelectType) => {
  const { data, isLoading } = feedPricingApi.useGet({
    pageIndex: 1,
    pageSize: 100,
  } as ISearchOptions);
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Chọn"
      allowClear
      options={data?.data
        .filter((x) => x.IsActive)
        ?.map((e) => ({
          label: e.Title,
          value: e.Id,
        }))}
      onChange={onChange}
      loading={isLoading}
    />
  );
};
