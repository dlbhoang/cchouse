import { Metadata } from "next";
import AddUserAdminPage from "@/lib/pages/userAdmin/add";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tạo nhân viên mới",
  };
}

export default function Page() {
  return <AddUserAdminPage />;
}
