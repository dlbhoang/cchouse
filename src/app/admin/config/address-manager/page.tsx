import { Metadata } from "next";
import AddressManagerPage from "@/lib/pages/config/address/address-manager";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Quản lý địa chỉ" };
}

export default function Page() {
  return <AddressManagerPage />;
}