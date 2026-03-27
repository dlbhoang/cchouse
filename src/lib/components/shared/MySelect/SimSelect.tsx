import { useEffect, useState } from "react";

import { baseFilter } from "@/lib/core/configs/appConst";
import type { ISimResponse } from "@/lib/interfaces/ISim";
import type { SelectType } from "@/lib/types/common";
import simApi from "@/services/api/simApi";

import SelectBase from "./base/SelectBase";

export const SimSelect = ({ mode, value, onChange }: SelectType) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ISimResponse[]>([]);
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const simResult = await simApi.get({ ...baseFilter, pageSize: 100 });
      setData(simResult.data);
      setLoading(false);
    };
    fetch();
  }, []);
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Sim công ty cấp"
      allowClear
      options={data.map((e) => ({
        label: e.PhoneNumber,
        value: e.Id,
      }))}
      onChange={onChange}
      loading={loading}
    />
  );
};
