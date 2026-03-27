import { Metadata } from "next";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import NewsPage from "@/lib/pages/config/news";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.news.name,
  };
}

export default function Page() {
  return (
    <>
      <FloatBtn href={`${AppRoutes.news.url}/add`} />
      <NewsPage />
    </>
  );
}

