import { notFound } from "next/navigation";
import PropertyDetailPage from "@/lib/pages/property/prop-detail/detail-page";

type Props = { params: { id: string } };

export default function Page({ params }: Props) {
  const id = Number(params.id);
  if (!Number.isSafeInteger(id) || id <= 0) notFound();
  return <PropertyDetailPage id={id} />;
}
