import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import VerifyPropertyPage from "@/lib/pages/verify-property";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: AppRoutes.verifyProperty.name,
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return <VerifyPropertyPage searchParams={sParams} />;
}
