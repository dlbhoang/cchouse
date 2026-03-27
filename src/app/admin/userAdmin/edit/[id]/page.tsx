import { Metadata } from "next";
import EditUserAdminPage from "@/lib/pages/userAdmin/edit";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Chỉnh sửa thông tin nhân viên - ${id}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <EditUserAdminPage id={id} />;
}
