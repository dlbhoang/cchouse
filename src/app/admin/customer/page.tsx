import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import CustomerPage from "@/lib/pages/customer";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: AppRoutes.customer.name,
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return <CustomerPage searchParams={sParams} />;
}
