import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import PropTempPage from "@/lib/pages/propTemp";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: AppRoutes.propTemp.name,
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return <PropTempPage searchParams={sParams} />;
}
