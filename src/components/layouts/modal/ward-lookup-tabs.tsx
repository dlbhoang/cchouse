import { cn } from "@/lib/utils";

export type WardLookupTab = "conversion" | "agency";

export function WardLookupTabs({
  value,
  onChange,
}: {
  value: WardLookupTab;
  onChange: (value: WardLookupTab) => void;
}) {
  const tabs: { value: WardLookupTab; label: string }[] = [
    { value: "conversion", label: "Chuyển đổi Phường/Xã" },
    { value: "agency", label: "Cơ quan hành chính" },
  ];

  return (
    <div className="flex flex-row items-end justify-start gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          aria-current={value === tab.value ? "page" : undefined}
          className={cn(
            "flex h-10 shrink-0 items-center justify-center border-b-2 px-4 pb-3 pt-2 text-sm transition-colors",
            value === tab.value
              ? "border-[#0588F0] font-semibold text-[#0A0A0A]"
              : "border-transparent font-medium text-neutral-600 hover:text-neutral-900"
          )}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
