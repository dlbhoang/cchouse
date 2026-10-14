"use client";

import { CircleX, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type AddressMode = "new" | "old";
type StatusFilter = "all" | "active" | "inactive";

type Item = {
  kind: "province" | "district" | "ward" | "street";
  id: number;
  name: string;
  sub?: string;
  keywords: string;
  active: boolean;
  oldDistrictId?: number;
  districtId?: number;
  oldWardId?: number;
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
  onAdd,
  onEdit,
  onDelete,
  emptyMessage,
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
}) {
  return (
    <div className="flex h-full min-w-px flex-1 flex-col overflow-hidden rounded-xl border border-[#f5f5f5] bg-white">
      <div className="flex shrink-0 items-center gap-3 bg-[#dbeafe] px-3 py-2.5">
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
      <div className="scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overscroll-contain flex min-h-0 flex-1 flex-col overflow-y-auto hover:scrollbar-thumb-neutral-400">
        {loading && <p className="p-3 text-xs text-[#737373]">Đang tải...</p>}
        {!loading && items.length === 0 && (
          <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-2 text-center text-[#737373]">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#f0edff] text-[#7563d9]">
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
              item.id === selectedId ? "border-l-[#0588f0] bg-[#eff6ff]" : "bg-white hover:bg-[#fafafa]",
              !onSelect && "cursor-default"
            )}
          >
            <button
              type="button"
              onClick={() => onSelect?.(item.id)}
              className="flex min-w-0 flex-1 flex-col gap-0.5 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0588f0]"
            >
              <p className="w-full truncate text-sm font-semibold leading-5 text-[#0a0a0a]">
                <RowName name={item.name} />
              </p>
              <div className="flex w-full items-start gap-1.5 text-xs leading-4">
                {item.sub && <span title={item.sub} className="line-clamp-2 whitespace-normal text-[#0a0a0a]">{item.sub}</span>}
                {item.sub && <span className="shrink-0 text-[#737373]">•</span>}
                <span className={cn("shrink-0 font-medium", item.active ? "text-[#0588f0]" : "text-[#737373]")}>
                  {item.active ? "Hoạt động" : "Ngừng hoạt động"}
                </span>
              </div>
            </button>
            {(onEdit || onDelete) && item.managed !== false && (
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {onEdit && (
                  <button type="button" aria-label={`Chỉnh sửa ${item.name}`} onClick={() => onEdit(item)} className="rounded p-1 text-[#525252] hover:bg-white">
                    <Pencil size={14} />
                  </button>
                )}
                {onDelete && (
                  <button type="button" aria-label={`Xóa ${item.name}`} onClick={() => onDelete(item)} className="rounded p-1 text-[#dc3e42] hover:bg-white">
                    <Trash2 size={14} />
                  </button>
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
  const [status, setStatus] = useState<StatusFilter>("all");
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
  const provinceDistricts = useMemo(
    () => mode === "old"
      ? oldDistricts.data?.data ?? []
      : districts.filter((d) => d.ProvinceId === provinceId),
    [districts, mode, oldDistricts.data, provinceId]
  );

  useEffect(() => {
    setDistrictId(provinceDistricts[0]?.Id);
    setWardId(undefined);
  }, [provinceDistricts]);

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
  // Địa chỉ cũ: Quận/Huyện (cũ) → Phường/Xã (cũ) theo DistrictId.
  const oldWards = useSWR(
    mode === "old" && districtId ? ["addr-ward-old", districtId] : null,
    () => wardApi.get({ ...PAGE_ALL, DistrictId: districtId, IsNew: false })
  );
  const oldStreets = useSWR(
    mode === "old" && districtId ? ["addr-street-old", districtId] : null,
    () => streetApi.get({ ...PAGE_ALL, DistrictId: districtId, IsNew: false })
  );

  const q = norm(query.trim());
  const keep = (i: Item) =>
    (!q || norm(i.keywords).includes(q)) &&
    (status === "all" || (status === "active") === i.active);

  const provinceItems: Item[] = provinces.map((p) => ({
    kind: "province",
    id: p.Id,
    name: `${p.Type ?? ""} ${p.Name}`.trim(),
    sub: p.ShortName ? `(${p.ShortName})` : undefined,
    keywords: `${p.Name} ${p.ShortName ?? ""} ${p.RefKey ?? ""} ${p.Slug ?? ""}`,
    active: isActive(p),
  }));

  const wardItems = (rows: typeof newWards.data, withDistrict: boolean): Item[] =>
    (rows?.data ?? []).map((w) => ({
      kind: "ward",
      id: w.Id,
      name: w.Name,
      oldDistrictId: w.DistrictId,
      sub: withDistrict && w.DistrictName ? `(${w.DistrictName} cũ)` : undefined,
      keywords: `${w.Name} ${w.RefKey ?? ""} ${w.Slug ?? ""} ${w.DistrictName ?? ""}`,
      active: isActive(w),
    }));

  const newWardRows = (newWards.data?.data ?? []).filter((ward) =>
    ward.ProvinceId === provinceId
  );
  const newWardItems: Item[] = newWardRows.map((ward) => ({
    kind: "ward",
    id: ward.Id,
    name: ward.Name,
    oldDistrictId: ward.DistrictId,
    keywords: `${ward.Name} ${ward.RefKey ?? ""} ${ward.Slug ?? ""}`,
    active: isActive(ward),
  }));

  useEffect(() => {
    if (mode === "new") setWardId(newWardItems[0]?.id);
  }, [mode, provinceId, newWards.data]);

  const streetItems: Item[] = (newStreets.data?.data ?? [])
    .filter((street) => street.WardId === wardId)
    .map((s) => ({
      kind: "street",
      id: s.Id,
      name: s.Name,
      wardId: s.WardId ?? undefined,
      districtId: s.DistrictId,
      oldWardId: s.OldWardId ?? undefined,
      keywords: `${s.Name} ${s.RefKey ?? ""} ${s.Slug ?? ""}`,
      active: isActive(s),
    }));
  const oldStreetItems: Item[] = (oldStreets.data?.data ?? []).map((s) => ({
    kind: "street",
    id: s.Id,
    name: s.Name,
    wardId: s.WardId ?? undefined,
    districtId: s.DistrictId,
    oldWardId: s.OldWardId ?? undefined,
    keywords: `${s.Name} ${s.RefKey ?? ""} ${s.Slug ?? ""}`,
    active: isActive(s),
  }));

  const districtItems: Item[] = provinceDistricts.map((d) => ({
    kind: "district",
    id: d.Id,
    name: d.Name,
    keywords: `${d.Name} ${d.RefKey ?? ""} ${d.Slug ?? ""}`,
    active: isActive(d),
  }));

  return (
    <div className="relative flex h-[calc(100dvh-96px)] min-h-0 flex-col overflow-hidden bg-[#fbfbfd] font-[Inter,sans-serif]">
      <div className="flex items-center justify-between px-5 py-3">
        <h1 className="whitespace-nowrap text-xl font-bold leading-7 text-[#0a0a0a]">
          QUẢN LÝ ĐỊA CHỈ
        </h1>
        <div className="flex min-w-px flex-1 items-center justify-end gap-1 pl-4">
          <div className="relative w-[400px]">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#737373]"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm địa chỉ"
              className="h-9 rounded-[10px] border-[#e5e5e5] bg-white pl-9 pr-3 text-[13px] font-medium placeholder:text-[#737373] focus:border-[#0588f0] focus:ring-2 focus:ring-[#0588f0]/20 focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20"
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <SelectTrigger className="h-9 w-[170px] rounded-[10px] border-[#e5e5e5] bg-white px-3 text-[13px] font-medium text-[#0a0a0a] shadow-none">
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

      <div className="flex items-center gap-3 bg-[#f5f5f5] py-2 pl-5 pr-4">
        <div className="flex min-w-px flex-1 items-center gap-3">
          <span className="size-2 shrink-0 rounded-full bg-black" />
          <p className="flex-1 text-[13px] font-medium leading-5 text-[#0a0a0a]">
            Danh mục hành chính 2 cấp toàn quốc (Tỉnh/Thành ➔ Phường/Xã); 
          </p>
        </div>
        <Tabs
          value={mode}
          onValueChange={(value) => {
            const nextMode = value as AddressMode;
            setMode(nextMode);
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
          <TabsList className="h-8 rounded-[10px] bg-[#e5e5e5] p-[3px]">
            <TabsTrigger
              value="new"
              className="h-6 rounded-lg px-2 py-0 text-[13px] data-[state=active]:bg-[#0588f0] data-[state=active]:text-white focus-visible:ring-2 focus-visible:ring-[#0588f0]/30"
            >
              Địa chỉ mới
            </TabsTrigger>
            <TabsTrigger value="old" className="h-6 rounded-lg px-2 py-0 text-[13px] data-[state=active]:bg-[#0588f0] data-[state=active]:text-white focus-visible:ring-2 focus-visible:ring-[#0588f0]/30">
              Địa chỉ cũ
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 py-3 pl-5 pr-4" style={{ maxHeight: "min(70dvh, calc(100dvh - 250px), 640px)" }}>
        <Column
          onAdd={() => addNew("province")}
          onEdit={(item) => {
            setEditTarget(item);
            setCreateKind(item.kind);
            setModalOpen(true);
          }}
          onDelete={(item) => void deleteItem(item)}
          title="TỈNH/THÀNH PHỐ"
          items={provinceItems.filter(keep)}
          selectedId={provinceId}
          onSelect={setProvinceId}
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
              items={newWardItems.filter(keep)}
              selectedId={wardId}
              onSelect={(id) => setWardId(id)}
              loading={newWards.isLoading}
            />
            <Column
              onAdd={() => addNew("street")}
              onEdit={(item) => {
                setEditTarget(item);
                setCreateKind("ward");
                setModalOpen(true);
              }}
              onDelete={(item) => void deleteItem(item)}
              title="ĐƯỜNG"
              items={streetItems.filter(keep)}
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
              items={districtItems.filter(keep)}
              selectedId={districtId}
              loading={oldDistricts.isLoading}
              onSelect={(id) => {
                setDistrictId(id);
                setWardId(undefined);
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
              items={wardItems(oldWards.data, false).filter(keep)}
              selectedId={wardId}
              onSelect={setWardId}
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
              title="ĐƯỜNG (cũ)"
              items={oldStreetItems.filter(keep)}
              loading={oldStreets.isLoading}
            />
          </>
        )}
      </div>

      <button
        type="button"
        aria-label="Thêm mới địa giới"
        onClick={() => addNew()}
        className="fixed bottom-5 right-5 z-50 flex size-9 items-center justify-center rounded-full bg-[#0588f0] text-white shadow-[0_10px_10px_rgba(0,0,0,0.1),0_0_4px_rgba(0,0,0,0.08)]"
      >
        <Plus size={16} />
      </button>

      <AddressModal
        open={modalOpen}
        mode={mode}
        intent={editTarget ? "edit" : "create"}
        initialProvince={editTarget?.kind === "province" ? { id: editTarget.id, name: editTarget.name.replace(/^(Tỉnh|Thành phố)\s+/, "") } : undefined}
        initialDistrict={editTarget?.kind === "district" ? { id: editTarget.id, name: editTarget.name } : undefined}
        initialWard={editTarget?.kind === "ward" ? { id: editTarget.id, name: editTarget.name, oldDistrictId: editTarget.oldDistrictId } : undefined}
        initialStreet={editTarget?.kind === "street" ? { id: editTarget.id, name: editTarget.name, wardId: mode === "new" ? editTarget.wardId ?? wardId : undefined, oldWardId: editTarget.oldWardId, districtId: editTarget.districtId ?? districtId ?? 0 } : undefined}
        createKind={createKind}
        selectedWardId={editTarget?.kind === "street" && mode === "old" ? undefined : editTarget?.kind === "street" ? editTarget.wardId ?? wardId : wardId}
        selectedOldDistrictId={editTarget?.kind === "street" ? editTarget.districtId ?? districtId : editTarget?.kind === "ward" ? editTarget.oldDistrictId : mode === "old" ? districtId : newWardItems.find((item) => item.id === wardId)?.oldDistrictId}
        selectedDistrictId={districtId}
        provinceId={provinceId}
        provinceName={provinceItems.find((p) => p.id === provinceId)?.name}
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
