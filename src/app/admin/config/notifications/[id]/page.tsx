import type { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import NotiDetailPage from "@/lib/pages/config/notifications/detail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Thông báo - ${id}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <NotiDetailPage id={Number(id)} />;
}

