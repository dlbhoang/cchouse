import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";

export async function generateMetadata(): Promise<Metadata> {
  return { title: AppRoutes.trangPhuc.name };
}

export default async function Page() {
  const data = "/rule/trang-phuc.pdf";

  return (
    <object
      data={data}
      type="application/pdf"
      width="100%"
      height="100%"
      aria-label="trang-phuc-cchouse"
    />
  );
}

