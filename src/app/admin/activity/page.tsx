import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import ActivityPage from "@/lib/pages/activity";

export async function generateMetadata(): Promise<Metadata> {
  return { title: AppRoutes.activity.name };
}

export default async function Page() {
  return <ActivityPage />;
}
