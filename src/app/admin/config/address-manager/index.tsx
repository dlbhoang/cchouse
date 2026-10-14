"use client";

import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAdminContext } from "@/lib/stored";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";

type AddressMode = "new" | "old";
type StatusFilter = "all" | "active" | "inactive";

type Item = {
  id: number;
  name: string;
  sub?: string;
  keywords: string;
  active: boolean;
};

const PAGE_ALL = { pageIndex: 1, pageSize: 10000 };

// Backend chưa trả field Status trong IConfigAddress: thiếu = "Hoạt động".
const isActive = (x: object) => {
  const status = (x as { Status?: unknown }).Status;
  return status === undefined || status === null || status === 1 || status === "Active";
};

const norm = (s: string) => s.toLocaleLowerCase("vi");

function RowName({ name }: { name: string }) {
  // "Hai Bà Trưng (đoạn từ ...)" → phần trong ngoặc in nghiêng, như Figma.
  const i = name.indexOf(" (");
  if (i === -1) return <>{name}</>;
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
}: {
  title: string;
  items: Item[];
  selectedId?: number;
  onSelect?: (id: number) => void;
  loading?: boolean;
}) {
  return (
    <div className="flex h-full min-w-px flex-1 flex-col overflow-hidden rounded-2xl border border-[#f5f5f5] bg-white">
      <div className="flex shrink-0 items-center gap-4 bg-[#dbeafe] p-4">
        <div className="flex min-w-px flex-1 items-center gap-2.5">
          <p className="whitespace-nowrap text-lg font-bold leading-7 text-[#0a0a0a]">{title}</p>
          <span className="flex size-7 items-center justify-center rounded-full bg-[#0588f0] text-sm font-semibold leading-5 text-white">
            {items.length}
          </span>
        </div>
        <button
          type="button"
          aria-label={`Thêm mới ${title}`}
          className="flex size-6 items-center justify-center text-[#0a0a0a]"
        >
          <Plus size={24} />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {loading && <p className="p-4 text-sm text-[#737373]">Đang tải...</p>}
        {!loading && items.length === 0 && (
          <p className="p-4 text-sm text-[#737373]">Không có dữ liệu</p>
        )}
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item.id)}
            className={cn(
              "flex shrink-0 flex-col gap-1 border-b border-[#f5f5f5] p-4 text-left",
              item.id === selectedId ? "bg-[#f5f5f5]" : "bg-white hover:bg-[#fafafa]",
              !onSelect && "cursor-default"
            )}
          >
            <p className="w-full truncate text-base font-semibold leading-6 text-[#0a0a0a]">
              <RowName name={item.name} />
            </p>
            <div className="flex w-full items-center gap-2 whitespace-nowrap text-sm leading-5">
              {item.sub && <span className="truncate text-[#0a0a0a]">{item.sub}</span>}
              {item.sub && <span className="text-[#737373]">•</span>}
              <span className={cn("font-medium", item.active ? "text-[#0588f0]" : "text-[#737373]")}>
                {item.active ? "Hoạt động" : "Ngừng hoạt động"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AddressManagerPage() {
  const { provinces, districts } = useAdminContext();
  const [mode, setMode] = useState<AddressMode>("new");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [provinceId, setProvinceId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const [wardId, setWardId] = useState<number>();

  useEffect(() => {
    if (!provinceId && provinces.length) setProvinceId(provinces[0].Id);
  }, [provinces, provinceId]);

  const provinceDistricts = useMemo(
    () => districts.filter((d) => d.ProvinceId === provinceId),
    [districts, provinceId]
  );

  useEffect(() => {
    setDistrictId(provinceDistricts[0]?.Id);
    setWardId(undefined);
  }, [provinceDistricts]);

  // Địa chỉ mới: Phường/Xã + Đường đều theo ProvinceId (IsNew).
  const newWards = useSWR(
    mode === "new" && provinceId ? ["addr-ward-new", provinceId] : null,
    () => wardApi.get({ ...PAGE_ALL, ProvinceId: provinceId, IsNew: true })
  );
  const newStreets = useSWR(
    mode === "new" && provinceId ? ["addr-street-new", provinceId] : null,
    () => streetApi.get({ ...PAGE_ALL, ProvinceId: provinceId, IsNew: true })
  );
  // Địa chỉ cũ: Quận/Huyện (cũ) → Phường/Xã (cũ) theo DistrictId.
  const oldWards = useSWR(
    mode === "old" && districtId ? ["addr-ward-old", districtId] : null,
    () => wardApi.get({ ...PAGE_ALL, DistrictId: districtId })
  );

  const q = norm(query.trim());
  const keep = (i: Item) =>
    (!q || norm(i.keywords).includes(q)) &&
    (status === "all" || (status === "active") === i.active);

  const provinceItems: Item[] = provinces.map((p) => ({
    id: p.Id,
    name: `${p.Type ?? ""} ${p.Name}`.trim(),
    sub: p.ShortName ? `(${p.ShortName})` : undefined,
    keywords: `${p.Name} ${p.ShortName ?? ""} ${p.RefKey ?? ""} ${p.Slug ?? ""}`,
    active: isActive(p),
  }));

  const wardItems = (rows: typeof newWards.data, withDistrict: boolean): Item[] =>
    (rows?.data ?? []).map((w) => ({
      id: w.Id,
      name: w.Name,
      sub: withDistrict && w.DistrictName ? `(${w.DistrictName} cũ)` : undefined,
      keywords: `${w.Name} ${w.RefKey ?? ""} ${w.Slug ?? ""} ${w.DistrictName ?? ""}`,
      active: isActive(w),
    }));

  const streetItems: Item[] = (newStreets.data?.data ?? []).map((s) => ({
    id: s.Id,
    name: s.Name,
    keywords: `${s.Name} ${s.RefKey ?? ""} ${s.Slug ?? ""}`,
    active: isActive(s),
  }));

  const districtItems: Item[] = provinceDistricts.map((d) => ({
    id: d.Id,
    name: d.Name,
    keywords: `${d.Name} ${d.RefKey ?? ""} ${d.Slug ?? ""}`,
    active: isActive(d),
  }));

  return (
    <div className="relative flex min-h-[calc(100vh-156px)] flex-col bg-[#fbfbfd] font-[Inter,sans-serif]">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="whitespace-nowrap text-2xl font-bold leading-8 text-[#0a0a0a]">
          QUẢN LÝ ĐỊA CHỈ
        </h1>
        <div className="flex min-w-px flex-1 items-center justify-end gap-1 pl-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm nhanh theo Tên, Mã hành chính (Vd: Hồ Chí Minh, 79,...)"
            className="h-10 w-[480px] rounded-[10px] border-[#e5e5e5] bg-white p-3 text-sm font-medium placeholder:text-[#737373]"
          />
          <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <SelectTrigger className="h-10 w-[200px] rounded-[10px] border-[#e5e5e5] bg-white p-3 text-sm font-medium text-[#0a0a0a] shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#f5f5f5] py-3 pl-6 pr-4">
        <div className="flex min-w-px flex-1 items-center gap-3">
          <span className="size-2.5 shrink-0 rounded-full bg-black" />
          <p className="flex-1 text-base font-medium leading-6 text-[#0a0a0a]">
            Sơ đồ 3 Cấp Địa giới Hành chính Việt Nam (Tỉnh/Thành ➔ Phường/Xã ➔ Đường) hiển thị đồng bộ
          </p>
        </div>
        <Tabs value={mode} onValueChange={(v) => setMode(v as AddressMode)}>
          <TabsList className="h-9 rounded-[10px] bg-[#e5e5e5] p-[3px]">
            <TabsTrigger
              value="new"
              className="h-7 rounded-lg px-2 py-1 data-[state=active]:bg-[#0588f0] data-[state=active]:text-white"
            >
              Địa chỉ mới
            </TabsTrigger>
            <TabsTrigger value="old" className="h-7 rounded-lg px-2 py-1">
              Địa chỉ cũ
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex min-h-0 flex-1 gap-4 py-4 pl-6 pr-4" style={{ height: 748 }}>
        <Column
          title="TỈNH/THÀNH PHỐ"
          items={provinceItems.filter(keep)}
          selectedId={provinceId}
          onSelect={setProvinceId}
        />
        {mode === "new" ? (
          <>
            <Column
              title="PHƯỜNG/XÃ (mới)"
              items={wardItems(newWards.data, true).filter(keep)}
              selectedId={wardId}
              onSelect={setWardId}
              loading={newWards.isLoading}
            />
            <Column
              title="ĐƯỜNG"
              items={streetItems.filter(keep)}
              loading={newStreets.isLoading}
            />
          </>
        ) : (
          <>
            <Column
              title="QUẬN/HUYỆN (cũ)"
              items={districtItems.filter(keep)}
              selectedId={districtId}
              onSelect={(id) => {
                setDistrictId(id);
                setWardId(undefined);
              }}
            />
            <Column
              title="PHƯỜNG/XÃ (cũ)"
              items={wardItems(oldWards.data, false).filter(keep)}
              selectedId={wardId}
              onSelect={setWardId}
              loading={oldWards.isLoading}
            />
          </>
        )}
      </div>

      <button
        type="button"
        aria-label="Thêm mới địa giới"
        className="absolute bottom-6 right-6 flex size-10 items-center justify-center rounded-full bg-[#0588f0] text-white shadow-[0_10px_10px_rgba(0,0,0,0.1),0_0_4px_rgba(0,0,0,0.08)]"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}