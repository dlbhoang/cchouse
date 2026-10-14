import { Metadata } from "next";
import AgencyManagerPage from "@/lib/pages/config/agency-manager";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Quản lý cơ quan hành chính" };
}

export default function Page() {
  return <AgencyManagerPage />;
}
