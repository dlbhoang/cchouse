import dayjs from "dayjs";
import { redirect } from "next/navigation";
import LoginLayout from "@/components/layouts/login-layout";
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
  return <LoginLayout>{children}</LoginLayout>;
}
