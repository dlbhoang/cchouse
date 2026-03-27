import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import NotiPage from "@/lib/pages/config/notifications";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.notifications.name,
  };
}

export default function Page() {
  return <NotiPage />;
}

