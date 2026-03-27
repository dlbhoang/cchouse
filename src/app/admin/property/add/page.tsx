import { Metadata } from "next";
import PropAddEdit from "@/lib/components/admin/property/form/propAddEdit";
import { ETransType } from "@/lib/core/enum";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Thay thế logic dynamic title bằng generateMetadata
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return { title: "Tạo bất động sản mới" };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return (
    <PropAddEdit transType={Number(sParams.TransType) ?? ETransType.sell} />
  );
}
