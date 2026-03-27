import type { Metadata } from "next";

import PropDetailPage from "@/lib/pages/property/prop-detail";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Chi tiết bất động sản - Mã: ${id}`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const sParams = await searchParams;
  const propertyId = Number(id);

  return <PropDetailPage id={propertyId} query={sParams} />;
}
