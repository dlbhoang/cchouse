import { Metadata } from "next";
import AddApartmentPage from "@/lib/pages/apartment/add";

export const metadata: Metadata = {
  title: "Thêm chung cư / căn hộ",
};

export default function Page() {
  return <AddApartmentPage />;
}

