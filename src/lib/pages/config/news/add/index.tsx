"use client";
import { Card } from "antd";

import NewsForm from "@/lib/components/admin/news/form";
import TitlePage from "@/lib/core/layout/components/TitlePage";

const AddNewsPage = () => {
  return (
    <Card title={<TitlePage title="Thêm bài viết" />}>
      <NewsForm />
    </Card>
  );
};

export default AddNewsPage;
