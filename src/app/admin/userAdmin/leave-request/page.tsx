import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import LeaveRequestPage from "@/lib/pages/userAdmin/leave-request";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: AppRoutes.leaveRequest.name,
  };
}

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  return <LeaveRequestPage searchParams={sParams} />;
}
