"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Loader2, MapPin, RefreshCw, ArrowLeftRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import DistrictCbxField from "@/components/ui/form-field/district-cbx";
import WardCbxField from "@/components/ui/form-field/ward-cbx";
import ProvinceCbxField from "@/components/ui/form-field/province-cbx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ISearchWardDto } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import { cn } from "@/lib/utils";
import wardApi from "@/services/api/wardApi";
import { WARD_AGENCIES_MAP } from "@/data/ward-agencies";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Tab = "ward" | "agency";

interface AgencyItem {
  name: string;
  address: string;
}
interface AgencyGroup {
  label: string;
  items: AgencyItem[];
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const AGENCY_TAGS = [
  "Văn phòng công chứng",
  "Văn phòng đất đai",
  "Chi cục thuế",
  "Ủy ban nhân dân phường",
  "Tòa án",
  "Sở tư pháp",
  "Thừa phát lại",
] as const;

const AGENCY_DROPDOWN_FIELDS = [
  "Văn phòng công chứng",
  "Văn phòng đất đai",
  "Sở tư pháp",
  "Chi cục thuế",
] as const;

const DEFAULT_ACTIVE_TAGS = new Set<string>([
  "Văn phòng công chứng",
  "Văn phòng đất đai",
  "Chi cục thuế",
  "Ủy ban nhân dân phường",
  "Sở tư pháp",
]);

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const schema = z.object({
  ProvinceId: z.coerce.number().min(1, { message: "Vui lòng chọn Tỉnh / Thành phố" }),
  DistrictId: z.coerce.number(),
  WardId: z.coerce.number().min(1, { message: "Vui lòng chọn Phường / Xã" }),
});

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const cbxFieldClass = [
  "[&_button]:w-full",
  "[&_button]:h-[42px]",
  "[&_button]:min-h-[42px]",
  "[&_button]:max-h-[42px]",
  "[&_button]:rounded-[8px]",
  "[&_button]:border-0",
  "[&_button]:bg-transparent",
  "[&_button]:text-sm",
  "[&_button]:px-3",
  "[&_button]:py-0",
  "[&_button]:justify-start",
  "[&_button]:font-normal",
  "[&_button]:shadow-none",
  "[&_button]:ring-0",
  "[&_button]:focus-visible:ring-0",
  "[&_button]:focus-visible:ring-offset-0",
  "[&_button]:hover:bg-transparent",
  "[&_[role=combobox]]:w-full",
  "[&_[role=combobox]]:h-[42px]",
  "[&_[role=combobox]]:rounded-[8px]",
  "[&_[role=combobox]]:border-0",
  "[&_[role=combobox]]:bg-transparent",
  "[&_[role=combobox]]:text-sm",
  "[&_[role=combobox]]:px-3",
  "[&_[role=combobox]]:justify-start",
  "[&_[role=combobox]]:font-normal",
  "[&_[role=combobox]]:shadow-none",
  "[&_[role=combobox]]:ring-0",
  "[&_.form-item]:m-0",
  "[&_.form-item]:p-0",
  "w-full",
].join(" ");

const selectTriggerClass =
  "w-full h-[42px] rounded-[8px] border-0 bg-transparent text-sm shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0";

/** Build agency groups from WARD_AGENCIES_MAP for a given wardId + active tags */
function buildAgencyGroups(wardId: number, activeTags: Set<string>): AgencyGroup[] {
  const data = WARD_AGENCIES_MAP.get(wardId);
  if (!data) return [];
  return Array.from(activeTags)
    .map((tag) => {
      const key = tag as keyof typeof data.Agencies;
      const items: AgencyItem[] = (data.Agencies[key] ?? []).map((a) => ({
        name: a.name,
        address: a.address,
      }));
      return { label: tag, items };
    })
    .filter((g) => g.items.length > 0);
}

function getAgencyOptions(wardId: number, agencyType: string) {
  const data = WARD_AGENCIES_MAP.get(wardId);
  if (!data) return [];
  const key = agencyType as keyof typeof data.Agencies;
  return (data.Agencies[key] ?? []).map((item, index) => ({
    value: String(index),
    label: item.name,
  }));
}

// ─────────────────────────────────────────────
// FloatingField
// ─────────────────────────────────────────────
function FloatingField({
  label,
  required,
  children,
  className = "",
  error,
  filled = false,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: string;
  filled?: boolean;
}) {
  const isError = !!error;
  const isFloating = filled;

  return (
    <div className={cn("flex flex-col items-start self-stretch", className)}>
      <div
        className={cn(
          "group/float relative w-full rounded-[10px] bg-white border-2 transition-[border-color] duration-200",
          isError
            ? "border-[#DC3E42]"
            : [
                "border-neutral-200 hover:border-neutral-300",
                "focus-within:border-[#0588F0]",
                "has-[button[data-state=open]]:border-[#0588F0]",
              ]
        )}
      >
        <div
          className={cn(
            "relative w-full min-h-[42px]",
            !isFloating &&
              "[&:not(:focus-within):not(:has([data-state=open]))]:[&_button>span:first-child]:opacity-0",
            !isFloating &&
              "[&:not(:focus-within):not(:has([data-state=open]))]:[&_[data-slot=select-value]]:opacity-0"
          )}
        >
          {children}
        </div>

        <div
          className={cn(
            "absolute left-3 px-1 bg-white pointer-events-none z-10 flex items-center gap-[3px]",
            "transition-all duration-200 ease-out",
            isFloating
              ? "top-0 -translate-y-1/2 text-xs text-neutral-600"
              : "top-1/2 -translate-y-1/2 text-sm text-neutral-500",
            "group-focus-within/float:top-0 group-focus-within/float:-translate-y-1/2 group-focus-within/float:text-xs",
            "group-has-[button[data-state=open]]/float:top-0 group-has-[button[data-state=open]]/float:-translate-y-1/2 group-has-[button[data-state=open]]/float:text-xs",
            isError
              ? "text-[#DC3E42] group-focus-within/float:text-[#DC3E42] group-has-[button[data-state=open]]/float:text-[#DC3E42]"
              : "group-focus-within/float:text-[#0588F0] group-has-[button[data-state=open]]/float:text-[#0588F0]"
          )}
        >
          <span>{label}</span>
          {required && (
            <span className="text-[#DC3E42] text-[10px] leading-none">*</span>
          )}
        </div>
      </div>
      {error && (
        <span className="text-[#DC3E42] text-xs mt-1 ml-1">{error}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ToggleSwitch
// ─────────────────────────────────────────────
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        checked ? "bg-[#0588F0]" : "bg-neutral-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// ─────────────────────────────────────────────
// TagButton
// ─────────────────────────────────────────────
function TagButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center text-left py-1 px-4 rounded-[99px] border border-solid transition-all duration-200",
        active
          ? "bg-[#E8F4FE] border-[#0588F0] shadow-[0_0_0_1px_#0588F0]"
          : "bg-neutral-100 border-neutral-200 hover:border-neutral-300"
      )}
    >
      <span className={cn("text-sm transition-colors duration-200", active ? "text-[#0588F0]" : "text-neutral-950")}>
        {label}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────
// AgencyCard
// ─────────────────────────────────────────────
function AgencyCard({ group }: { group: AgencyGroup }) {
  const showMapPin = group.label !== "Chi cục thuế";

  return (
    <div className="flex flex-col items-start self-stretch py-4 px-4 gap-3 rounded-lg border border-solid border-neutral-200">
      <span className="text-neutral-950 text-base font-bold">{group.label}</span>
      <ul className="flex flex-col self-stretch gap-3 list-none m-0 p-0">
        {group.items.map((item, i) => (
          <li key={i} className="flex items-start self-stretch gap-3">
            <span className="text-[#0588F0] text-sm mt-0.5">•</span>
            <span className="flex-1 text-neutral-950 text-sm">
              <span className="font-semibold">{item.name}:</span> {item.address}
            </span>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                aria-label="Sao chép địa chỉ"
                className="text-neutral-400 hover:text-neutral-700 transition-colors"
                onClick={() => {
                  navigator.clipboard?.writeText(`${item.name}: ${item.address}`);
                  toast.success("Đã sao chép địa chỉ");
                }}
              >
                <Copy className="w-4 h-4" />
              </button>
              {showMapPin && (
                <button
                  type="button"
                  aria-label="Xem bản đồ"
                  className="text-neutral-400 hover:text-neutral-700 transition-colors"
                  onClick={() =>
                    window.open(
                      `https://maps.google.com/?q=${encodeURIComponent(item.address)}`,
                      "_blank"
                    )
                  }
                >
                  <MapPin className="w-4 h-4" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main dialog
// ─────────────────────────────────────────────
const WardLookupDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [tab, setTab] = useState<Tab>("ward");
  const [searchByNewAddress, setSearchByNewAddress] = useState(false);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set(DEFAULT_ACTIVE_TAGS));
  const [agencySelections, setAgencySelections] = useState<Record<string, string>>({});
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [wards, setWards] = useState<ISearchWardDto[]>([]);
  const [agencyGroups, setAgencyGroups] = useState<AgencyGroup[]>([]);
  const [originalAddress, setOriginalAddress] = useState<string>("");
  const dialogBodyRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ProvinceId: 1,
      DistrictId: 0,
      WardId: 0,
    },
  });

  const wardId = form.watch("WardId");
  const hasResult = tab === "ward" ? wards.length > 0 : agencyGroups.length > 0;

  const filteredAgencyGroups = useMemo(() => {
    return agencyGroups
      .map((group) => {
        const selectedIndex = agencySelections[group.label];
        if (selectedIndex === undefined || selectedIndex === "") {
          return group;
        }
        const index = Number(selectedIndex);
        const item = group.items[index];
        return item ? { ...group, items: [item] } : group;
      })
      .filter((group) => group.items.length > 0);
  }, [agencyGroups, agencySelections]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);

      if (wardId > 0 && wards.length > 0) {
        setAgencyGroups(buildAgencyGroups(wardId, next));
      }

      return next;
    });
  };

  const handleSearchModeChange = (checked: boolean) => {
    setSearchByNewAddress(checked);
    // Chỉ reset agency, không ảnh hưởng đến form chuyển đổi phường/xã
    setAgencyGroups([]);
    setAgencySelections({});
  };

  const handleReset = () => {
    if (tab === "agency") {
      setAgencyGroups([]);
      setAgencySelections({});
      return;
    }

    form.reset({ ProvinceId: 1, DistrictId: 0, WardId: 0 });
    setWards([]);
    setAgencyGroups([]);
    setOriginalAddress("");
    setSelectedDistrict("");
    setAgencySelections({});
    setSearchByNewAddress(false);
  };

  const handleClose = () => {
    onClose();
    handleReset();
    setTab("ward");
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (tab === "agency") {
      if (data.WardId < 1) {
        toast.warning("Vui lòng chọn phường/xã ở tab Chuyển đổi Phường/Xã trước");
        return;
      }
      setAgencyGroups(buildAgencyGroups(data.WardId, activeTags));
      return;
    }

    if (!searchByNewAddress && data.DistrictId < 1) {
      form.setError("DistrictId", { message: "Vui lòng chọn Quận / Huyện" });
      return;
    }

    const getLabel = (name: string) => {
      const btn = document.querySelector<HTMLElement>(`[data-field="${name}"] button`);
      return btn?.innerText?.trim() || "";
    };
    const wardLabel = getLabel("WardId");
    const districtLabel = getLabel("DistrictId");
    const provinceLabel = getLabel("ProvinceId");
    const parts = [wardLabel, districtLabel, provinceLabel].filter(Boolean);
    setOriginalAddress(parts.join(", "));
    setSelectedDistrict(districtLabel);

    const result = await wardApi.getMergedTo(data.WardId);
    if (result && result.data) {
      if (result.data.length === 0) {
        toast.warning("Không tìm thấy dữ liệu");
      }
      setWards(result.data);
      setAgencyGroups(buildAgencyGroups(data.WardId, activeTags));
    }
  };

  const renderAddressFields = () => (
    <>
      <FloatingField
        label="Tỉnh/Thành phố"
        required
        filled={form.watch("ProvinceId") > 0}
        className="mb-4"
        error={form.formState.errors.ProvinceId?.message}
      >
        <div className={cbxFieldClass} data-field="ProvinceId">
          <ProvinceCbxField
            name="ProvinceId"
            hiddenLabel
            placeholder=""
            popoverModal={false}
            portalContainer={dialogBodyRef}
          />
        </div>
      </FloatingField>

      <FloatingField
        label="Quận/Huyện"
        required={!searchByNewAddress}
        filled={form.watch("DistrictId") > 0}
        className="mb-4"
        error={form.formState.errors.DistrictId?.message}
      >
        <div className={cbxFieldClass} data-field="DistrictId">
          <DistrictCbxField
            name="DistrictId"
            parentName="ProvinceId"
            hiddenLabel
            placeholder=""
            popoverModal={false}
            portalContainer={dialogBodyRef}
          />
        </div>
      </FloatingField>

      <FloatingField
        label="Phường/Xã"
        required
        filled={form.watch("WardId") > 0}
        className="mb-4"
        error={form.formState.errors.WardId?.message}
      >
        <div className={cbxFieldClass} data-field="WardId">
          <WardCbxField
            name="WardId"
            parentName={searchByNewAddress ? "ProvinceId" : "DistrictId"}
            isNew={searchByNewAddress}
            hiddenLabel
            placeholder=""
            popoverModal={false}
            portalContainer={dialogBodyRef}
          />
        </div>
      </FloatingField>
    </>
  );

  const renderAgencyDropdowns = () => (
    <>
      {AGENCY_DROPDOWN_FIELDS.map((field) => {
        const options = wardId > 0 ? getAgencyOptions(wardId, field) : [];
        return (
          <FloatingField
            key={field}
            label={field}
            required
            filled={!!agencySelections[field]}
            className="mb-4"
          >
            <Select
              value={agencySelections[field] ?? ""}
              onValueChange={(value) =>
                setAgencySelections((prev) => ({ ...prev, [field]: value }))
              }
              disabled={wardId <= 0}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px] border-neutral-200 p-1">
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg cursor-pointer text-sm text-neutral-950 focus:bg-[#E8F4FE] focus:text-[#0588F0] data-[state=checked]:bg-[#E8F4FE] data-[state=checked]:text-[#0588F0]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FloatingField>
        );
      })}

      <div className="flex flex-wrap items-center gap-2 mb-2">
        {AGENCY_TAGS.map((tag) => (
          <TagButton
            key={tag}
            label={tag}
            active={activeTags.has(tag)}
            onClick={() => toggleTag(tag)}
          />
        ))}
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent
        ref={dialogBodyRef}
        className="p-0 gap-0 sm:max-w-[960px] overflow-visible rounded-[10px]"
      >
        <div className="flex flex-col bg-white overflow-visible">

          {/* ── Header ── */}
          <div className="flex items-center self-stretch bg-white py-4 px-6 border-b border-neutral-200 rounded-tl-[10px] rounded-tr-[10px]">
            <span className="flex-1 text-neutral-950 text-lg font-bold">
              TRA CỨU THÔNG TIN
            </span>
          </div>

          <div className="flex flex-col self-stretch bg-white px-6 pt-4 pb-6 gap-6">

            {/* ── Tabs ── */}
            <div className="flex items-center self-stretch border-b border-neutral-200">
              <button
                type="button"
                className={`flex flex-1 items-center justify-center py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === "ward"
                    ? "border-[#0588F0] text-[#0588F0]"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
                onClick={() => setTab("ward")}
              >
                Chuyển đổi Phường/Xã
              </button>
              <button
                type="button"
                className={`flex flex-1 items-center justify-center py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === "agency"
                    ? "border-[#0588F0] text-[#0588F0]"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
                onClick={() => setTab("agency")}
              >
                Cơ quan hành chính
              </button>
            </div>

            {/* ── Two-column body ── */}
            <div className="flex items-start self-stretch gap-6">

              {/* ── LEFT ── */}
              <div className="flex flex-1 flex-col gap-6 min-w-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-neutral-950 text-sm font-bold mb-4">
                        Chọn địa chỉ cần chuyển đổi
                      </span>

                      <div className="flex items-center justify-between self-stretch bg-neutral-50 rounded-lg px-4 py-3 mb-4">
                        <span className="text-neutral-950 text-sm">
                          Tìm theo địa chỉ mới sau sáp nhập
                        </span>
                        <ToggleSwitch
                          checked={searchByNewAddress}
                          onChange={handleSearchModeChange}
                        />
                      </div>

                      {tab === "ward" ? renderAddressFields() : renderAgencyDropdowns()}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center self-stretch gap-3">
                      <button
                        type="button"
                        className="flex shrink-0 items-center bg-white text-left py-2 px-6 gap-2 rounded-[10px] border border-solid border-neutral-200 hover:bg-neutral-50 transition-colors"
                        onClick={handleReset}
                      >
                        <RefreshCw className="w-4 h-4 text-neutral-950" />
                        <span className="text-neutral-950 text-sm">Đặt lại</span>
                      </button>

                      <button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className={`flex flex-1 justify-center items-center py-2 gap-2 rounded-[10px] border-0 transition-colors
                          ${form.formState.isSubmitting
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-[#0588F0] hover:bg-[#0471cc]"
                          }`}
                      >
                        {form.formState.isSubmitting
                          ? <Loader2 className="w-4 h-4 animate-spin text-white" />
                          : <ArrowLeftRight className="w-4 h-4 text-white" />
                        }
                        <span className="text-white text-sm font-medium">Chuyển đổi ngay</span>
                      </button>
                    </div>
                  </form>
                </Form>
              </div>

              {/* ── RIGHT ── */}
              <div className="flex flex-1 flex-col items-start min-w-0">
                <span className="text-neutral-950 text-sm font-bold mb-4">
                  Kết quả chuyển đổi
                </span>

                {!hasResult && (
                  <div className="flex flex-col items-center justify-center self-stretch min-h-[280px] bg-white py-11 rounded-lg border border-solid border-neutral-200">
                    <span className="text-neutral-500 text-sm">
                      Kết quả sẽ hiển thị tại đây
                    </span>
                  </div>
                )}

                {hasResult && tab === "ward" && wards.map((ward) => (
                  <div
                    key={ward.WardId}
                    className="flex flex-col items-start self-stretch py-4 px-4 gap-3 rounded-lg border border-solid border-neutral-200"
                  >
                    <p className="text-neutral-950 text-sm m-0">
                      <span className="font-bold">Thông tin chuyển đổi: </span>
                      <span className="text-[#0588F0] font-medium">
                        {originalAddress || "—"}
                      </span>
                    </p>
                    <ul className="flex flex-col gap-2 list-none m-0 p-0 pl-1">
                      <li className="text-sm text-neutral-950">
                        <span className="text-[#0588F0] mr-2">•</span>
                        <span className="font-bold">Tên Phường / Xã mới: </span>
                        <span className="text-[#0588F0] font-medium">
                          Phường {ward.WardName}
                          {selectedDistrict ? `, ${selectedDistrict}` : ""}, Thành phố Hồ Chí Minh
                        </span>
                      </li>
                      <li className="text-sm text-neutral-950">
                        <span className="text-[#0588F0] mr-2">•</span>
                        <span className="font-bold">Sáp nhập từ: </span>
                        {ward.MergedFrom.join(", ")}
                      </li>
                    </ul>
                  </div>
                ))}

                {hasResult && tab === "agency" && (
                  <div className="flex flex-col items-start self-stretch gap-4 w-full">
                    {filteredAgencyGroups.length > 0 ? (
                      filteredAgencyGroups.map((group) => (
                        <AgencyCard key={group.label} group={group} />
                      ))
                    ) : (
                      <div className="flex flex-col items-center self-stretch bg-white py-6 rounded-lg border border-solid border-neutral-200">
                        <span className="text-neutral-500 text-sm">
                          {agencyGroups.length > 0
                            ? "Không tìm thấy cơ quan phù hợp với bộ lọc hiện tại."
                            : "Không có dữ liệu cơ quan cho lựa chọn phường hiện tại."}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="flex flex-col items-end self-stretch bg-white px-6 py-4 rounded-br-lg rounded-bl-lg border-t border-neutral-200 sm:justify-end">
          <DialogClose asChild>
            <button
              type="button"
              className="flex items-center bg-white py-2 px-4 rounded-[10px] border border-solid border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <span className="text-neutral-950 text-sm">Đóng</span>
            </button>
          </DialogClose>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default WardLookupDialog;