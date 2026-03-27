import { Metadata } from "next";
import UserAdminDetailPage from "@/lib/pages/userAdmin/detail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Thông tin nhân viên - ${id}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <UserAdminDetailPage id={id} />;
}
