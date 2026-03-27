import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import SimPage from "@/lib/pages/sim";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.sim.name,
  };
}

export default function Page() {
  return <SimPage />;
}
