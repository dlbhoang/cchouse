import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import ApartmentUnitPage from "@/lib/pages/apartment/unit";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const sParams = await searchParams;
  const transType = Number(sParams.TransType) ?? ETransType.sell;
  const title =
    transType === ETransType.sell
      ? `${AppRoutes.apartmentUnit.name} bán`
      : `${AppRoutes.apartmentUnit.name} thuê`;

  return { title };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return <ApartmentUnitPage searchParams={sParams} />;
}

