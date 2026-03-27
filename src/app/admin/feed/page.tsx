import { Metadata } from "next";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import FeedPage from "@/lib/pages/feed";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: `${AppRoutes.feed.name} đăng tin`,
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return (
    <>
      <FeedPage searchParams={sParams} />
      <FloatBtn href={`${AppRoutes.feed.url}/add`} />
    </>
  );
}
