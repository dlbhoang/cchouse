import { Metadata } from "next";
import AddRecruitmentPage from "@/lib/pages/config/recruitment/add";

export const metadata: Metadata = {
  title: "Thêm tin tuyển dụng",
};

export default function Page() {
  return <AddRecruitmentPage />;
}

