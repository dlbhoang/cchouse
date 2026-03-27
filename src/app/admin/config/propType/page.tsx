import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import PropTypePage from "@/lib/pages/config/propType";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.propType.name,
  };
}

export default function Page() {
  return <PropTypePage />;
}

