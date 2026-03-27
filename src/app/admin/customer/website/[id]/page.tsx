import { Metadata } from "next";
import UserWebsiteDetailPage from "@/lib/pages/userWebsite/detail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Thông tin chi tiết - Mã tin: ${id}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <UserWebsiteDetailPage id={id} />;
}
