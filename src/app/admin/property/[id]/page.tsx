import { redirect } from "next/navigation";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const sParams = await searchParams;
  const transType = sParams.TransType
    ? Number(sParams.TransType)
    : ETransType.sell;

  const query = new URLSearchParams({
    TransType: String(transType),
    openPropId: id,
  });

  redirect(`${AppRoutes.property.url}?${query.toString()}`);
}
