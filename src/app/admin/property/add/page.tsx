import { redirect } from "next/navigation";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  const transType = sParams.TransType
    ? Number(sParams.TransType)
    : ETransType.sell;

  const query = new URLSearchParams({
    TransType: String(transType),
    action: "add",
  });

  if (sParams.AddressNumber) {
    query.set("AddressNumber", String(sParams.AddressNumber));
  }
  if (sParams.ProvinceId) {
    query.set("ProvinceId", String(sParams.ProvinceId));
  }
  if (sParams.DistrictId) {
    query.set("DistrictId", String(sParams.DistrictId));
  }
  if (sParams.WardId) {
    query.set("WardId", String(sParams.WardId));
  }
  if (sParams.StreetId) {
    query.set("StreetId", String(sParams.StreetId));
  }

  redirect(`${AppRoutes.property.url}?${query.toString()}`);
}
