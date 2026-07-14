"use client";

import { cn } from "@/lib/utils";

export type Tab = "ward" | "agency";

interface WardLookupTabsProps {
  value: Tab;
  onChange: (value: Tab) => void;
}

export function WardLookupTabs({ value, onChange }: WardLookupTabsProps) {
  return (
    <div className="flex flex-row items-end justify-start gap-1">
      <button
        type="button"
        className={cn(
          "flex h-10 shrink-0 items-center justify-center px-4 pb-3 pt-2 text-sm transition-colors border-b-2",
          value === "ward"
            ? "border-[#0588F0] font-semibold text-[#0A0A0A]"
            : "border-transparent font-medium text-neutral-600 hover:text-neutral-900"
        )}
        onClick={() => onChange("ward")}
      >
        Chuyển đổi Phường/Xã
      </button>
      <button
        type="button"
        className={cn(
          "flex h-10 shrink-0 items-center justify-center px-4 pb-3 pt-2 text-sm transition-colors border-b-2",
          value === "agency"
            ? "border-[#0588F0] font-semibold text-[#0A0A0A]"
            : "border-transparent font-medium text-neutral-600 hover:text-neutral-900"
        )}
        onClick={() => onChange("agency")}
      >
        Tra cứu hành chính
      </button>
    </div>
  );
}