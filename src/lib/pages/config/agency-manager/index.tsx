"use client";

import { ChevronDown, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WARD_AGENCIES, type AgencyMap, type WardAgencyData } from "@/data/ward-agencies";
import type { IDistrictResponse, IProvinceResponse, IStreetResponse, IWardResponse } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import districtApi from "@/services/api/districtApi";
import lookupApi from "@/services/api/lookupApi";
import provinceApi from "@/services/api/provinceApi";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";

type AgencyType = keyof AgencyMap;
type AgencyRecord = { type: AgencyType; name: string; address: string; oldAddress?: string };
type AgencyAddressOption = Pick<IWardResponse, "Id" | "Name" | "Type">;
type OldAddressOption = { address: string; wardId: number; district: string };

const agencyTypes = Object.keys(WARD_AGENCIES[0]?.Agencies ?? {}) as AgencyType[];
const emptyAgencyMap = (): AgencyMap => ({
  "Văn phòng công chứng": [],
  "Văn phòng đất đai": [],
  "Chi cục thuế": [],
  "Ủy ban nhân dân phường": [],
  "Tòa án": [],
  "Sở tư pháp": [],
  "Thừa phát lại": [],
});

const withAddressType = (type: string, name: string) =>
  name.toLocaleLowerCase("vi").startsWith(type.toLocaleLowerCase("vi")) ? name : `${type} ${name}`.trim();

const flattenWard = (ward: WardAgencyData): AgencyRecord[] =>
  agencyTypes.flatMap((type) => (ward.Agencies[type] ?? []).map((agency) => ({ type, ...agency })));

const normalizeAddressName = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/đ/gi, "d")
  .replace(/^(phuong|xa|dac khu)\s+/i, "")
  .trim()
  .toLocaleLowerCase("vi");

const formatOldDistrictLabel = (district: string) => {
  const value = district.trim();
  const cleanSuffix = value.replace(/-(?:BD|BRVT)$/i, "");
  if (/^Q\s*\d+$/i.test(value)) return `Quận ${value.replace(/^Q\s*/i, "")}`;
  if (/^H\./i.test(value)) return `Huyện ${cleanSuffix.replace(/^H\./i, "")}`;
  if (/^TP\s+/i.test(value)) return `Thành phố ${cleanSuffix.replace(/^TP\s+/i, "")}`;
  if (value === "TDM-BD") return "Thành phố Thủ Dầu Một";
  if (["Dĩ An-BD", "Thuận An-BD", "Bến Cát-BD"].includes(value)) return `Thành phố ${cleanSuffix}`;
  if (["Bình Tân", "Bình Thạnh", "Gò Vấp", "Phú Nhuận", "Tân Bình", "Tân Phú"].includes(value)) return `Quận ${value}`;
  if (["Bình Chánh", "Cần Giờ", "Củ Chi", "Hóc Môn", "Nhà Bè"].includes(value)) return `Huyện ${value}`;
  if (value === "Thủ Đức") return "Thành phố Thủ Đức";
  if (value === "BRVT") return "Bà Rịa - Vũng Tàu";
  if (/-BD$/i.test(value)) return `Huyện ${cleanSuffix}`;
  return value;
};

const oldDistrictSortRank = (label: string) =>
  label.startsWith("Quận ") ? 0 : label.startsWith("Thành phố ") ? 1 : label.startsWith("Huyện ") ? 2 : 3;

const convertAgencyAddressToOld = (newAddress: string, wards: WardAgencyData[], fallbackWardName?: string) => {
  const parts = newAddress.split(",").map((part) => part.trim()).filter(Boolean);
  const streetAddress = parts[0];
  const currentWardName = parts.find((part) => /^(phường|xã|đặc khu)\s+/i.test(part)) ?? fallbackWardName;
  const currentWard = currentWardName
    ? wards.find((ward) => normalizeAddressName(ward.WardName) === normalizeAddressName(currentWardName))
    : undefined;
  const legacyLabel = currentWard?.MergedFrom[0];
  const match = legacyLabel?.match(/^(.*?)\s*\(([^)]+)\)/);
  if (!streetAddress || !match) return undefined;

  const oldWardName = match[1].trim();
  const legacyArea = match[2].trim();
  const oldWardAddressName = /^xã\s+/i.test(oldWardName)
    ? oldWardName
    : /^TT\s+/i.test(oldWardName)
      ? `thị trấn ${oldWardName.replace(/^TT\s+/i, "")}`
      : withAddressType("phường", oldWardName);
  const plainDistricts = new Set(["Bình Tân", "Bình Thạnh", "Gò Vấp", "Phú Nhuận", "Tân Bình", "Tân Phú"]);
  const plainCounties = new Set(["Bình Chánh", "Củ Chi", "Hóc Môn", "Nhà Bè", "Cần Giờ"]);
  const oldDistrictName = /^Q\s*\d+$/i.test(legacyArea)
    ? `Quận ${legacyArea.replace(/^Q\s*/i, "")}`
    : /^H\./i.test(legacyArea)
      ? `Huyện ${legacyArea.replace(/^H\./i, "").replace(/-BRVT$/i, "")}`
      : plainDistricts.has(legacyArea)
        ? `Quận ${legacyArea}`
        : plainCounties.has(legacyArea)
          ? `Huyện ${legacyArea}`
          : legacyArea === "Thủ Đức"
            ? "Thành phố Thủ Đức"
            : legacyArea.replace(/-BD$/i, "").replace(/-BRVT$/i, "");
  const provinceName = parts.find((part) => /^(TP\.?|Thành phố)\s+/i.test(part)) ?? "TP. Hồ Chí Minh";

  return [streetAddress, oldWardAddressName, oldDistrictName, provinceName].join(", ");
};

function AgencyFloatingField({
  id,
  label,
  required = false,
  filled = false,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  filled?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="group/agency-field relative">
      {children}
      <label
        htmlFor={id}
        aria-hidden="true"
        className={`pointer-events-none absolute left-3 z-10 flex -translate-y-1/2 items-center gap-1 bg-white px-1 transition-all duration-200 ease-out group-focus-within/agency-field:top-0 group-focus-within/agency-field:text-xs group-focus-within/agency-field:text-[#0588f0] ${
          filled ? "top-0 text-xs text-neutral-600" : "top-1/2 text-sm text-neutral-500"
        }`}
      >
        <span>{label}</span>
        {required && <span className="text-[10px] leading-none text-red-500">*</span>}
      </label>
    </div>
  );
}

export default function AgencyManagerPage() {
  const [wards, setWards] = useState<WardAgencyData[]>([]);
  const [selectedWardId, setSelectedWardId] = useState<number>();
  const [expandedCity, setExpandedCity] = useState(true);
  const [expandedOldCity, setExpandedOldCity] = useState(false);
  const [selectedOldAddress, setSelectedOldAddress] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"new" | "old">("new");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AgencyRecord>();
  const [editing, setEditing] = useState<AgencyRecord>();
  const [editingWardId, setEditingWardId] = useState<number>();
  const [formWardId, setFormWardId] = useState<number>();
  const [streetOptions, setStreetOptions] = useState<IStreetResponse[]>([]);
  const [streetName, setStreetName] = useState("");
  const [provinceOptions, setProvinceOptions] = useState<IProvinceResponse[]>([]);
  const [provinceDistricts, setProvinceDistricts] = useState<IDistrictResponse[]>([]);
  const [configuredWardOptions, setConfiguredWardOptions] = useState<IWardResponse[]>([]);
  const [oldWardOptions, setOldWardOptions] = useState<IWardResponse[]>([]);
  const [oldDistrictId, setOldDistrictId] = useState<number>();
  const [oldWardId, setOldWardId] = useState<number>();
  const [provinceId, setProvinceId] = useState<number>();
  const [form, setForm] = useState<AgencyRecord>({ type: "Văn phòng công chứng", name: "", address: "" });

  useEffect(() => {
    let active = true;
    lookupApi.getWardAgencies().then((response) => {
      if (!active) return;
      const data = Array.isArray(response.data) && response.data.length ? response.data : WARD_AGENCIES;
      setWards(data);
      setSelectedWardId((current) => current ?? data[0]?.WardId);
    }).catch(() => {
      if (!active) return;
      setWards(WARD_AGENCIES);
      setSelectedWardId((current) => current ?? WARD_AGENCIES[0]?.WardId);
    });
    return () => { active = false; };
  }, []);

  const selectedWard = wards.find((ward) => ward.WardId === selectedWardId);
  const linkedProvinceWardOptions = configuredWardOptions.filter((ward) =>
    provinceDistricts.some((district) => district.Id === ward.DistrictId)
  ).map(({ Id, Name, Type }) => ({ Id, Name, Type }));
  const selectedProvince = provinceOptions.find((province) => province.Id === provinceId);
  const provinceWardOptions: AgencyAddressOption[] = linkedProvinceWardOptions.length
    ? linkedProvinceWardOptions
    : selectedProvince?.Name.toLocaleLowerCase("vi").includes("hồ chí minh")
      ? configuredWardOptions.length
        ? configuredWardOptions.map(({ Id, Name, Type }) => ({ Id, Name, Type }))
        : WARD_AGENCIES.map((ward) => ({ Id: ward.WardId, Name: ward.WardName, Type: ward.WardType }))
      : [];
  const selectedFormWardOption = provinceWardOptions.find((ward) => ward.Id === formWardId);
  const oldDistrictOptions = provinceDistricts;
  const formWard = wards.find((ward) => ward.WardId === formWardId)
    ?? WARD_AGENCIES.find((ward) => ward.WardId === formWardId)
    ?? (selectedFormWardOption ? {
      WardId: selectedFormWardOption.Id,
      WardName: selectedFormWardOption.Name.replace(/^(phường|xã|đặc khu)\s+/i, ""),
      WardType: (/xã/i.test(selectedFormWardOption.Type) ? "xã" : /đặc khu/i.test(selectedFormWardOption.Type) ? "đặc khu" : "phường") as WardAgencyData["WardType"],
      UBNDAddress: "",
      MergedFrom: [],
      Agencies: emptyAgencyMap(),
    } : undefined);

  useEffect(() => {
    if (!dialogOpen) return;
    let active = true;
    Promise.all([
      provinceApi.get({ pageIndex: 1, pageSize: 10000 }),
      wardApi.get({ pageIndex: 1, pageSize: 10000, IsNew: true }),
    ]).then(([provincesResponse, wardsResponse]) => {
      if (!active) return;
      const provinceRows = provincesResponse.data ?? [];
      setProvinceOptions(provinceRows);
      setConfiguredWardOptions(wardsResponse.data ?? []);
      const hcm = provinceRows.find((province) => province.Name.toLocaleLowerCase("vi").includes("hồ chí minh"));
      setProvinceId((current) => current ?? hcm?.Id ?? provinceRows[0]?.Id);
    }).catch(() => {
      if (!active) return;
      setProvinceOptions([]);
      setConfiguredWardOptions([]);
    });
    return () => { active = false; };
  }, [dialogOpen]);

  useEffect(() => {
    if (!dialogOpen || !provinceId) {
      setProvinceDistricts([]);
      return;
    }
    let active = true;
    districtApi.get({ pageIndex: 1, pageSize: 10000, ProvinceId: provinceId }).then((response) => {
      if (active) setProvinceDistricts(response.data ?? []);
    }).catch(() => {
      if (active) setProvinceDistricts([]);
    });
    return () => { active = false; };
  }, [dialogOpen, provinceId]);

  useEffect(() => {
    if (!dialogOpen || mode !== "old" || !oldDistrictOptions.length) return;
    const legacyDistrictNumber = selectedOldAddress.match(/\(Q(\d+)\)/)?.[1];
    const legacyDistrict = legacyDistrictNumber
      ? oldDistrictOptions.find((district) => new RegExp(`quận\\s*${legacyDistrictNumber}(?!\\d)`, "i").test(district.Name))
      : undefined;
    setOldDistrictId((current) => oldDistrictOptions.some((district) => district.Id === current)
      ? current
      : legacyDistrict?.Id ?? oldDistrictOptions[0]?.Id);
  }, [dialogOpen, mode, oldDistrictOptions, selectedOldAddress]);

  useEffect(() => {
    if (!dialogOpen || mode !== "new" || !formWardId) {
      setStreetOptions([]);
      return;
    }

    let active = true;
    streetApi.get({ pageIndex: 1, pageSize: 10000, WardId: formWardId, IsNew: true })
      .then((response) => {
        if (!active) return;
        const options = Array.isArray(response.data) ? response.data : [];
        setStreetOptions(options);

        if (editing && editingWardId === formWardId) {
          const originalAddress = editing.address.split(",")[0]?.trim() ?? "";
          const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi");
          const matchingStreet = options.find((street) => normalize(originalAddress).endsWith(normalize(street.Name)));
          if (matchingStreet) {
            setStreetName(matchingStreet.Name);
            setForm((current) => ({
              ...current,
              address: originalAddress.slice(0, originalAddress.length - matchingStreet.Name.length).trim(),
            }));
          }
        }
      })
      .catch(() => {
        if (active) setStreetOptions([]);
      });

    return () => { active = false; };
  }, [dialogOpen, editing, editingWardId, formWardId, mode]);

  useEffect(() => {
    if (!dialogOpen || mode !== "old" || !oldDistrictId) {
      if (mode !== "old") setOldWardOptions([]);
      return;
    }
    let active = true;
    Promise.all([
      wardApi.get({ pageIndex: 1, pageSize: 10000, DistrictId: oldDistrictId, IsNew: false }),
      streetApi.get({ pageIndex: 1, pageSize: 10000, DistrictId: oldDistrictId, IsNew: false }),
    ]).then(([wardsResponse, streetsResponse]) => {
      if (!active) return;
      const wardOptions = wardsResponse.data ?? [];
      setOldWardOptions(wardOptions);
      const legacyWardName = selectedOldAddress.split("(")[0]?.replace(/^một phần\s+/i, "").trim().toLocaleLowerCase("vi");
      const matchingLegacyWard = legacyWardName
        ? wardOptions.find((ward) => ward.Name.toLocaleLowerCase("vi").includes(legacyWardName))
        : undefined;
      setOldWardId((current) => wardOptions.some((ward) => ward.Id === current) ? current : matchingLegacyWard?.Id ?? wardOptions[0]?.Id);
      setStreetOptions(streetsResponse.data ?? []);
      setStreetName("");
    }).catch(() => {
      if (active) {
        setOldWardOptions([]);
        setStreetOptions([]);
      }
    });
    return () => { active = false; };
  }, [dialogOpen, mode, oldDistrictId, selectedOldAddress]);
  const oldAddressOptions = useMemo(() => {
    const options = new Map<string, OldAddressOption>();
    wards.forEach((ward) => {
      const inferredDistrict = ward.MergedFrom
        .map((address) => address.match(/\(([^)]+)\)/)?.[1])
        .find(Boolean);
      ward.MergedFrom.forEach((address) => {
        if (options.has(address)) return;
        const district = address.match(/\(([^)]+)\)/)?.[1] ?? inferredDistrict ?? "Khác";
        options.set(address, { address, wardId: ward.WardId, district });
      });
    });

    const collator = new Intl.Collator("vi", { numeric: true, sensitivity: "base" });
    const groups = new Map<string, OldAddressOption[]>();
    for (const option of options.values()) {
      const label = formatOldDistrictLabel(option.district);
      const entries = groups.get(label) ?? [];
      entries.push(option);
      groups.set(label, entries);
    }
    return [...groups.entries()]
      .map(([district, entries]) => [district, entries.sort((a, b) => collator.compare(a.address, b.address))] as const)
      .sort(([a], [b]) => oldDistrictSortRank(a) - oldDistrictSortRank(b) || collator.compare(a, b));
  }, [wards]);
  const agencies = useMemo(() => {
    const filter = query.trim().toLocaleLowerCase("vi");
    return selectedWard ? flattenWard(selectedWard).filter((item) =>
      !filter || `${item.type} ${item.name} ${item.address}`.toLocaleLowerCase("vi").includes(filter)
    ) : [];
  }, [query, selectedWard]);

  const saveAgency = async () => {
    if (!formWard || !provinceId || !form.name.trim() || !streetName.trim() || !form.address.trim()) return;
    if (mode === "old" && (!oldDistrictId || !oldWardId)) return;
    const originalWard = editingWardId === undefined
      ? undefined
      : wards.find((ward) => ward.WardId === editingWardId);
    const sourceWard = originalWard ?? formWard;
    const sourceAgencies = { ...sourceWard.Agencies };
    if (editing && originalWard) {
      sourceAgencies[editing.type] = (sourceAgencies[editing.type] ?? []).filter(
        (item) => item.name !== editing.name || item.address !== editing.address
      );
    }
    const targetAgencies = formWard.WardId === sourceWard.WardId
      ? sourceAgencies
      : { ...formWard.Agencies };
    const address = [
      form.address.trim(),
      streetName.trim(),
      `${formWard.WardType === "phường" ? "phường" : formWard.WardType === "xã" ? "xã" : "đặc khu"} ${formWard.WardName}`,
      withAddressType(selectedProvince?.Type ?? "", selectedProvince?.Name ?? ""),
    ].join(", ");
    targetAgencies[form.type] = [...(targetAgencies[form.type] ?? []), { name: form.name.trim(), address }];
    const updatedTarget = { ...formWard, Agencies: targetAgencies };
    let next = wards;
    if (formWard.WardId !== sourceWard.WardId && editing && originalWard) {
      const updatedSource = { ...sourceWard, Agencies: sourceAgencies };
      await lookupApi.saveWardAgencies(sourceWard.WardId, updatedSource);
      next = next.map((ward) => ward.WardId === sourceWard.WardId ? updatedSource : ward);
    }
    await lookupApi.saveWardAgencies(formWard.WardId, updatedTarget);
    next = next.map((ward) => ward.WardId === formWard.WardId ? updatedTarget : ward);
    setWards(next);
    setSelectedWardId(formWard.WardId);
    setSelectedOldAddress("");
    setDialogOpen(false);
    setEditing(undefined);
    setEditingWardId(undefined);
  };

  const removeAgency = async () => {
    if (!selectedWard || !deleteTarget) return;
    const updatedWard = {
      ...selectedWard,
      Agencies: {
        ...selectedWard.Agencies,
        [deleteTarget.type]: (selectedWard.Agencies[deleteTarget.type] ?? []).filter(
          (item) => item.name !== deleteTarget.name || item.address !== deleteTarget.address
        ),
      },
    };
    await lookupApi.saveWardAgencies(selectedWard.WardId, updatedWard);
    setWards((current) => current.map((ward) => ward.WardId === selectedWard.WardId ? updatedWard : ward));
    setDeleteTarget(undefined);
  };

  const openEditor = (item?: AgencyRecord) => {
    setEditing(item);
    setEditingWardId(item ? selectedWardId : undefined);
    setFormWardId(selectedWardId ?? wards[0]?.WardId);
    setStreetOptions([]);
    setStreetName("");
    setProvinceOptions([]);
    setProvinceDistricts([]);
    setConfiguredWardOptions([]);
    setProvinceId(undefined);
    setOldWardOptions([]);
    setOldDistrictId(undefined);
    setOldWardId(undefined);
    setForm(item ?? { type: "Văn phòng công chứng", name: "", address: "" });
    setDialogOpen(true);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 bg-[#f5f5f5] p-6 max-md:p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-xl font-bold text-neutral-950">QUẢN LÝ CƠ QUAN HÀNH CHÍNH</h1>
        <Button onClick={() => openEditor()} className="gap-2 rounded-lg bg-[#6157e8] hover:bg-[#5147d9]"><Plus size={16} />Thêm mới cơ quan</Button>
      </div>

      <div className="flex min-h-0 flex-1 gap-5 max-lg:flex-col">
        <aside className="flex h-fit max-h-[70vh] w-[310px] shrink-0 self-start flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(60,64,67,0.08)] transition-[box-shadow,border-color] duration-200 hover:border-[#dadce0] hover:shadow-[0_1px_6px_rgba(32,33,36,0.18)] max-lg:w-full">
          <div className="border-b border-neutral-200 p-4">
            <h2 className="mb-3 text-sm font-bold">ĐỊA GIỚI</h2>
            <div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-neutral-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm cơ quan hành chính" className="pl-9" /></div>
            <div className="mt-3 flex rounded-lg bg-neutral-100 p-1">
              <button onClick={() => setMode("new")} className={`flex-1 rounded-md px-3 py-2 text-sm ${mode === "new" ? "bg-white font-semibold shadow-sm" : "text-neutral-500"}`}>Địa chỉ mới</button>
              <button onClick={() => setMode("old")} className={`flex-1 rounded-md px-3 py-2 text-sm ${mode === "old" ? "bg-white font-semibold shadow-sm" : "text-neutral-500"}`}>Địa chỉ cũ</button>
            </div>
          </div>
          <div className="min-h-0 flex-none overflow-y-auto p-2" style={{ maxHeight: "min(45vh, 320px)" }}>
            {mode === "new" ? <>
              <button onClick={() => setExpandedCity((value) => !value)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-neutral-50">
                {expandedCity ? <ChevronDown size={16} /> : <ChevronRight size={16} />} TP. Hồ Chí Minh <span className="ml-auto text-neutral-400">{wards.length}</span>
              </button>
              {expandedCity && wards.map((ward) => (
                <button key={ward.WardId} onClick={() => { setSelectedWardId(ward.WardId); setSelectedOldAddress(""); }} className={`flex w-full items-center rounded-lg py-2 pl-9 pr-3 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6157e8] ${selectedWardId === ward.WardId ? "bg-[#f0efff] font-semibold text-[#5147d9]" : "hover:bg-[#f8f9fa]"}`}>
                  {ward.WardType === "phường" ? "P." : ward.WardType === "xã" ? "X." : "ĐK"} {ward.WardName}
                </button>
              ))}
            </> : <>
              <button onClick={() => setExpandedOldCity((value) => !value)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-neutral-50">
                {expandedOldCity ? <ChevronDown size={16} /> : <ChevronRight size={16} />} TP. Hồ Chí Minh
                <span className="ml-auto text-neutral-400">{oldAddressOptions.reduce((total, [, entries]) => total + entries.length, 0)}</span>
              </button>
              {expandedOldCity && oldAddressOptions.map(([district, entries]) => (
                <div key={district}>
                  <h3 className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">{district}</h3>
                  {entries.map(({ address, wardId }) => (
                    <button key={address} onClick={() => { setSelectedWardId(wardId); setSelectedOldAddress(address); }} className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6157e8] ${selectedOldAddress === address ? "bg-[#f0efff] font-semibold text-[#5147d9]" : "hover:bg-[#f8f9fa]"}`}>
                      {address}
                    </button>
                  ))}
                </div>
              ))}
            </>}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(60,64,67,0.08)] transition-[box-shadow,border-color] duration-200 hover:border-[#dadce0] hover:shadow-[0_1px_6px_rgba(32,33,36,0.18)]">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4">
            <div><h2 className="text-base font-bold">CƠ QUAN HÀNH CHÍNH</h2><p className="mt-1 text-sm text-neutral-500">{mode === "old" ? selectedOldAddress || "Chọn địa chỉ cũ" : `${selectedWard?.WardName ?? "Chọn phường/xã"}, TP. Hồ Chí Minh`}</p></div>
            <span className="rounded-full bg-[#eeedff] px-3 py-1 text-sm font-semibold text-[#5147d9]">{agencies.length}</span>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {!agencies.length ? <div className="flex min-h-64 flex-col items-center justify-center text-center"><p className="font-semibold">Chưa có cơ quan hành chính</p><p className="mt-1 text-sm text-neutral-500">Thêm cơ quan để hiển thị tại đây.</p><Button variant="outline" className="mt-4 gap-2" onClick={() => openEditor()}><Plus size={16} />Thêm mới</Button></div> : (
              <div className="flex flex-col gap-4">
                {agencyTypes.map((type) => {
                  const items = agencies.filter((item) => item.type === type);
                  if (!items.length) return null;
                  return <div key={type} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(60,64,67,0.08)] transition-[box-shadow,border-color,transform] duration-200 ease-out hover:-translate-y-px hover:border-[#dadce0] hover:shadow-[0_2px_8px_rgba(60,64,67,0.18)] motion-reduce:transform-none motion-reduce:transition-none">
                    <div className="border-b border-neutral-200 bg-[#f5f5ff] px-4 py-3 text-sm font-bold">{type}</div>
                    {items.map((item, index) => <article key={`${item.name}-${item.address}-${index}`} className="flex items-start justify-between gap-4 border-b border-neutral-100 p-4 transition-colors duration-150 hover:bg-[#f8f9fa] last:border-b-0">
                      <div className="min-w-0"><h3 className="font-semibold">{item.name}</h3><p className="mt-1 text-xs text-neutral-500">Địa chỉ mới: {item.address}</p><p className="mt-1 text-xs text-neutral-500">Địa chỉ cũ: {convertAgencyAddressToOld(item.address, wards, selectedWard?.WardName) ?? item.oldAddress ?? "Không đủ dữ liệu địa giới cũ để chuyển đổi"}</p></div>
                      <div className="flex shrink-0 gap-2"><Button variant="outline" size="icon" aria-label="Sửa cơ quan" onClick={() => openEditor(item)}><Pencil size={16} /></Button><Button variant="outline" size="icon" aria-label="Xóa cơ quan" className="text-red-600" onClick={() => setDeleteTarget(item)}><Trash2 size={16} /></Button></div>
                    </article>)}
                  </div>;
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-[768px]">
          <div className="border-b border-neutral-200 px-6 py-5"><h2 className="text-lg font-bold">{editing ? "SỬA CƠ QUAN HÀNH CHÍNH" : "THÊM MỚI CƠ QUAN HÀNH CHÍNH"}</h2></div>
          <div className="flex flex-col gap-5 px-6 py-5">
            <div>
              <h3 className="mb-3 text-sm font-bold">Thông tin cơ quan</h3>
              <p className="mb-3 text-xs text-neutral-500">Chọn đúng đơn vị hành chính để địa chỉ xuất hiện trong danh sách tương ứng.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <AgencyFloatingField id="agency-type" label="Danh mục cơ quan" required filled>
                  <Select value={form.type} onValueChange={(value) => setForm((current) => ({ ...current, type: value as AgencyType }))}>
                    <SelectTrigger id="agency-type" aria-label="Danh mục cơ quan" className="h-10 w-full rounded-md border-neutral-200 bg-white px-3 text-sm focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20 focus-visible:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>{agencyTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                  </Select>
                </AgencyFloatingField>
                <div>
                  <AgencyFloatingField id="agency-name" label="Tên cơ quan" required filled={Boolean(form.name.trim())}>
                    <Input id="agency-name" aria-label="Tên cơ quan" className="h-10 border-neutral-200 bg-white shadow-none focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20 focus-visible:ring-offset-0" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                  </AgencyFloatingField>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold">Thông tin địa chỉ</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className={mode === "old" ? "sm:col-span-2" : undefined}>
                  <AgencyFloatingField id="agency-province" label="Tỉnh/Thành phố" filled>
                    <Select value={provinceId === undefined ? undefined : String(provinceId)} onValueChange={(value) => { setProvinceId(Number(value)); setFormWardId(undefined); setOldDistrictId(undefined); setOldWardId(undefined); setStreetName(""); }}>
                      <SelectTrigger id="agency-province" aria-label="Tỉnh/Thành phố" className="h-10 w-full rounded-md border-neutral-200 bg-white px-3 text-sm focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20 focus-visible:ring-offset-0">
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinceOptions.map((province) => <SelectItem key={province.Id} value={String(province.Id)}>{withAddressType(province.Type, province.Name)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </AgencyFloatingField>
                </div>
                {mode === "old" ? <>
                  <AgencyFloatingField id="agency-district" label="Quận/Huyện" filled={Boolean(oldDistrictId)}>
                    <Select value={oldDistrictId === undefined ? undefined : String(oldDistrictId)} onValueChange={(value) => { setOldDistrictId(Number(value)); setOldWardId(undefined); setStreetName(""); }}>
                      <SelectTrigger id="agency-district" aria-label="Quận/Huyện" className="h-10 w-full rounded-md border-neutral-200 bg-white px-3 text-sm focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20 focus-visible:ring-offset-0">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {oldDistrictOptions.map((district) => <SelectItem key={district.Id} value={String(district.Id)}>{withAddressType(district.Type, district.Name)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </AgencyFloatingField>
                  <AgencyFloatingField id="agency-old-ward" label="Phường/Xã" filled={Boolean(oldWardId)}>
                    <Select value={oldWardId === undefined ? undefined : String(oldWardId)} onValueChange={(value) => { setOldWardId(Number(value)); setStreetName(""); }}>
                      <SelectTrigger id="agency-old-ward" aria-label="Phường/Xã" className="h-10 w-full rounded-md border-neutral-200 bg-white px-3 text-sm focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20 focus-visible:ring-offset-0">
                        <SelectValue placeholder="Chọn phường/xã" />
                      </SelectTrigger>
                      <SelectContent>
                        {oldWardOptions.map((ward) => <SelectItem key={ward.Id} value={String(ward.Id)}>{withAddressType(ward.Type, ward.Name)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </AgencyFloatingField>
                </> : <AgencyFloatingField id="agency-ward" label="Phường/Xã" filled={Boolean(formWard?.WardName)}>
                  <Select
                    value={formWardId === undefined ? undefined : String(formWardId)}
                    onValueChange={(value) => {
                      setFormWardId(Number(value));
                      setStreetName("");
                    }}
                  >
                    <SelectTrigger id="agency-ward" aria-label="Phường/Xã" className="h-10 w-full rounded-md border-neutral-200 bg-white px-3 text-sm focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20 focus-visible:ring-offset-0">
                      <SelectValue placeholder="Chọn phường/xã" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinceWardOptions.map((ward) => <SelectItem key={ward.Id} value={String(ward.Id)}>{withAddressType(ward.Type, ward.Name)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </AgencyFloatingField>}
                <AgencyFloatingField id="agency-street" label="Tên đường" required filled={Boolean(streetName)}>
                  <Select value={streetName || undefined} onValueChange={setStreetName}>
                    <SelectTrigger id="agency-street" aria-label="Tên đường" className="h-10 w-full rounded-md border-neutral-200 bg-white px-3 text-sm focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20 focus-visible:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {streetOptions.length
                        ? streetOptions.map((street) => <SelectItem key={street.Id} value={street.Name}>{street.Name}</SelectItem>)
                        : <SelectItem value="__no-configured-streets" disabled>Chưa có tên đường được cấu hình</SelectItem>}
                    </SelectContent>
                  </Select>
                </AgencyFloatingField>
                <AgencyFloatingField id="agency-address" label="Địa chỉ" required filled={Boolean(form.address.trim())}>
                  <Input id="agency-address" aria-label="Địa chỉ" className="h-10 border-neutral-200 bg-white shadow-none focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20 focus-visible:ring-offset-0" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
                </AgencyFloatingField>
              </div>
            </div>
          </div>
          <footer className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>Đóng</Button><Button onClick={saveAgency} disabled={!formWard || !provinceId || !form.name.trim() || !streetName.trim() || !form.address.trim() || (mode === "old" && (!oldDistrictId || !oldWardId))} className="bg-[#6157e8] hover:bg-[#5147d9]">Lưu</Button></footer>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open) setDeleteTarget(undefined); }}>
        <DialogContent className="gap-0 rounded-2xl p-0 sm:max-w-[440px]">
          <div className="p-6"><h2 className="text-lg font-bold">Xóa cơ quan hành chính?</h2><p className="mt-3 text-sm text-neutral-600">Bạn có chắc muốn xóa “{deleteTarget?.name}”? Thao tác này không thể hoàn tác.</p></div>
          <footer className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4"><Button variant="outline" onClick={() => setDeleteTarget(undefined)}>Hủy</Button><Button variant="destructive" onClick={removeAgency}>Xóa</Button></footer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
