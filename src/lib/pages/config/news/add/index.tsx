"use client";

import { useRouter } from "next/navigation";
import NewsForm from "@/lib/components/admin/news/form";
import { AppRoutes } from "@/lib/core/configs/appRoutes";

const AddNewsPage = () => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="add-news-page">
      <NewsForm onClose={handleClose} />
    </div>
  );
};

export default AddNewsPage;