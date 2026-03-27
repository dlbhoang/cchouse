import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import ConsignmentPage from "@/lib/pages/dashboard/consignment";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: AppRoutes.consignment.name,
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return <ConsignmentPage searchParams={sParams} />;
}

