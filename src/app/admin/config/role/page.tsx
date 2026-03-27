import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import RolePage from "@/lib/pages/config/role";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.role.name,
  };
}

export default function Page() {
  return <RolePage />;
}

