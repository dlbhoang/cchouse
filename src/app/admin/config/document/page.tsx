import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import DocumentPage from "@/lib/pages/config/document";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.document.name,
  };
}

export default function Page() {
  return <DocumentPage />;
}

