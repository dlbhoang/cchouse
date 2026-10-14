import { Metadata } from "next";
import { Suspense } from "react";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import MapPage from "@/lib/pages/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.map.name,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <MapPage />
    </Suspense>
  );
}
