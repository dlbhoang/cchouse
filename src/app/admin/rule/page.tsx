import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import RulePage from "@/lib/pages/rule";

export async function generateMetadata(): Promise<Metadata> {
  return { title: AppRoutes.rule.name };
}

export default async function Page() {
  return <RulePage />;
}

