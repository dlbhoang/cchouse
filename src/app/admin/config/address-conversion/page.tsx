import { ArrowLeftRight, MapPinned } from "lucide-react";
import { Metadata } from "next";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import MergeWardTab from "@/lib/pages/config/address/merge-ward/mergeWardTab";
import "./page.css";

export async function generateMetadata(): Promise<Metadata> {
  return { title: AppRoutes.addressConversion.name };
}

export default function AddressConversionPage() {
  return (
    <main className="address-conversion-page">
      <header className="address-conversion-heading">
        <div className="address-conversion-icon"><MapPinned size={21} /></div>
        <div>
          <h1>{AppRoutes.addressConversion.name}</h1>
          <p>Quản lý địa chỉ hành chính trước và sau sáp nhập</p>
        </div>
        <div className="address-conversion-flow"><ArrowLeftRight size={16} /> Địa chỉ cũ <span>→</span> Địa chỉ mới</div>
      </header>
      <section className="address-conversion-panel">
      <MergeWardTab />
      </section>
    </main>
  );
}
