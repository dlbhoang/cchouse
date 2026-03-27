import { Metadata } from "next";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import UserAdminPage from "@/lib/pages/userAdmin";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.userAdmin.name,
  };
}

export default function Page() {
  return (
    <>
      <UserAdminPage />
      <FloatBtn href={`${AppRoutes.userAdmin.url}/add`} />
    </>
  );
}
