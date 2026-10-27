"use client";

import { CircleX, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import AddressModal from "./address-modal";
import { cn } from "@/lib/utils";
import { useAdminContext } from "@/lib/stored";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";
import provinceApi from "@/services/api/provinceApi";
import districtApi from "@/services/api/districtApi";
import mergeWardApi from "@/services/api/mergeWardApi";

type AddressMode = "new" | "old";

type Item = {
  kind: "province" | "district" | "ward" | "street";
  id: number;
  name: string;
  shortName?: string;
  sub?: string;
  keywords: string;
  active: boolean;
  oldDistrictId?: number;
  districtId?: number;
  oldWardId?: number;
  newWardId?: number;
  wardId?: number;
  managed?: boolean;
};

const PAGE_ALL = { pageIndex: 1, pageSize: 10000 };

// Backend chưa trả field Status trong IConfigAddress: thiếu = "Hoạt động".
const isActive = (x: object) => {
  const status = (x as { Status?: unknown }).Status;
  return status === undefined || status === null || status === 1 || status === "Active";
};

const norm = (s: string) => s.toLocaleLowerCase("vi");
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function RowName({ name }: { name: string }) {
  // "Hai Bà Trưng (đoạn từ ...)" → phần trong ngoặc in nghiêng, như Figma.
  const i = name.indexOf(" (");
  if (i === -1 || /^\(\d+\)$/.test(name.slice(i + 1).trim())) return <>{name}</>;
  return (
    <>
      {name.slice(0, i + 1)}
      <span className="font-normal italic">{name.slice(i + 1)}</span>
    </>
  );
}

function Column({
  title,
  items,
  selectedId,
  onSelect,
  loading,
  onAdd,
  onEdit,
  onDelete,
  emptyMessage,
  searchValue,
  onSearch,
}: {
  title: string;
  items: Item[];
  selectedId?: number;
  onSelect?: (id: number) => void;
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  emptyMessage?: string;
  searchValue?: string;
  onSearch?: (value: string) => void;
}) {
  return (
    <div className="flex h-full min-w-px flex-1 flex-col overflow-hidden rounded-xl border border-[#f5f5f5] bg-white">
      <div className="flex shrink-0 items-center gap-3 bg-[#eff6ff] px-3 py-2.5">
        <div className="flex min-w-px flex-1 items-center gap-2.5">
          <p className="whitespace-nowrap text-sm font-bold leading-5 text-[#0a0a0a]">{title}</p>
          <span className="flex size-5 items-center justify-center rounded-full bg-[#0588f0] text-[11px] font-semibold leading-4 text-white">
            {items.length}
          </span>
        </div>
        <button
          type="button"
          aria-label={`Thêm mới ${title}`}
          onClick={onAdd}
          className="flex size-5 items-center justify-center text-[#0a0a0a]"
        >
          <Plus size={18} />
        </button>
      </div>
      {onSearch && (
        <div className="shrink-0 border-b border-[#f5f5f5] p-2">
          <Input
            value={searchValue ?? ""}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Tìm kiếm"
            aria-label={`Tìm kiếm ${title}`}
            className="h-8 rounded-md border-[#e5e5e5] bg-white px-2.5 text-xs placeholder:text-[#737373] focus:border-[#0588f0] focus:ring-2 focus:ring-[#0588f0]/20"
          />
        </div>
      )}
      <div className="scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overscroll-contain flex min-h-0 flex-1 flex-col overflow-y-auto hover:scrollbar-thumb-neutral-400">
        {loading && <p className="p-3 text-xs text-[#737373]">Đang tải...</p>}
        {!loading && items.length === 0 && (
          <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-2 text-center text-[#737373]">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#eff6ff] text-[#0588f0]">
              <CircleX size={18} />
            </span>
            <span className="text-xs">{emptyMessage ?? "Chưa có thông tin hiển thị"}</span>
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group flex shrink-0 items-center border-b border-[#f5f5f5] border-l-2 border-l-transparent px-3 text-left",
              item.id === selectedId ? "border-l-[#0588f0] bg-[#f5f5f5]" : "bg-white hover:bg-[#fafafa]",
              !onSelect && "cursor-default"
            )}
          >
            <button
              type="button"
              onClick={() => onSelect?.(item.id)}
              className="flex min-w-0 flex-1 flex-col gap-0.5 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0588f0]"
            >
              <p title={item.name} className="w-full truncate text-sm font-semibold leading-5 text-[#0a0a0a]">
                <RowName name={item.name} />
              </p>
              <div className="flex w-full items-start gap-1.5 text-xs leading-4">
                {item.sub && <span title={item.sub} className="line-clamp-2 w-fit max-w-[calc(100%_-_0.75rem)] whitespace-normal text-[#0a0a0a]">{item.sub}</span>}
                {!item.sub && <span className="flex-1" />}
                <span
                  className={cn(
                    "mt-1 size-1.5 shrink-0 rounded-full",
                    item.active ? "bg-[#22c55e]" : "bg-[#a3a3a3]"
                  )}
                  aria-label={item.active ? "Hoạt động" : "Ngừng hoạt động"}
                />
              </div>
            </button>
            {(onEdit || onDelete) && item.managed !== false && (
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {onEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label={`Chỉnh sửa ${item.name}`} onClick={() => onEdit(item)} className="rounded p-1 text-[#525252] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0588f0]/40">
                        <Pencil size={14} aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Chỉnh sửa</TooltipContent>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label={`Xóa ${item.name}`} onClick={() => onDelete(item)} className="rounded p-1 text-[#dc3e42] hover:bg-[#fff1f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc3e42]/30">
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Xóa</TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AddressManagerPage() {
  const { provinces, districts, init } = useAdminContext();
  const [mode, setMode] = useState<AddressMode>("new");
  const [query, setQuery] = useState("");
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const [provinceQuery, setProvinceQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [wardQuery, setWardQuery] = useState("");
  const [streetQuery, setStreetQuery] = useState("");
  const [provinceId, setProvinceId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const [wardId, setWardId] = useState<number>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Item>();
  const [deleteTarget, setDeleteTarget] = useState<Item>();
  const [createKind, setCreateKind] = useState<"province" | "district" | "ward" | "street">("ward");
  const { mutate } = useSWRConfig();
  const addNew = (kind: "province" | "district" | "ward" | "street" = mode === "new" ? "ward" : "district") => {
    setEditTarget(undefined);
    setCreateKind(kind);
    setModalOpen(true);
  };

  const deleteItem = async (item: Item) => {
    try {
      if (item.kind === "province") await provinceApi.delete(item.id);
      else if (item.kind === "district") await districtApi.delete(item.id);
      else if (item.kind === "ward") await wardApi.delete(item.id);
      else await streetApi.delete(item.id);
      setDeleteTarget(undefined);
      toast.success(`Đã xóa ${item.name}`);
      void init();
      void mutate((key) => Array.isArray(key) && String(key[0]).startsWith("addr-"));
    } catch {
      // Keep the Figma constraint dialog for records referenced elsewhere.
      setDeleteTarget(item);
    }
  };

  useEffect(() => {
    if (!provinceId && provinces.length) {
      const hcmProvince = provinces.find((province) =>
        norm(province.Name).includes("hồ chí minh")
      );
      setProvinceId((hcmProvince ?? provinces[0]).Id);
    }
  }, [provinces, provinceId]);

  const oldDistricts = useSWR(
    mode === "old" && provinceId ? ["addr-district-old", provinceId] : null,
    () => districtApi.get({ ...PAGE_ALL, ProvinceId: provinceId })
  );
  const mergeWards = useSWR("addr-merge-wards", () => mergeWardApi.get());
  const searchableWards = useSWR("addr-search-wards", () =>
    wardApi.get({ ...PAGE_ALL, IsNew: true }),
  );
  const searchableStreets = useSWR("addr-search-streets", () =>
    streetApi.get({ ...PAGE_ALL, IsNew: true }),
  );
  const provinceDistricts = useMemo(
    () => mode === "old"
      ? oldDistricts.data?.data ?? []
      : districts.filter((d) => d.ProvinceId === provinceId),
    [districts, mode, oldDistricts.data, provinceId]
  );

  useEffect(() => {
    const defaultDistrict =
      provinceDistricts.find((district) => norm(district.Name) === "quận 1") ??
      provinceDistricts[0];
    setDistrictId(defaultDistrict?.Id);
    if (mode === "old") setWardId(undefined);
  }, [provinceDistricts, mode]);

  // Địa chỉ mới: Phường/Xã + Đường đều theo ProvinceId (IsNew).
  const newWards = useSWR(
    mode === "new" && provinceId ? ["addr-ward-new", provinceId] : null,
    () => wardApi.get({ ...PAGE_ALL, IsNew: true, ProvinceId: provinceId })
  );
  const newStreets = useSWR(
    mode === "new" && provinceId && wardId
      ? ["addr-street-new", provinceId, wardId]
      : null,
    () => streetApi.get({ ...PAGE_ALL, WardId: wardId, IsNew: true })
  );
  // Địa chỉ cũ: Quận/Huyện (cũ) → Phường/Xã (cũ); đường lấy theo Phường/Xã mới được liên kết.
  const oldWards = useSWR(
    mode === "old" && districtId ? ["addr-ward-old", districtId] : null,
    () => wardApi.get({ ...PAGE_ALL, DistrictId: districtId, IsNew: false })
  );
  const selectedOldWard = oldWards.data?.data?.find((ward) => ward.Id === wardId);
  const defaultOldWard = oldWards.data?.data?.find(
    (ward) => norm(ward.Name) === "phường bến nghé"
  ) ?? oldWards.data?.data?.[0];
  const effectiveWardId = mode === "old"
    ? wardId ?? defaultOldWard?.Id
    : wardId;
  const oldWardMerge = (mergeWards.data?.data ?? []).find(
    (merge) => merge.OldWardId === (selectedOldWard?.Id ?? effectiveWardId)
  );
  const oldMappedStreets = useSWR(
    mode === "old" && oldWardMerge?.NewWardId
      ? ["addr-street-old-mapped", oldWardMerge.NewWardId]
      : null,
    () => streetApi.get({ ...PAGE_ALL, WardId: oldWardMerge?.NewWardId, IsNew: true })
  );

  const q = norm(query.trim());
  const provinceQ = norm(provinceQuery.trim());
  const provinceSearchPattern = provinceQ ? new RegExp(escapeRegExp(provinceQ), "u") : undefined;
  const keep = (i: Item) => !q || norm(i.keywords).indexOf(q) !== -1;
  const matchesColumnQuery = (item: Item, value: string) =>
    !value.trim() || norm(item.keywords).includes(norm(value.trim()));
  const isHcmSelected = norm(
    provinces.find((province) => province.Id === provinceId)?.Name ?? ""
  ).includes("hồ chí minh");

  const provinceOrder = ["hồ chí minh", "hà nội", "đà nẵng", "đồng nai", "khánh hòa", "cần thơ", "lâm đồng", "huế"];
  const provinceRank = new Map(provinceOrder.map((name, index) => [name, index]));
  const provinceCodes: Record<string, string> = {
    "hồ chí minh": "TP. HCM",
    "hà nội": "HN",
    "đà nẵng": "DN",
    "đồng nai": "DNA",
    "khánh hòa": "KH",
    "cần thơ": "CT",
    "lâm đồng": "LD",
    "huế": "HUE",
  };
  const provinceAbbreviation = (name: string, shortName?: string) => {
    const known = provinceCodes[norm(name)];
    if (known) return known;
    if (shortName?.trim() && norm(shortName) !== norm(name)) return shortName.trim();
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toLocaleUpperCase("vi");
  };
  const provinceItems: Item[] = [...provinces]
    .sort((a, b) => {
      const aRank = provinceRank.get(norm(a.Name)) ?? Number.MAX_SAFE_INTEGER;
      const bRank = provinceRank.get(norm(b.Name)) ?? Number.MAX_SAFE_INTEGER;
      return aRank - bRank ||
        a.Name.localeCompare(b.Name, "vi");
    })
    .map((p) => ({
      kind: "province",
      id: p.Id,
      name: norm(p.Name) === "hồ chí minh" ? `${p.Type ?? ""} ${p.Name}`.trim() : p.Name,
      sub: `(${provinceAbbreviation(p.Name, p.ShortName)})`,
      keywords: `${p.Name} ${p.ShortName ?? ""} ${p.RefKey ?? ""} ${p.Slug ?? ""}`,
      active: isActive(p),
    }));

  const wardItems = (rows: typeof newWards.data, withDistrict: boolean): Item[] =>
    (rows?.data ?? []).map((w) => ({
      kind: "ward",
      id: w.Id,
      name: w.Name,
      oldDistrictId: w.DistrictId,
      newWardId: mergeWards.data?.data?.find((merge) => merge.OldWardId === w.Id)?.NewWardId,
      sub: withDistrict && w.DistrictName ? `(${w.DistrictName} cũ)` : undefined,
      keywords: `${w.Name} ${w.RefKey ?? ""} ${w.Slug ?? ""} ${w.DistrictName ?? ""}`,
      active: isActive(w),
    }));

  const newWardRows = (newWards.data?.data ?? []).filter((ward) =>
    ward.ProvinceId === provinceId
  );
  const oldDistrictsByNewWard = useMemo(() => {
    const namesByWard = new Map<number, Set<string>>();
    for (const merge of mergeWards.data?.data ?? []) {
      const names = namesByWard.get(merge.NewWardId) ?? new Set<string>();
      names.add(merge.OldDistrictName);
      namesByWard.set(merge.NewWardId, names);
    }
    return new Map(
      [...namesByWard].map(([id, names]) => [id, [...names].join(", ")])
    );
  }, [mergeWards.data]);
  const oldDistrictOrderByNewWard = useMemo(() => {
    const orderByWard = new Map<number, number>();
    for (const merge of mergeWards.data?.data ?? []) {
      orderByWard.set(
        merge.NewWardId,
        Math.min(orderByWard.get(merge.NewWardId) ?? Number.MAX_SAFE_INTEGER, merge.OldDistrictId)
      );
    }
    return orderByWard;
  }, [mergeWards.data]);
  const oldWardById = useMemo(
    () => new Map((mergeWards.data?.data ?? []).map((merge) => [merge.OldWardId, merge])),
    [mergeWards.data]
  );
  const figmaWardOrder = [
    "phường sài gòn",
    "phường cầu ông lãnh",
    "phường bàn cờ",
    "phường bình tây",
    "phường vườn lài",
    "phường hạnh thông",
    "phường tân sơn hòa",
  ];
  const figmaWardRank = new Map(figmaWardOrder.map((name, index) => [name, index]));
  const newWardItems: Item[] = newWardRows.map((ward) => ({
    kind: "ward" as const,
    id: ward.Id,
    name: ward.Name,
    oldDistrictId: ward.DistrictId,
    sub: (() => {
      const districtName = oldDistrictsByNewWard.get(ward.Id) ??
        districts.find((district) => district.Id === ward.DistrictId)?.Name ??
        ward.DistrictName;
      return districtName ? `(${districtName} cũ)` : undefined;
    })(),
    keywords: `${ward.Name} ${ward.RefKey ?? ""} ${ward.Slug ?? ""}`,
    active: isActive(ward),
  })).sort((a, b) => {
    const aPreferred = isHcmSelected && norm(a.name) === "phường sài gòn";
    const bPreferred = isHcmSelected && norm(b.name) === "phường sài gòn";
    if (aPreferred !== bPreferred) return aPreferred ? -1 : 1;
    const aName = norm(a.name);
    const bName = norm(b.name);
    const aFigmaRank = figmaWardRank.get(aName) ?? Number.MAX_SAFE_INTEGER;
    const bFigmaRank = figmaWardRank.get(bName) ?? Number.MAX_SAFE_INTEGER;
    return aFigmaRank - bFigmaRank ||
      (oldDistrictOrderByNewWard.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (oldDistrictOrderByNewWard.get(b.id) ?? Number.MAX_SAFE_INTEGER) ||
      a.name.localeCompare(b.name, "vi");
  });

  useEffect(() => {
    if (
      mode === "new" &&
      !newWardItems.some((item) => item.id === wardId)
    ) {
      const preferredWard = isHcmSelected
        ? newWardItems.find((item) => norm(item.name) === "phường sài gòn")
        : undefined;
      setWardId((preferredWard ?? newWardItems[0])?.id);
    }
  }, [mode, provinceId, newWardItems, isHcmSelected, wardId]);

  const figmaStreetOrder = [
    "lê duẩn",
    "đồng khởi",
    "nguyễn huệ",
    "nam kỳ khởi nghĩa",
    "hai bà trưng",
    "mạc đĩnh chi",
    "pasteur",
    "võ văn kiệt",
  ];
  const figmaStreetRank = new Map(figmaStreetOrder.map((name, index) => [name, index]));
  const figmaOldWardByStreet: Record<string, string> = {
    "lê duẩn": "P. Bến Nghé cũ",
    "đồng khởi": "P. Bến Nghé cũ",
    "nguyễn huệ": "P. Bến Nghé cũ",
    "nam kỳ khởi nghĩa": "P. Bến Nghé & Nguyễn Thái Bình cũ",
    "hai bà trưng": "P. Bến Nghé cũ",
    "mạc đĩnh chi": "P. Bến Nghé & Đa Kao cũ",
    "pasteur": "P. Bến Nghé cũ",
    "võ văn kiệt": "P. Nguyễn Thái Bình cũ",
    "alexandre de rhodes": "P. Bến Nghé cũ",
    "đinh tiên hoàng": "P. Đa Kao cũ",
    "đông du": "P. Bến Nghé cũ",
    "cao bá quát": "P. Bến Nghé cũ",
    "chu mạnh trinh": "P. Bến Nghé cũ",
  };
  const isFigmaReferenceWard = newWardItems.some(
    (item) => item.id === wardId && norm(item.name) === "phường sài gòn"
  );
  const streetItems: Item[] = (newStreets.data?.data ?? [])
    .filter((street) => street.WardId === wardId)
    .map((s) => ({
      kind: "street" as const,
      id: s.Id,
      name: s.Name.replace(/^đường\s+/i, ""),
      shortName: s.ShortName,
      wardId: s.WardId ?? undefined,
      districtId: s.DistrictId,
      oldWardId: s.OldWardId ?? undefined,
      sub: s.OldWardId && oldWardById.has(s.OldWardId)
        ? `(${oldWardById.get(s.OldWardId)?.OldWardName} cũ)`
        : isFigmaReferenceWard && figmaOldWardByStreet[norm(s.Name.replace(/^đường\s+/i, ""))]
          ? `(${figmaOldWardByStreet[norm(s.Name.replace(/^đường\s+/i, ""))]})`
          : undefined,
      keywords: `${s.Name} ${s.RefKey ?? ""} ${s.Slug ?? ""}`,
      active: isActive(s),
    })).sort((a, b) => {
      const aName = norm(a.name.replace(/^đường\s+/i, ""));
      const bName = norm(b.name.replace(/^đường\s+/i, ""));
      const aRank = figmaStreetRank.get(aName) ?? Number.MAX_SAFE_INTEGER;
      const bRank = figmaStreetRank.get(bName) ?? Number.MAX_SAFE_INTEGER;
      return aRank - bRank ||
        a.name.localeCompare(b.name, "vi");
    });
  const oldStreetItems: Item[] = (oldMappedStreets.data?.data ?? []).map((s) => ({
    kind: "street" as const,
    id: s.Id,
    name: s.Name.replace(/^đường\s+/i, ""),
    shortName: s.ShortName,
    wardId: s.WardId ?? undefined,
    districtId: s.DistrictId,
    oldWardId: s.OldWardId ?? undefined,
    sub: s.OldWardId && oldWardById.has(s.OldWardId)
      ? `(${oldWardById.get(s.OldWardId)?.OldWardName} cũ)`
      : figmaOldWardByStreet[norm(s.Name.replace(/^đường\s+/i, ""))]
        ? `(${figmaOldWardByStreet[norm(s.Name.replace(/^đường\s+/i, ""))]})`
        : undefined,
    keywords: `${s.Name} ${s.RefKey ?? ""} ${s.Slug ?? ""}`,
    active: isActive(s),
  })).sort((a, b) => {
    const aRank = figmaStreetRank.get(norm(a.name.replace(/^đường\s+/i, ""))) ?? Number.MAX_SAFE_INTEGER;
    const bRank = figmaStreetRank.get(norm(b.name.replace(/^đường\s+/i, ""))) ?? Number.MAX_SAFE_INTEGER;
    return aRank - bRank || a.name.localeCompare(b.name, "vi");
  });

  const districtItems: Item[] = [...provinceDistricts]
    .sort((a, b) => Number(b.Id === districtId) - Number(a.Id === districtId))
    .map((d) => ({
      kind: "district",
      id: d.Id,
      name: d.Name,
      keywords: `${d.Name} ${d.RefKey ?? ""} ${d.Slug ?? ""}`,
      active: isActive(d),
    }));
  const provinceNameById = new Map(provinces.map((province) => [province.Id, `${province.Type ?? ""} ${province.Name}`.trim()]));
  const searchableWardById = new Map((searchableWards.data?.data ?? []).map((ward) => [ward.Id, ward]));
  const addressSuggestions = (searchableStreets.data?.data ?? [])
    .map((street) => {
      const ward = searchableWardById.get(street.WardId ?? -1);
      const provinceName = provinceNameById.get(ward?.ProvinceId ?? -1);
      const wardName = ward?.Name;
      const districtName = ward?.DistrictName;
      const streetName = street.Name.replace(/^đường\s+/i, "");
      return {
        id: street.Id,
        name: streetName,
        wardId: street.WardId,
        provinceId: ward?.ProvinceId,
        address: [streetName, wardName, districtName, provinceName].filter(Boolean).join(", "),
        keywords: `${street.Name} ${street.RefKey ?? ""} ${street.Slug ?? ""} ${wardName ?? ""} ${districtName ?? ""} ${provinceName ?? ""}`,
      };
    })
    .filter((item) => q && norm(item.keywords).includes(q))
    .slice(0, 8);

  return (
    <div className="relative flex h-[calc(100dvh-96px)] min-h-0 flex-col overflow-hidden bg-[#fbfbfd] font-[Inter,sans-serif]">
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <h1 className="whitespace-nowrap text-xl font-bold leading-7 text-[#0a0a0a]">
          QUẢN LÝ ĐỊA GIỚI HÀNH CHÍNH
        </h1>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 pl-4">
          <div className="relative w-[600px] max-w-full">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#737373]"
            />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchSuggestionsOpen(true);
              }}
              onFocus={() => setSearchSuggestionsOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchSuggestionsOpen(false);
              }}
              placeholder="Tìm kiếm địa chỉ"
              className="h-9 rounded-[8px] border-[#e5e5e5] bg-white pl-9 pr-3 text-xs font-medium placeholder:text-[#737373] focus:border-[#0588f0] focus:ring-2 focus:ring-[#0588f0]/20 focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20"
            />
            {searchSuggestionsOpen && query.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-[#e5e5e5] bg-white shadow-lg">
                {addressSuggestions.length ? (
                  <ul className="max-h-72 overflow-y-auto p-1">
                    {addressSuggestions.map((item) => (
                      <li key={`${item.id}-${item.address}`}>
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            const targetWard = searchableWardById.get(item.wardId ?? -1);
                            if (targetWard?.ProvinceId) setProvinceId(targetWard.ProvinceId);
                            if (item.wardId) setWardId(item.wardId);
                            setMode("new");
                            setQuery(item.name);
                            setSearchSuggestionsOpen(false);
                          }}
                          className="flex w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left hover:bg-[#eff6ff] focus-visible:bg-[#eff6ff] focus-visible:outline-none"
                        >
                          <span className="text-sm font-semibold text-[#171717]">{item.address}</span>
                          <span className="text-xs text-[#737373]">{item.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-3 py-3 text-sm text-[#737373]">Không tìm thấy địa chỉ phù hợp</p>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => addNew()}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[#0588f0] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0477d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0588f0]/40"
          >
            <Plus size={15} aria-hidden="true" />
            Thêm mới
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-[#f5f5f5] py-2 pl-5 pr-4">
        <div className="flex min-w-px flex-1 items-center gap-3">
          <span className="size-2 shrink-0 rounded-full bg-black" />
          <p className="flex-1 text-xs font-medium leading-5 text-[#0a0a0a]">
            {mode === "new"
              ? "Sơ đồ 3 Cấp Địa giới Hành chính Việt Nam (Tỉnh/Thành ➔ Phường/Xã ➔ Đường) hiển thị đồng bộ"
              : "Sơ đồ 4 Cấp Địa giới Hành chính Việt Nam (Tỉnh/Thành ➔ Quận/Huyện ➔ Phường/Xã ➔ Đường) hiển thị đồng bộ"}
          </p>
        </div>
        <Tabs
          value={mode}
          onValueChange={(value) => {
            const nextMode = value as AddressMode;
            setMode(nextMode);
            setDistrictQuery("");
            setWardQuery("");
            setStreetQuery("");
            if (
              nextMode === "old" &&
              !districts.some((district) => district.ProvinceId === provinceId)
            ) {
              const provinceWithOldDistricts = provinces.find((province) =>
                districts.some((district) => district.ProvinceId === province.Id)
              );
              if (provinceWithOldDistricts) setProvinceId(provinceWithOldDistricts.Id);
            }
          }}
        >
          <TabsList className="h-8 rounded-[8px] bg-[#e5e5e5] p-[3px]">
            <TabsTrigger
              value="new"
              className="h-6 rounded-md px-2 py-0 text-[11px] data-[state=active]:bg-white data-[state=active]:text-[#0a0a0a] data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-[#0588f0]/30"
            >
              Sau sáp nhập
            </TabsTrigger>
            <TabsTrigger value="old" className="h-6 rounded-md px-2 py-0 text-[11px] data-[state=active]:bg-white data-[state=active]:text-[#0a0a0a] data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-[#0588f0]/30">
              Trước sáp nhập
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 py-3 pl-5 pr-4" style={{ maxHeight: "min(82dvh, calc(100dvh - 200px), 820px)" }}>
        <Column
          onAdd={() => addNew("province")}
          onEdit={(item) => {
            setEditTarget(item);
            setCreateKind(item.kind);
            setModalOpen(true);
          }}
          onDelete={(item) => void deleteItem(item)}
          title="TỈNH/THÀNH PHỐ"
          items={provinceItems.filter((item) => keep(item) && (!provinceSearchPattern || provinceSearchPattern.test(norm(item.keywords))))}
          searchValue={provinceQuery}
          onSearch={setProvinceQuery}
          selectedId={provinceId}
          onSelect={(id) => {
            setProvinceId(id);
            setDistrictId(undefined);
            setWardId(undefined);
            setDistrictQuery("");
            setWardQuery("");
            setStreetQuery("");
          }}
        />
        {mode === "new" ? (
          <>
            <Column
              onAdd={() => addNew("ward")}
              onEdit={(item) => {
                setEditTarget(item);
                setCreateKind(item.kind);
                setModalOpen(true);
              }}
              onDelete={(item) => void deleteItem(item)}
              title="PHƯỜNG/XÃ (mới)"
              items={newWardItems.filter((item) => keep(item) && matchesColumnQuery(item, wardQuery))}
              searchValue={wardQuery}
              onSearch={setWardQuery}
              selectedId={effectiveWardId}
              onSelect={(id) => {
                setWardId(id);
                setStreetQuery("");
              }}
              loading={newWards.isLoading}
            />
            <Column
              onAdd={() => addNew("street")}
              onEdit={(item) => {
                setEditTarget(item);
                setCreateKind("street");
                setModalOpen(true);
              }}
              onDelete={(item) => void deleteItem(item)}
              title="ĐƯỜNG"
              items={streetItems.filter((item) => keep(item) && matchesColumnQuery(item, streetQuery))}
              searchValue={streetQuery}
              onSearch={setStreetQuery}
              loading={newStreets.isLoading}
              emptyMessage="Chưa có thông tin hiển thị"
            />
          </>
        ) : (
          <>
            <Column
              onAdd={() => addNew("district")}
              onEdit={(item) => {
                setEditTarget(item);
                setCreateKind(item.kind);
                setModalOpen(true);
              }}
              onDelete={(item) => void deleteItem(item)}
              title="QUẬN/HUYỆN (cũ)"
              items={districtItems.filter((item) => keep(item) && matchesColumnQuery(item, districtQuery))}
              searchValue={districtQuery}
              onSearch={setDistrictQuery}
              selectedId={districtId}
              loading={oldDistricts.isLoading}
              onSelect={(id) => {
                setDistrictId(id);
                setWardId(undefined);
                setWardQuery("");
                setStreetQuery("");
              }}
            />
            <Column
              onAdd={() => addNew("ward")}
              onEdit={(item) => {
                setEditTarget(item);
                setCreateKind(item.kind);
                setModalOpen(true);
              }}
              onDelete={(item) => void deleteItem(item)}
              title="PHƯỜNG/XÃ (cũ)"
              items={wardItems(oldWards.data, false)
                .sort((a, b) => {
                  const figmaWardOrder = [
                    "phường bến nghé",
                    "phường bến thành",
                    "phường cầu kho",
                    "phường cầu ông lãnh",
                    "phường cô giang",
                    "phường đa kao",
                    "phường nguyễn cư trinh",
                    "phường phạm ngũ lão",
                    "phường tân định",
                    "phường nguyễn thái bình",
                  ];
                  const aRank = figmaWardOrder.indexOf(norm(a.name));
                  const bRank = figmaWardOrder.indexOf(norm(b.name));
                  return (aRank < 0 ? Number.MAX_SAFE_INTEGER : aRank) -
                    (bRank < 0 ? Number.MAX_SAFE_INTEGER : bRank);
                })
                .filter((item) => keep(item) && matchesColumnQuery(item, wardQuery))}
              searchValue={wardQuery}
              onSearch={setWardQuery}
              selectedId={effectiveWardId}
              onSelect={(id) => {
                setWardId(id);
                setStreetQuery("");
              }}
              loading={oldWards.isLoading}
            />
            <Column
              onAdd={() => addNew("street")}
              onDelete={(item) => void deleteItem(item)}
              onEdit={(item) => {
                setEditTarget(item);
                setCreateKind(item.kind);
                setModalOpen(true);
              }}
              title="ĐƯỜNG"
              items={oldStreetItems.filter((item) => keep(item) && matchesColumnQuery(item, streetQuery))}
              searchValue={streetQuery}
              onSearch={setStreetQuery}
              loading={oldMappedStreets.isLoading}
            />
          </>
        )}
      </div>

      <AddressModal
        open={modalOpen}
        mode={mode}
        intent={editTarget ? "edit" : "create"}
        initialProvince={editTarget?.kind === "province" ? { id: editTarget.id, name: editTarget.name.replace(/^(Tỉnh|Thành phố)\s+/, "") } : undefined}
        initialDistrict={editTarget?.kind === "district" ? { id: editTarget.id, name: editTarget.name } : undefined}
        initialWard={editTarget?.kind === "ward" ? { id: editTarget.id, name: editTarget.name, oldDistrictId: editTarget.oldDistrictId, newWardId: editTarget.newWardId } : undefined}
        initialStreet={editTarget?.kind === "street" ? { id: editTarget.id, name: editTarget.name, shortName: editTarget.shortName, wardId: mode === "new" ? editTarget.wardId ?? wardId : undefined, oldWardId: editTarget.oldWardId, districtId: editTarget.districtId ?? districtId ?? 0 } : undefined}
        createKind={createKind}
        selectedWardId={editTarget?.kind === "street" && mode === "old" ? undefined : editTarget?.kind === "street" ? editTarget.wardId ?? effectiveWardId : effectiveWardId}
        selectedMappedWardId={oldWardMerge?.NewWardId}
        selectedOldDistrictId={editTarget?.kind === "street" ? editTarget.districtId ?? districtId : editTarget?.kind === "ward" ? editTarget.oldDistrictId : mode === "old" ? districtId : newWardItems.find((item) => item.id === wardId)?.oldDistrictId}
        selectedDistrictId={districtId}
        provinceId={provinceId}
        provinceName={provinceItems.find((p) => p.id === provinceId)?.name}
        provinceOptions={provinceItems.map((province) => ({ id: province.id, name: province.name }))}
        onProvinceChange={(id) => {
          setProvinceId(id);
          setDistrictId(undefined);
          setWardId(undefined);
          setDistrictQuery("");
          setWardQuery("");
          setStreetQuery("");
        }}
        oldDistricts={districts
          .filter((d) => d.ProvinceId === provinceId)
          .map((d) => ({ id: d.Id, name: d.Name }))}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          setEditTarget(undefined);
          void init();
          void mutate((key) => Array.isArray(key) && String(key[0]).startsWith("addr-"));
        }}
      />
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(undefined)}>
        <DialogContent className="gap-0 rounded-xl p-0 sm:max-w-[520px]">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
            <DialogTitle className="text-sm font-bold text-[#262626]">LỖI KIỂM TRA RÀNG BUỘC</DialogTitle>
            <DialogDescription className="sr-only">Không thể xóa địa giới đang được sử dụng</DialogDescription>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-[#262626]">
              Không thể xóa đơn vị hành chính <span className="font-semibold text-[#b42318]">“{deleteTarget?.name}”</span>.
            </p>
            <div className="mt-3 rounded-lg bg-[#fff1f0] p-3 text-xs leading-5 text-[#8c2f2b]">
              Đơn vị hành chính này đang được sử dụng trong hệ thống. Hãy cập nhật các dữ liệu liên quan trước khi xóa.
            </div>
          </div>
          <div className="flex justify-end border-t border-[#f0f0f0] px-5 py-3">
            <button type="button" onClick={() => setDeleteTarget(undefined)} className="rounded-lg border border-[#e5e5e5] bg-white px-4 py-1.5 text-sm font-medium text-[#262626]">Đã hiểu</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
