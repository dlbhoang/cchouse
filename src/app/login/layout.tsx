import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { auth } from "@/services/auth/auth";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) {
    const expiredDate = session?.user?.expiredDate;
    if (dayjs(expiredDate).isAfter(dayjs())) {
      redirect(AppRoutes.property.url);
    }
  }
  return children;
}
