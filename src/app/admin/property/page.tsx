import { Metadata } from "next";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { ETransType } from "@/lib/core/enum";
import PropertyPage from "@/lib/pages/property";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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

  return (
    <>
      <FloatBtn
        href={`?action=add&TransType=${transType}`}
      />
      <PropertyPage transType={transType} />
    </>
  );
}
