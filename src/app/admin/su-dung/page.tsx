import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";

export async function generateMetadata(): Promise<Metadata> {
  return { title: AppRoutes.suDung.name };
}

export default async function Page() {
  const data = "/rule/0475f108-c1d4-464d-a91e-9ca345fa2f80.pdf";

  return (
    <object
      data={data}
      type="application/pdf"
      width="100%"
      height="100%"
      aria-label="sudung_cchouse"
    />
  );
}

