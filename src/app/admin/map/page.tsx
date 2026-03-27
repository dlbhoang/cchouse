import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import MapPage from "@/lib/pages/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.map.name,
  };
}

export default function Page() {
  return <MapPage />;
}
