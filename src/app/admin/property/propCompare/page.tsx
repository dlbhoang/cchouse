import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import PropComparePage from "@/lib/pages/property/prop-compare";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Thay thế logic dynamic title bằng generateMetadata
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return { title: AppRoutes.propCompare.name };
}

export default async function Page({ searchParams }: Props) {
  return <PropComparePage />;
}
