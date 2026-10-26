import { redirect } from "next/navigation";
import { auth } from "@/services/auth/auth";
import { appConst } from "@/lib/core/configs/appConst";
import ErrorMonitor from "@/lib/pages/config/error-monitor";
export const metadata = { title: "Theo dõi lỗi hệ thống" };
export default async function Page() {
  const session = await auth();
  if (
    !session?.user ||
    !appConst.MANAGER_ROLES.includes(Number(session.user.RoleId))
  )
    redirect("/admin");
  return <ErrorMonitor />;
}
