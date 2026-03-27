import { redirect } from "next/navigation";
import RootLayout from "@/components/layouts";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { auth } from "@/services/auth/auth";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(AppRoutes.login.url);
  }

  return <RootLayout session={session}>{children}</RootLayout>;
}
