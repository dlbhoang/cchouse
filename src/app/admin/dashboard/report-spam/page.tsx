import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import ReportSpamPage from "@/lib/pages/dashboard/report-spam";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: AppRoutes.reportSpam.name,
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return <ReportSpamPage searchParams={sParams} />;
}
