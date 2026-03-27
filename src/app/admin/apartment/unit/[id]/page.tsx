import type { Metadata } from "next";
import ApartmentUnitDetailPage from "@/lib/pages/apartment/unit/detail";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Chi tiết căn hộ - Mã: ${id}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ApartmentUnitDetailPage id={Number(id)} />;
}

