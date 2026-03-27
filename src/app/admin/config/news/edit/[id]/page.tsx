import type { Metadata } from "next";
import EditNewsPage from "@/lib/pages/config/news/edit";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Chỉnh sửa bài viết - ${id}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <EditNewsPage id={Number(id)} />;
}

