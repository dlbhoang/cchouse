"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Copy, Loader2, MapPin, RefreshCw, ArrowLeftRight } from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
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
import { Input } from "@/components/ui/input";
import DistrictCbxField from "@/components/ui/form-field/district-cbx";
import WardCbxField from "@/components/ui/form-field/ward-cbx";
import ProvinceCbxField from "@/components/ui/form-field/province-cbx";
import StreetCbxField from "@/components/ui/form-field/street-cbx";
import type { ISearchWardDto } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import wardApi from "@/services/api/wardApi";
import { WARD_AGENCIES_MAP } from "@/data/ward-agencies";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Tab = "before" | "after";

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

const DEFAULT_ACTIVE_TAGS = new Set<string>([
  "Văn phòng công chứng",
  "Văn phòng đất đai",
  "Chi cục thuế",
]);

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const schema = z.object({
  ProvinceId: z.coerce.number().min(1, { message: "Vui lòng chọn Tỉnh / Thành phố" }),
  DistrictId: z.coerce.number().min(1, { message: "Vui lòng chọn Quận / Huyện" }),
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
  "[&_button]:rounded-[10px]",
  "[&_button]:border",
  "[&_button]:border-neutral-200",
  "[&_button]:bg-white",
  "[&_button]:text-sm",
  "[&_button]:px-3",
  "[&_button]:py-0",
  "[&_button]:justify-start",
  "[&_button]:font-normal",
  "[&_button]:shadow-none",
  "[&_[role=combobox]]:w-full",
  "[&_[role=combobox]]:h-[42px]",
  "[&_[role=combobox]]:rounded-[10px]",
  "[&_[role=combobox]]:border-neutral-200",
  "[&_[role=combobox]]:bg-white",
  "[&_[role=combobox]]:text-sm",
  "[&_[role=combobox]]:px-3",
  "[&_[role=combobox]]:justify-start",
  "[&_[role=combobox]]:font-normal",
  "[&_[role=combobox]]:shadow-none",
  "[&_.form-item]:m-0",
  "[&_.form-item]:p-0",
  "w-full",
].join(" ");

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

// ─────────────────────────────────────────────
// FloatingField
// ─────────────────────────────────────────────
function FloatingField({
  label,
  required,
  children,
  className = "",
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={`flex flex-col items-start self-stretch relative ${className}`}>
      {children}
      <div className="flex flex-col items-start bg-white absolute top-[-8px] left-3 px-1 pointer-events-none z-10">
        <div className="flex items-center gap-[5px]">
          <span className="text-neutral-500 text-xs">{label}</span>
          {required && <span className="text-[#DC3E42] text-[10px]">*</span>}
        </div>
      </div>
      {error && (
        <span className="text-[#DC3E42] text-xs mt-1 ml-1">{error}</span>
      )}
    </div>
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
      className={
        active
          ? "flex flex-col shrink-0 items-start bg-blue-50 text-left py-1 px-4 rounded-[99px] border border-solid border-[#0588F0]"
          : "flex flex-col shrink-0 items-start bg-neutral-100 text-left py-1 px-4 rounded-[99px] border border-solid border-neutral-200"
      }
    >
      <span className={`text-sm ${active ? "text-[#0588F0]" : "text-neutral-950"}`}>
        {label}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────
// AgencyCard
// ─────────────────────────────────────────────
function AgencyCard({ group }: { group: AgencyGroup }) {
  return (
    <div className="flex flex-col items-start self-stretch py-4 pr-4 gap-4 rounded-lg border border-solid border-neutral-200">
      <span className="text-neutral-950 text-base font-bold ml-4">
        {group.label}
      </span>
      {group.items.map((item, i) => (
        <div key={i} className="flex items-center self-stretch ml-4 gap-[38px]">
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
          </div>
        </div>
      ))}
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
  const [tab, setTab] = useState<Tab>("before");
  const [agencySectionOpen, setAgencySectionOpen] = useState(true);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set(DEFAULT_ACTIVE_TAGS));
  const [agencyQuery, setAgencyQuery] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [wards, setWards] = useState<ISearchWardDto[]>([]);
  const [agencyGroups, setAgencyGroups] = useState<AgencyGroup[]>([]);
  const [originalAddress, setOriginalAddress] = useState<string>("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ProvinceId: 1,
      DistrictId: 0,
      WardId: 0,
    },
  });

  const hasResult = wards.length > 0;

  const filteredAgencyGroups = useMemo(() => {
    if (!agencyQuery.trim()) {
      return agencyGroups;
    }

    const query = agencyQuery.trim().toLowerCase();
    return agencyGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.address.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [agencyGroups, agencyQuery]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);

      const wardId = form.getValues("WardId");
      if (wardId > 0 && wards.length > 0) {
        setAgencyGroups(buildAgencyGroups(wardId, next));
      }

      return next;
    });
  };

  const handleReset = () => {
    form.reset({ ProvinceId: 1, DistrictId: 0, WardId: 0 });
    setWards([]);
    setAgencyGroups([]);
    setOriginalAddress("");
    setAgencyQuery("");
    setSelectedDistrict("");
  };

  const handleClose = () => {
    onClose();
    handleReset();
    setTab("before");
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    // Lấy text hiển thị từ các trigger button của Cbx fields
    const getLabel = (name: string) => {
      const btn = document.querySelector<HTMLElement>(`[data-field="${name}"] button`);
      return btn?.innerText?.trim() || "";
    };
    const streetLabel = getLabel("StreetId");
    const wardLabel = getLabel("WardId");
    const districtLabel = getLabel("DistrictId");
    const provinceLabel = getLabel("ProvinceId");
    const parts = [streetLabel, wardLabel, districtLabel, provinceLabel].filter(Boolean);
    setOriginalAddress(parts.join(", "));
    setSelectedDistrict(districtLabel);

    const result = await wardApi.getMergedTo(data.WardId);
    if (result && result.data) {
      if (result.data.length === 0) {
        toast.warning("Không tìm thấy dữ liệu");
      }
      setWards(result.data);
      setAgencyGroups(buildAgencyGroups(data.WardId, activeTags));
      setAgencyQuery("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 gap-0 sm:max-w-[900px] overflow-hidden rounded-[10px]">
        <div className="flex flex-col bg-white">

          {/* ── Header ── */}
          <div className="flex items-center self-stretch bg-white py-4 px-6 gap-[34px] rounded-tl-[10px] rounded-tr-[10px]">
            <div className="flex flex-1 flex-col items-start">
              <span className="text-neutral-950 text-lg font-bold">
                TRA CỨU THÔNG TIN
              </span>
            </div>
          </div>

          <div className="flex flex-col self-stretch bg-white p-6 gap-6">

            {/* ── Tabs ── */}
            <div className="flex items-center self-stretch border border-solid border-neutral-200">
              <button
                type="button"
                className={`flex flex-1 flex-col items-center text-left py-1.5 border-0 rounded transition-colors
                  ${tab === "before" ? "bg-neutral-950 text-white" : "bg-white text-neutral-950"}`}
                onClick={() => { setTab("before"); handleReset(); }}
              >
                <span className="text-sm">Trước sáp nhập</span>
              </button>
              <button
                type="button"
                className={`flex flex-1 flex-col items-center text-left py-1.5 border-0 rounded-tr rounded-br transition-colors
                  ${tab === "after" ? "bg-neutral-950 text-white rounded-[7px]" : "bg-white text-neutral-950"}`}
                onClick={() => { setTab("after"); handleReset(); }}
              >
                <span className="text-sm">Sau sáp nhập</span>
              </button>
            </div>

            {/* ── Two-column body ── */}
            <div className="flex items-start self-stretch gap-6">

              {/* ── LEFT ── */}
              <div className="flex flex-1 flex-col gap-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                    <div className="flex flex-col items-start self-stretch gap-0">
                      <span className="text-neutral-950 text-sm font-bold mb-6">
                        Chọn địa chỉ cần chuyển đổi
                      </span>

                      {/* Tỉnh/Thành phố */}
                      <FloatingField
                        label="Tỉnh/Thành phố"
                        required
                        className="mb-4"
                        error={form.formState.errors.ProvinceId?.message}
                      >
                        <div className={cbxFieldClass} data-field="ProvinceId">
                          <ProvinceCbxField name="ProvinceId" hiddenLabel />
                        </div>
                      </FloatingField>

                      {/* Quận/Huyện — only in "before" tab */}
                      {tab === "before" && (
                        <FloatingField
                          label="Quận/Huyện"
                          required
                          className="mb-4"
                          error={form.formState.errors.DistrictId?.message}
                        >
                          <div className={cbxFieldClass} data-field="DistrictId">
                            <DistrictCbxField
                              name="DistrictId"
                              parentName="ProvinceId"
                              hiddenLabel
                            />
                          </div>
                        </FloatingField>
                      )}

                      {/* Phường/Xã */}
                      <FloatingField
                        label="Phường/Xã"
                        required
                        className="mb-4"
                        error={form.formState.errors.WardId?.message}
                      >
                        <div className={cbxFieldClass} data-field="WardId">
                          <WardCbxField
                            name="WardId"
                            parentName="DistrictId"
                            hiddenLabel
                          />
                        </div>
                      </FloatingField>

                    
                    </div>

                    {/* Cơ quan khác */}
                    <div className="flex flex-col self-stretch gap-6">
                      <div
                        className="flex justify-between items-center self-stretch cursor-pointer"
                        onClick={() => setAgencySectionOpen((v) => !v)}
                      >
                        <span className="text-neutral-950 text-base font-bold">
                          Cơ quan khác
                        </span>
                        {agencySectionOpen
                          ? <ChevronUp className="w-6 h-6 text-neutral-500" />
                          : <ChevronDown className="w-6 h-6 text-neutral-500" />
                        }
                      </div>

                      {agencySectionOpen && (
                        <div className="flex flex-col items-start self-stretch pr-[13px] gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {AGENCY_TAGS.slice(0, 3).map((tag) => (
                              <TagButton
                                key={tag}
                                label={tag}
                                active={activeTags.has(tag)}
                                onClick={() => toggleTag(tag)}
                              />
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center self-stretch gap-2">
                            {AGENCY_TAGS.slice(3).map((tag) => (
                              <TagButton
                                key={tag}
                                label={tag}
                                active={activeTags.has(tag)}
                                onClick={() => toggleTag(tag)}
                              />
                            ))}
                          </div>

                          {hasResult && (
                            <div className="flex flex-col gap-2 w-full">
                              <Input
                                value={agencyQuery}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setAgencyQuery(event.target.value)}
                                placeholder="Tìm kiếm cơ quan hoặc địa chỉ"
                              />
                              <span className="text-sm text-muted-foreground">
                                Hiển thị cơ quan phù hợp với địa chỉ đã chọn ({selectedDistrict || "Quận/Huyện chưa chọn"}).
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center self-stretch gap-3">
                      <button
                        type="button"
                        className="flex shrink-0 items-center bg-white text-left py-2 px-[59px] gap-2 rounded-[10px] border border-solid border-neutral-200 hover:bg-neutral-50 transition-colors"
                        onClick={handleReset}
                      >
                        <RefreshCw className="w-4 h-4 text-neutral-950" />
                        <span className="text-neutral-950 text-base">Đặt lại</span>
                      </button>

                      <button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className={`flex flex-1 justify-center items-center text-left py-2 gap-2 rounded-[10px] border-0 transition-colors
                          ${form.formState.isSubmitting
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-[#0588F0] hover:bg-[#0471cc]"
                          }`}
                      >
                        {form.formState.isSubmitting
                          ? <Loader2 className="w-4 h-4 animate-spin text-white" />
                          : <ArrowLeftRight className="w-4 h-4 text-white" />
                        }
                        <span className="text-white text-base">Chuyển đổi ngay</span>
                      </button>
                    </div>
                  </form>
                </Form>
              </div>

              {/* ── RIGHT ── */}
              <div className="flex flex-1 flex-col items-start">
                <span className="text-neutral-950 text-sm font-bold mb-6">
                  Kết quả chuyển đổi
                </span>

                {/* Empty state */}
                {!hasResult && (
                  <div className="flex flex-col items-center self-stretch bg-white py-11 rounded-lg border border-solid border-neutral-200">
                    <span className="text-neutral-500 text-sm">
                      Kết quả sẽ hiển thị tại đây
                    </span>
                  </div>
                )}

                {/* Result state */}
                {hasResult && wards.map((ward) => (
                  <div key={ward.WardId} className="flex flex-col items-start self-stretch">

                    {/* Result summary box */}
                    <div className="flex flex-col items-start self-stretch py-4 pr-4 mb-8 gap-2 rounded-lg border border-solid border-neutral-200">
                      <div className="flex items-start self-stretch ml-4 gap-[5px]">
                        <span className="text-neutral-950 text-sm font-bold whitespace-nowrap">
                          Địa chỉ gốc:
                        </span>
                        <span className="flex-1 text-neutral-950 text-sm">
                          {originalAddress || "—"}
                        </span>
                      </div>
                      <div className="flex items-center ml-4 gap-[7px]">
                        <span className="text-neutral-950 text-sm font-bold">Kết quả:</span>
                        <span className="text-[#0588F0] text-sm font-bold">
                          Phường {ward.WardName}{selectedDistrict ? `, ${selectedDistrict}` : ""}, Thành phố Hồ Chí Minh
                        </span>
                      </div>
                      <div className="flex items-center self-stretch ml-4 gap-1.5">
                        <span className="text-neutral-950 text-sm font-bold whitespace-nowrap">
                          Sáp nhập từ:
                        </span>
                        <span className="text-neutral-950 text-sm">
                          {ward.MergedFrom.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Agency cards — rebuilt from local map, reactive to tag toggles */}
                    {filteredAgencyGroups.length > 0 ? (
                      <>
                        <span className="text-neutral-950 text-lg font-bold mb-2 whitespace-nowrap">
                          Thông tin Cơ quan khác
                        </span>
                        <div className="flex flex-col gap-2 mb-4">
                          <span className="text-sm text-neutral-500">
                            {activeTags.size === 1
                              ? `Đã chọn: ${Array.from(activeTags)[0]} tại ${selectedDistrict || "Quận/Huyện chưa chọn"}`
                              : `Lọc theo: ${Array.from(activeTags).join(", ")} — ${selectedDistrict || "Quận/Huyện chưa chọn"}`}
                          </span>
                          <span className="text-sm text-neutral-500">
                            Kết quả hiển thị theo địa chỉ gốc và loại cơ quan đã chọn.
                          </span>
                        </div>
                        <div className="flex flex-col items-start self-stretch gap-4">
                          {filteredAgencyGroups.map((group) => (
                            <AgencyCard key={group.label} group={group} />
                          ))}
                        </div>
                      </>
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
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="flex flex-col items-end self-stretch bg-white p-6 rounded-br-lg rounded-bl-lg border-t border-neutral-100 sm:justify-end">
          <DialogClose asChild>
            <button
              type="button"
              className="flex flex-col items-start bg-white text-left py-2 px-4 rounded-[10px] border border-solid border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <span className="text-neutral-950 text-base">Đóng</span>
            </button>
          </DialogClose>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default WardLookupDialog;