import { useEffect, useState } from "react";
import { WARD_AGENCIES } from "@/data/ward-agencies";
import type { IWardResponse } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import type { SelectType } from "@/lib/types/common";
import wardApi from "@/services/api/wardApi";
import SelectBase from "../base/SelectBase";

type Props = SelectType & {
  /**
   * Khi true: parentVal được hiểu là ProvinceId (địa chỉ mới sau sáp nhập,
   * bỏ qua cấp Quận/Huyện). Khi false/undefined: parentVal là DistrictId (mặc định).
   */
  isNew?: boolean;
};

export const WardSelect = ({
  parentVal,
  value,
  mode,
  isNew,
  onChange,
  ...props
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IWardResponse[]>([]);
  useEffect(() => {
    if (!parentVal) {
      setData([]);
      return;
    }
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await wardApi.get({
          ...(isNew ? { ProvinceId: parentVal } : { DistrictId: parentVal }),
          IsNew: isNew,
          pageIndex: 1,
          pageSize: 10000,
        });
        const wards = result.data ?? [];
        if (wards.length > 0 || !isNew) {
          setData(wards);
        } else {
          setData(
            WARD_AGENCIES.map((ward) => ({
              Id: ward.WardId,
              Name: ward.WardName,
              ShortName: ward.WardName,
              RefKey: "",
              Type: ward.WardType,
              Images: [],
              Slug: ward.WardName,
              DistrictId: 0,
              DistrictName: "",
            })) as IWardResponse[]
          );
        }
      } catch {
        setData(
          isNew
            ? (WARD_AGENCIES.map((ward) => ({
                Id: ward.WardId,
                Name: ward.WardName,
                ShortName: ward.WardName,
                RefKey: "",
                Type: ward.WardType,
                Images: [],
                Slug: ward.WardName,
                DistrictId: 0,
                DistrictName: "",
              })) as IWardResponse[])
            : []
        );
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
