import { Metadata } from "next";
import AddApartmentUnitPage from "@/lib/pages/apartment/unit/add";

export const metadata: Metadata = {
  title: "Thêm căn hộ mới",
};

export default function Page() {
  return <AddApartmentUnitPage />;
}

