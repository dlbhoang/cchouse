import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import PropTransferPage from "@/lib/pages/prop-transfer";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: AppRoutes.propTransfer.name,
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return <PropTransferPage searchParams={sParams} />;
}
