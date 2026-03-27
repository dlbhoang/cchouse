import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import AddressPage from "@/lib/pages/config/address";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: AppRoutes.address.name,
  };
}

export default function Page() {
  return <AddressPage />;
}
