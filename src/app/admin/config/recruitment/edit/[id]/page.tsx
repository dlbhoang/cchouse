import type { Metadata } from "next";
import EditRecruitmentPage from "@/lib/pages/config/recruitment/edit";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Chỉnh sửa tin tuyển dụng - ${id}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <EditRecruitmentPage id={Number(id)} />;
}

