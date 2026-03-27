import { Metadata } from "next";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import PropertyPage from "@/lib/pages/property";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Thay thế logic dynamic title bằng generateMetadata
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const sParams = await searchParams;
  const transType = sParams.TransType
    ? Number(sParams.TransType)
    : ETransType.sell;

  const title =
    transType === ETransType.sell ? "Quản lý nhà bán" : "Quản lý nhà thuê";

  return { title };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;

  const transType = sParams.TransType
    ? Number(sParams.TransType)
    : ETransType.sell;

  const pageProps = {
    transType: transType,
    title:
      transType === ETransType.sell ? "Quản lý nhà bán" : "Quản lý nhà thuê",
    addUrl: `${AppRoutes.property.url}/add?TransType=${transType}`,
  };

  return (
    <>
      <FloatBtn href={pageProps.addUrl} />
      <PropertyPage {...pageProps} />
    </>
  );
}
