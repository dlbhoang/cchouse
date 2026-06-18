import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import BannerPage from "@/lib/pages/config/banner";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.banner.name,
  };
}

export default function Page() {
  return <BannerPage />;
}
