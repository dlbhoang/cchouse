import { Metadata } from "next";
import AddNewsPage from "@/lib/pages/config/news/add";

export const metadata: Metadata = {
  title: "Thêm tin tức",
};

export default function Page() {
  return <AddNewsPage />;
}

