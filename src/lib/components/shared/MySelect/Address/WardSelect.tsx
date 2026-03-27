import { useEffect, useState } from "react";
import type { IWardResponse } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import type { SelectType } from "@/lib/types/common";
import wardApi from "@/services/api/wardApi";
import SelectBase from "../base/SelectBase";

export const WardSelect = ({
  parentVal,
  value,
  mode,
  onChange,
  ...props
}: SelectType) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IWardResponse[]>([]);
  useEffect(() => {
    if (parentVal) {
      setLoading(true);
      const fetchData = async () => {
        const result = await wardApi.get({
          DistrictId: parentVal,
          pageIndex: 1,
          pageSize: 10000,
        });
        setData(result.data);
        setLoading(false);
      };
      fetchData();
    }
  }, [parentVal]);
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Phường / Xã"
      allowClear
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
