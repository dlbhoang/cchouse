import { Metadata } from "next";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import RecruitmentPage from "@/lib/pages/config/recruitment";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.recruitment.name,
  };
}

export default function Page() {
  return (
    <>
      <FloatBtn href={`${AppRoutes.recruitment.url}/add`} />
      <RecruitmentPage />
    </>
  );
}

