import { Metadata } from "next";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import ApartmentPage from "@/lib/pages/apartment";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: AppRoutes.apartment.name,
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;

  return (
    <>
      <FloatBtn href={`${AppRoutes.apartment.url}/add`} />
      <ApartmentPage />
    </>
  );
}
