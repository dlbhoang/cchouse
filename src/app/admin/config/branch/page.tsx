import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import BranchPage from "@/lib/pages/config/branch";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.branch.name,
  };
}

export default function Page() {
  return <BranchPage />;
}

