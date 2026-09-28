"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronDown,
  Copy,
  MapPin,
  RefreshCw,
  SearchX,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type {
  ISearchWardDto,
  IWardResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import { cn } from "@/lib/utils";
import { findWardAgencyData, WARD_AGENCIES } from "@/data/ward-agencies";
import wardApi from "@/services/api/wardApi";
import { WardLookupTabs } from "./ward-lookup-tabs";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface AgencyItem {
  name: string;
  address: string;
  legacyAreas?: string[];
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

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const schema = z.object({
  ProvinceId: z.coerce.number().min(1, { message: "Vui lòng chọn Tỉnh / Thành phố" }),
  DistrictId: z.coerce.number(),
  WardId: z.coerce.number().min(1, { message: "Vui lòng chọn Phường / Xã" }),
});
type AddressFormValues = z.infer<typeof schema>;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const cbxFieldClass = [
  "[&_button]:w-full",
  "[&_button]:h-[42px]",
  "[&_button]:min-h-[42px]",
  "[&_button]:max-h-[42px]",
  "[&_button]:rounded-md",
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
  "[&_[role=combobox]]:rounded-md",
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
  "[&_.form-message]:hidden",
  "w-full",
].join(" ");

function getLegacyAreaAliases(mergedFrom: string[]): string[] {
  return [...new Set(mergedFrom.flatMap((source) => {
    const districtMatch = source.match(/\((Q\s*\d+)\)/i);
    const district = districtMatch?.[1]?.replace(/\s+/g, " ").replace(/^Q/i, "Quận ");
    const wardList = source
      .replace(/^một phần\s+/i, "")
      .replace(/\s*\(Q\s*\d+\)/i, "")
      .trim();
    const aliases = [source];
    if (district && /^P\s*\d+(?:\s*,\s*P\s*\d+)*$/i.test(wardList)) {
      aliases.push(...wardList.split(",").map((ward) =>
        `Phường ${ward.replace(/^P\s*/i, "").trim()}, ${district} cũ`
      ));
    } else if (district && wardList) {
      aliases.push(`${wardList}, ${district} cũ`);
    }
    return aliases;
  }))];
}

function buildAllAgencyGroups(preferredWard?: (typeof WARD_AGENCIES)[number]): AgencyGroup[] {
  return AGENCY_TAGS.map((tag) => {
    const uniqueItems = new Map<string, { item: AgencyItem; preferred: boolean }>();
    WARD_AGENCIES.forEach((ward) => (ward.Agencies[tag] ?? []).forEach((item) => {
      const key = `${item.name}|${item.address}`;
      const existing = uniqueItems.get(key);
      uniqueItems.set(key, {
        item: {
          name: item.name,
          address: item.address,
          legacyAreas: [...new Set([...(existing?.item.legacyAreas ?? []), ...getLegacyAreaAliases(ward.MergedFrom)])],
        },
        preferred: Boolean(existing?.preferred || preferredWard?.WardId === ward.WardId),
      });
    }));
    const items = [...uniqueItems.values()]
      .sort((a, b) => Number(b.preferred) - Number(a.preferred))
      .map(({ item }) => item);
    return { label: tag, items };
  }).filter((group) => group.items.length > 0);
}

function findAgencyWardFromLegacyAddress(wardName: string, districtName: string) {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .toLowerCase()
      .replace(/^(phuong|xa|dac khu)\s+/i, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const ward = normalize(wardName);
  const numericWard = ward.match(/(?:^|\s)p\s*0*(\d+)(?:\s|$)/)?.[1]
    ?? (/^\d+$/.test(ward) ? ward : undefined);
  const district = normalize(districtName);
  const numericDistrict = district.match(/(?:^|\s)(?:quan|q)\s*0*(\d+)(?:\s|$)/)?.[1];
  if (!ward) return undefined;

  const matchingWards = WARD_AGENCIES.filter((candidate) =>
    candidate.MergedFrom.some((source) => {
      const normalizedSource = normalize(source);
      const matchesWard = numericWard
        ? new RegExp(`(?:^|\\s)p\\s*0*${numericWard}(?:\\s|$)`).test(normalizedSource)
        : normalizedSource.includes(ward);
      const matchesDistrict = !numericDistrict || new RegExp(
        `(?:^|\\s)q\\s*0*${numericDistrict}(?:\\s|$)`
      ).test(normalizedSource);
      return matchesWard && matchesDistrict;
    })
  );

  return matchingWards.length === 1 ? matchingWards[0] : undefined;
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
          "group/float relative w-full rounded-xl bg-white border transition-[border-color] duration-200",
          isError
            ? "border-[#EF4444]"
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
            // ── ẩn toàn bộ error/message bên trong box ──
            "[&_.form-message]:hidden",
            "[&_[role=alert]]:hidden",
            "[&_.text-destructive]:hidden",
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
              ? "text-[#EF4444] group-focus-within/float:text-[#EF4444] group-has-[button[data-state=open]]/float:text-[#EF4444]"
              : "group-focus-within/float:text-[#0588F0] group-has-[button[data-state=open]]/float:text-[#0588F0]"
          )}
        >
          <span>{label}</span>
          {required && (
            <span className="text-[#EF4444] text-[10px] leading-none">*</span>
          )}
        </div>
      </div>

      {/* ── Error bên ngoài box ── */}
      {error && (
        <span className="text-[#EF4444] text-xs mt-1 ml-1">{error}</span>
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
// AgencyCard
// ─────────────────────────────────────────────
function AgencyCard({ group }: { group: AgencyGroup }) {
  const showMapPin = group.label !== "Chi cục thuế";
  const showAgencyName = group.label !== "Ủy ban nhân dân phường";

  return (
    <div className="flex flex-col items-start self-stretch py-4 px-4 gap-3 rounded-lg border border-solid border-neutral-200 bg-white">
      <span className="text-neutral-950 text-base font-bold font-[family-name:var(--font-inter,Inter,sans-serif)]">{group.label}</span>
      <ul className="flex flex-col self-stretch gap-3 list-none m-0 p-0">
        {group.items.map((item, i) => (
          <li key={i} className="flex items-start self-stretch gap-3">
            <span className="text-[#0588F0] text-sm mt-0.5">•</span>
            <span className="flex-1 text-neutral-950 text-sm">
              {showAgencyName && <><span className="font-semibold">{item.name}:</span>{" "}</>}
              {item.address}
            </span>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                aria-label="Sao chép địa chỉ"
                className="text-neutral-950 hover:text-neutral-600 transition-colors"
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
                  className="text-neutral-950 hover:text-neutral-600 transition-colors"
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

function AgencyCombobox({
  agencyType,
  items,
  value,
  disabled,
  portalContainer,
  onChange,
}: {
  agencyType: string;
  items: AgencyItem[];
  value: string[];
  disabled: boolean;
  portalContainer: React.RefObject<HTMLElement | null>;
  onChange: (value: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedItems = value.map((index) => items[Number(index)]).filter(Boolean);

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="justify-between text-left min-w-0 disabled:opacity-100"
        >
          <span className={cn("truncate flex-1", selectedItems.length === 0 && "text-neutral-400")}>
            {selectedItems.length === 0
              ? "Chọn"
              : selectedItems.length === 1
                ? selectedItems[0].name
                : `Đã chọn ${selectedItems.length} cơ quan`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        container={portalContainer.current}
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <Command>
          <CommandInput placeholder="Tìm cơ quan hoặc địa chỉ cũ..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center gap-2">
                <SearchX className="h-8 w-8 text-muted-foreground" />
                Không tìm thấy dữ liệu.
              </div>
            </CommandEmpty>
            <CommandGroup>
              {items.map((item, index) => (
                <CommandItem
                  key={`${agencyType}-${item.name}-${index}`}
                  value={item.name}
                  keywords={[item.address, ...(item.legacyAreas ?? [])]}
                  className="cursor-pointer rounded-lg data-[selected=true]:bg-[#E8F4FE] data-[selected=true]:text-[#0588F0]"
                  onSelect={() => {
                    const itemIndex = String(index);
                    onChange(value.includes(itemIndex)
                      ? value.filter((selectedIndex) => selectedIndex !== itemIndex)
                      : [...value, itemIndex]);
                  }}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{item.name}</span>
                    {!!item.legacyAreas?.length && (
                      <span className="truncate text-xs font-normal text-neutral-500">
                        Khu vực cũ liên quan: {item.legacyAreas.slice(0, 2).join("; ")}
                      </span>
                    )}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 shrink-0",
                      value.includes(String(index)) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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
  const [searchByNewAddress, setSearchByNewAddress] = useState(false);
  const [availableAgencyGroups, setAvailableAgencyGroups] = useState<AgencyGroup[]>([]);
  const [agencyGroups, setAgencyGroups] = useState<AgencyGroup[]>([]);
  const [conversionWards, setConversionWards] = useState<ISearchWardDto[]>([]);
  const [conversionAddress, setConversionAddress] = useState("");
  const [selectedAgencyItems, setSelectedAgencyItems] = useState<Record<string, string[]>>({});
  const dialogBodyRef = useRef<HTMLDivElement>(null);

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ProvinceId: 1,
      DistrictId: 0,
      WardId: 0,
    },
  });
  const selectedWardId = addressForm.watch("WardId");
  const selectedDistrictId = addressForm.watch("DistrictId");
  const agencyLookupKey = searchByNewAddress ? selectedWardId : selectedDistrictId;

  useEffect(() => {
    let active = true;
    setConversionWards([]);
    setConversionAddress("");

    if (Number(selectedWardId) < 1 || (!searchByNewAddress && Number(selectedDistrictId) < 1)) {
      return () => { active = false; };
    }

    const resolveSelectedAddress = async () => {
      try {
        const selectedWardName =
          document
            .querySelector<HTMLElement>('[data-field="address-WardId"] button')
            ?.innerText?.trim() ?? "";
        const districtName = !searchByNewAddress
          ? document.querySelector<HTMLElement>('[data-field="address-DistrictId"] button')?.innerText?.trim() ?? ""
          : "";
        const address = [
          selectedWardName,
          districtName,
          document.querySelector<HTMLElement>('[data-field="address-ProvinceId"] button')?.innerText?.trim() ?? "",
        ].filter(Boolean).join(", ");
        setConversionAddress(address);

        const directWard = findWardAgencyData(Number(selectedWardId), selectedWardName);
        const localWard = searchByNewAddress
          ? directWard
          : directWard ?? findAgencyWardFromLegacyAddress(selectedWardName, districtName);

        let resolvedWard: {
          WardId: number;
          WardName: string;
          UBNDAddress: string;
          MergedFrom: string[];
        } | undefined = localWard;
        if (!resolvedWard && !searchByNewAddress) {
          const response = await wardApi.getMergedTo(Number(selectedWardId));
          const apiWard = (Array.isArray(response.data) ? response.data[0] : response.data) as
            | (Partial<ISearchWardDto> & Partial<IWardResponse>)
            | undefined;
          if (apiWard) {
            const wardId = apiWard.WardId ?? apiWard.Id;
            const wardName = apiWard.WardName ?? apiWard.Name;
            const agencyData = findWardAgencyData(wardId, wardName);
            resolvedWard = agencyData ?? (wardId && wardName ? {
              WardId: wardId,
              WardName: wardName,
              UBNDAddress: apiWard.Headquarters ?? "",
              MergedFrom: apiWard.MergedFrom ?? [],
            } : undefined);
          }
        }

        if (active && resolvedWard) {
          setConversionWards([{
            WardId: resolvedWard.WardId,
            WardName: resolvedWard.WardName,
            Headquarters: resolvedWard.UBNDAddress,
            MergedFrom: resolvedWard.MergedFrom,
          }]);
        }

      } catch {
        if (active) {
          setConversionWards([]);
        }
      }
    };

    void resolveSelectedAddress();
    return () => { active = false; };
  }, [selectedWardId, selectedDistrictId, searchByNewAddress]);

  useEffect(() => {
    setAvailableAgencyGroups([]);
    setAgencyGroups([]);
    setSelectedAgencyItems({});
    if (!searchByNewAddress && Number(selectedDistrictId) > 0) {
      const districtName = document.querySelector<HTMLElement>('[data-field="address-DistrictId"] button')?.innerText?.trim() ?? "";
      const wardName = document.querySelector<HTMLElement>('[data-field="address-WardId"] button')?.innerText?.trim() ?? "";
      const oldAddressMatch = Number(selectedWardId) > 0
        ? findAgencyWardFromLegacyAddress(wardName, districtName)
        : undefined;
      const convertedAddressMatch = conversionWards[0]
        ? findWardAgencyData(undefined, conversionWards[0].WardName)
        : undefined;
      setAvailableAgencyGroups(buildAllAgencyGroups(oldAddressMatch ?? convertedAddressMatch));
    } else if (searchByNewAddress && Number(selectedWardId) > 0) {
      const wardName = document.querySelector<HTMLElement>('[data-field="address-WardId"] button')?.innerText?.trim() ?? "";
      const ward = findWardAgencyData(undefined, wardName)
        ?? findWardAgencyData(Number(selectedWardId), wardName);
      setAvailableAgencyGroups(buildAllAgencyGroups(ward));
    }
  }, [agencyLookupKey, searchByNewAddress, conversionWards]);

  useEffect(() => {
    setAgencyGroups(availableAgencyGroups);
  }, [availableAgencyGroups]);

  const handleConversionModeChange = (checked: boolean) => {
    setSearchByNewAddress(checked);
    addressForm.reset({ ProvinceId: 1, DistrictId: 0, WardId: 0 });
    setConversionWards([]);
    setConversionAddress("");
    setAvailableAgencyGroups([]);
    setAgencyGroups([]);
    setSelectedAgencyItems({});
  };

  const handleReset = () => {
    addressForm.reset({ ProvinceId: 1, DistrictId: 0, WardId: 0 });
    setSearchByNewAddress(false);
    setConversionWards([]);
    setConversionAddress("");
    setAvailableAgencyGroups([]);
    setAgencyGroups([]);
    setSelectedAgencyItems({});
  };

  const handleClose = () => {
    onClose();
    handleReset();
  };

  const renderAddressFields = (isNewAddress: boolean) => (
    <>
      <FloatingField
        label="Tỉnh/Thành phố"
        required
        filled={addressForm.watch("ProvinceId") > 0}
        className="mb-4"
        error={addressForm.formState.errors.ProvinceId?.message}
      >
        <div className={cbxFieldClass} data-field="address-ProvinceId">
          <ProvinceCbxField
            name="ProvinceId"
            hiddenLabel
            placeholder=""
            popoverModal={false}
            portalContainer={dialogBodyRef}
          />
        </div>
      </FloatingField>

      {!isNewAddress && (
        <FloatingField
          label="Quận/Huyện"
          required
          filled={addressForm.watch("DistrictId") > 0}
          className="mb-4"
          error={addressForm.formState.errors.DistrictId?.message}
        >
          <div className={cbxFieldClass} data-field="address-DistrictId">
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
      )}

      <FloatingField
        label="Phường/Xã"
        required
        filled={addressForm.watch("WardId") > 0}
        className="mb-4"
        error={addressForm.formState.errors.WardId?.message}
      >
        <div className={cbxFieldClass} data-field="address-WardId">
          <WardCbxField
            name="WardId"
            parentName={isNewAddress ? "ProvinceId" : "DistrictId"}
            isNew={isNewAddress}
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
      {AGENCY_DROPDOWN_FIELDS.map((agencyType) => {
        const group = availableAgencyGroups.find((item) => item.label === agencyType);
        const items = group?.items ?? [];

        return (
          <FloatingField
            key={agencyType}
            label={agencyType}
            required
            filled
            className="mb-4"
          >
            <div className={cbxFieldClass}>
              <AgencyCombobox
                agencyType={agencyType}
                items={items}
                value={selectedAgencyItems[agencyType] ?? []}
                disabled={items.length === 0}
                portalContainer={dialogBodyRef}
                onChange={(value) =>
                  setSelectedAgencyItems((current) => ({
                    ...current,
                    [agencyType]: value,
                  }))
                }
              />
            </div>
          </FloatingField>
        );
      })}
    </>
  );

  const selectedAgencyResults = agencyGroups.flatMap((group) => {
    const selectedIndices = selectedAgencyItems[group.label] ?? [];
    const items = selectedIndices
      .map((index) => group.items[Number(index)])
      .filter(Boolean);
    return items.length > 0 ? [{ ...group, items }] : [];
  });
  const hasSelectedAgencies = selectedAgencyResults.length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent
        ref={dialogBodyRef}
        overlayClassName="bg-black/30"
        className="p-0 gap-0 w-[1152px] max-w-[calc(100vw-32px)] max-h-[calc(100dvh-32px)] flex flex-col overflow-visible rounded-xl"
      >
        <div className="flex flex-1 min-h-0 flex-col bg-white overflow-visible">

          {/* ── Header ── */}
          <div className="flex items-center self-stretch bg-white py-4 px-6 border-b border-neutral-200 rounded-tl-xl rounded-tr-xl">
            <span className="flex-1 text-neutral-950 text-lg font-bold font-[family-name:var(--font-inter,Inter,sans-serif)]">
              TRA CỨU THÔNG TIN
            </span>
          </div>

          <div className="border-b border-neutral-200 px-6">
            <WardLookupTabs />
          </div>

          <div className="flex flex-1 min-h-0 flex-col self-stretch bg-white px-6 pt-4 pb-6 gap-6 overflow-hidden">

            {/* ── Two-column body ── */}
            <div className="flex flex-1 min-h-0 items-stretch self-stretch gap-6 max-md:flex-col max-md:overflow-y-auto">

              {/* ── LEFT ── */}
              <div className="flex flex-1 flex-col min-w-0 min-h-0 max-md:min-h-[360px]">
                <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400">
                  <Form {...addressForm}>
                    <div className="flex flex-col">
                      <span className="mb-4 text-sm font-bold text-neutral-950 font-[family-name:var(--font-inter,Inter,sans-serif)]">
                        Chọn địa chỉ và cơ quan cần tra cứu
                      </span>
                      <div className="mb-4 flex h-10 items-center justify-between self-stretch rounded-[6px] border border-[#E5E5E5] bg-[linear-gradient(90deg,_var(--Neutral-Gray-3,_#E5E5E5)_0%,_var(--Neutral-White,_#FFF)_100%)] px-2">
                        <span className="text-sm text-neutral-950 font-[family-name:var(--font-inter,Inter,sans-serif)]">Tìm theo địa chỉ mới sau sáp nhập</span>
                        <ToggleSwitch checked={searchByNewAddress} onChange={handleConversionModeChange} />
                      </div>
                      {renderAddressFields(searchByNewAddress)}
                      {renderAgencyDropdowns()}
                      <div className="mt-1 flex items-center self-stretch">
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-neutral-200 bg-white px-6 py-2 text-left transition-colors hover:bg-neutral-50 font-[family-name:var(--font-inter,Inter,sans-serif)]"
                          onClick={handleReset}
                        >
                          <RefreshCw className="h-4 w-4 text-neutral-950" />
                          <span className="text-base font-medium text-neutral-950">Đặt lại</span>
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>

              {/* ── RIGHT ── */}
              <div className="flex flex-1 min-w-0 min-h-0 flex-col">
                <span className="mb-4 text-sm font-bold text-neutral-950 font-[family-name:var(--font-inter,Inter,sans-serif)]">
                  Kết quả
                </span>

                <div className="flex-1 min-h-0 w-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400">
                  {conversionWards.length === 0 && !hasSelectedAgencies && (
                    <div className="flex min-h-[280px] flex-col items-center justify-center self-stretch rounded-xl border border-solid border-neutral-200 bg-white py-11">
                      <Image
                        src="/icon.png"
                        alt="Search icon"
                        width={100}
                        height={100}
                        className="mb-4"
                      />
                      <span className="text-sm text-neutral-500">Kết quả sẽ hiển thị tại đây</span>
                    </div>
                  )}

                  {conversionWards.length > 0 && (
                    <div className="flex w-full flex-col gap-4">
                      <h3 className="m-0 text-sm font-bold text-neutral-950">Kết quả chuyển đổi</h3>
                      {conversionWards.map((ward) => (
                        <div key={ward.WardId} className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4">
                          <div className="text-sm text-neutral-950">
                            <span className="mr-2 text-[#0588F0]">•</span>
                            <span className="font-semibold">{searchByNewAddress ? "Phường/Xã mới: " : "Địa chỉ cũ: "}</span>
                            <span className="font-semibold text-[#0588F0]">{conversionAddress || ward.WardName}</span>
                          </div>
                          <div className="text-sm text-neutral-950">
                            <span className="mr-2 text-[#0588F0]">•</span>
                            <span className="font-semibold">{searchByNewAddress ? "Địa chỉ cũ: " : "Phường/Xã mới: "}</span>
                            {searchByNewAddress
                              ? ward.MergedFrom.join(", ")
                              : `Phường ${ward.WardName}, Thành phố Hồ Chí Minh`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {hasSelectedAgencies && (
                    <div className="flex w-full flex-col items-start self-stretch gap-4">
                      <h3 className="m-0 text-sm font-bold text-neutral-950">Kết quả tra cứu cơ quan</h3>
                      {selectedAgencyResults.map((group) => (
                        <AgencyCard key={group.label} group={group} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="flex flex-col items-end self-stretch bg-white px-6 py-4 rounded-br-xl rounded-bl-xl border-t border-neutral-200 sm:justify-end">
          <DialogClose asChild>
            <button
              type="button"
              className="flex items-center bg-white py-2 px-4 rounded-[10px] border border-solid border-neutral-200 hover:bg-neutral-50 transition-colors font-[family-name:var(--font-inter,Inter,sans-serif)]"
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
