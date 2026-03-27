import { Metadata } from "next";
import DataLogPage from "@/lib/pages/hidden/dataLog";

export const metadata: Metadata = {
  title: "Data Log",
};

export default function Page() {
  return <DataLogPage />;
}
