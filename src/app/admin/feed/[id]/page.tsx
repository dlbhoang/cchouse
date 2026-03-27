import { Metadata } from "next";
import AddFeedPage from "@/lib/pages/feed/add";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Chi tiết tin đăng - Mã tin: ${id}`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const sParams = await searchParams;
  return <AddFeedPage id={id} searchParams={sParams} />;
}
