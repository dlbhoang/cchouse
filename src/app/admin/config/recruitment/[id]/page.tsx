import type { Metadata } from "next";
import RecruitmentDetailPage from "@/lib/pages/config/recruitment/detail";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Chi tiết tuyển dụng - ${id}`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const sParams = await searchParams;
  return (
    <RecruitmentDetailPage id={Number(id)} tab={sParams.tab as string} />
  );
}

