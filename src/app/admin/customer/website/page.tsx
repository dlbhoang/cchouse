import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import UserWebsitePage from "@/lib/pages/userWebsite";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: AppRoutes.userWebsite.name,
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return <UserWebsitePage searchParams={sParams} />;
}

