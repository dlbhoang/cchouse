import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import FeedWebsitePage from "@/lib/pages/feed/website";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Danh sách ${AppRoutes.feedWebsite.name} website`,
  };
}

export default function Page() {
  return <FeedWebsitePage />;
}
