import { useEffect, useState } from "react";

import type { IDistrictResponse } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import type { SelectType } from "@/lib/types/common";
import districtApi from "@/services/api/districtApi";
import SelectBase from "../base/SelectBase";

export const DistrictSelect = ({
  value,
  parentVal,
  onChange,
  ...props
}: SelectType) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IDistrictResponse[]>([]);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await districtApi.get({
        ProvinceId: parentVal ?? 1,
        pageIndex: 1,
        pageSize: 10000,
      });
      setData(result.data);
      setLoading(false);
    };
    fetchData();
  }, [parentVal]);

  return (
    <SelectBase
      value={value}
      placeholder="Quận / Huyện"
      options={data.map((e) => ({
        label: e.Name,
        value: e.Id,
        slug: e.Slug,
      }))}
      onChange={onChange}
      loading={loading}
      {...props}
    />
  );
};
