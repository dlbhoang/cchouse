import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import DashboardPage from "@/lib/pages/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  return { title: AppRoutes.dashboard.name };
}

export default function page() {
  return <DashboardPage />;
}
