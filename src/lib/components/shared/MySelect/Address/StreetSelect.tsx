import { useEffect, useState } from "react";

import type { IStreetResponse } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import type { SelectType } from "@/lib/types/common";
import streetApi from "@/services/api/streetApi";
import SelectBase from "../base/SelectBase";

type Props = SelectType & {
  /**
   * Khi true: parentVal được hiểu là ProvinceId (địa chỉ mới sau sáp nhập,
   * bỏ qua cấp Quận/Huyện). Khi false/undefined: parentVal là DistrictId (mặc định).
   */
  isNew?: boolean;
};

export const StreetSelect = ({
  parentVal,
  value,
  mode,
  isNew,
  onChange,
  ...props
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IStreetResponse[]>([]);
  useEffect(() => {
    if (!parentVal) {
      setData([]);
      return;
    }
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await streetApi.get({
          ...(isNew ? { ProvinceId: parentVal } : { DistrictId: parentVal }),
          IsNew: isNew,
          pageIndex: 1,
          pageSize: 10000,
        });
        setData(result.data ?? []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parentVal, isNew]);
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder="Đường"
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
