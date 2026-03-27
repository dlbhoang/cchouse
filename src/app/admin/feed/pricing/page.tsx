import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import FeedPricingPage from "@/lib/pages/feed/pricing";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.feedPricing.name,
  };
}

export default function Page() {
  return <FeedPricingPage />;
}
