import { Metadata } from "next";
import AddFeedPage from "@/lib/pages/feed/add";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: "Tạo tin đăng mới",
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return <AddFeedPage searchParams={sParams} />;
}
