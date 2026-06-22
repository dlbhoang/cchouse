import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import NewsPage from "@/lib/pages/config/news";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.news.name,
  };
}

export default function Page() {
  return <NewsPage />;
}

