import type { Metadata } from "next";
import PropAddEdit from "@/lib/components/admin/property/form/propAddEdit";
import { ETransType } from "@/lib/core/enum";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export const metadata: Metadata = { title: "Thêm bất động sản mới" };

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  const transType = first(sParams.TransType)
    ? Number(first(sParams.TransType))
    : ETransType.sell;

  return (
    <PropAddEdit
      key={transType}
      transType={transType}
      query={{
        AddressNumber: first(sParams.AddressNumber),
        ProvinceId: first(sParams.ProvinceId),
        DistrictId: first(sParams.DistrictId),
        WardId: first(sParams.WardId),
        StreetId: first(sParams.StreetId),
      }}
    />
  );
}
