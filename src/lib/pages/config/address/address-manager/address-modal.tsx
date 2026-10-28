"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { cn } from "@/lib/utils";
import districtApi from "@/services/api/districtApi";
import provinceApi from "@/services/api/provinceApi";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";
import mergeWardApi from "@/services/api/mergeWardApi";

type WardDraft = {
  key: number;
  id?: number;
  name: string;
  oldDistrictId?: number;
  newWardId?: number;
};
type DistrictDraft = { key: number; name: string; wards: WardDraft[] };

type Opt = { id: number; name: string; districtId?: number };

type Props = {
  open: boolean;
  mode: "new" | "old";
  intent?: "create" | "edit";
  initialWard?: { id: number; name: string; oldDistrictId?: number; newWardId?: number };
  initialStreet?: { id: number; name: string; shortName?: string; wardId?: number; oldWardId?: number; districtId: number };
  initialProvince?: { id: number; name: string };
  initialDistrict?: { id: number; name: string };
  createKind?: "province" | "district" | "ward" | "street";
  selectedWardId?: number;
  selectedMappedWardId?: number;
  selectedOldDistrictId?: number;
  selectedDistrictId?: number;
  provinceId?: number;
  provinceName?: string;
  provinceOptions: Opt[];
  onProvinceChange: (id: number) => void;
  oldDistricts: Opt[];
  onClose: () => void;
  onSaved: () => void;
};

let seq = 0;
const k = () => ++seq;
const newWard = (): WardDraft => ({ key: k(), name: "" });
const newDistrict = (): DistrictDraft => ({ key: k(), name: "", wards: [] });

// Field có label nổi + dấu * đỏ như Figma.
function Field({
  label,
  required = true,
  className,
  children,
  active = false,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className={cn("group/field relative min-w-0 flex-1", className)}>
      <span
        className={cn(
          "pointer-events-none absolute left-3 z-10 flex items-center gap-1 px-1 leading-4 transition-all duration-150",
          active
            ? "-top-2 bg-white text-[11px] text-[#737373]"
            : "top-1/2 -translate-y-1/2 bg-transparent text-[13px] text-[#737373] group-focus-within/field:-top-2 group-focus-within/field:translate-y-0 group-focus-within/field:bg-white group-focus-within/field:text-[11px] group-focus-within/field:text-[#0588f0]"
        )}
      >
        {label}
        {required && <span className="text-[10px] text-[#ef4444]">*</span>}
      </span>
      {children}
    </div>
  );
}

const inputCls =
  "h-9 rounded-[10px] border-[#e5e5e5] bg-white px-3 text-[13px] font-medium text-[#0a0a0a] shadow-none focus:border-[#0588f0] focus:ring-2 focus:ring-[#0588f0]/20 focus-visible:border-[#0588f0] focus-visible:ring-2 focus-visible:ring-[#0588f0]/20";

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label} active={Boolean(value)}>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </Field>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: number;
  options: Opt[];
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label} active={Boolean(value)}>
      <SearchableSelect
        value={value ? String(value) : ""}
        onValueChange={(v) => onChange(Number(v))}
        aria-label={label}
        placeholder=" "
        searchPlaceholder={`Tìm ${label.toLocaleLowerCase("vi")}...`}
        options={options.map((option) => ({
          value: String(option.id),
          label: option.name,
        }))}
        className={cn(inputCls, "h-9 w-full justify-between text-[13px]")}
      />
    </Field>
  );
}

function WardGroup({
  index,
  ward,
  mode,
  oldDistricts,
  newWardOptions,
  onChange,
  onRemove,
}: {
  index: number;
  ward: WardDraft;
  mode: "new" | "old";
  oldDistricts: Opt[];
  newWardOptions: Opt[];
  onChange: (w: WardDraft) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#e5e5e5] bg-white px-5 py-2">
      <div className="flex items-center gap-4">
        <p className="flex-1 text-[13px] font-medium text-[#0a0a0a]">
          Phường/Xã: <span className="text-[#0588f0]">#{index}</span>
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" aria-label={`Xóa Phường/Xã ${index}`} onClick={onRemove} className="rounded p-1 text-[#525252] hover:bg-[#fff1f0] hover:text-[#dc3e42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc3e42]/30">
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Xóa Phường/Xã</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex gap-3 pt-1">
        <TextField label="Phường/Xã" value={ward.name} onChange={(name) => onChange({ ...ward, name })} />
        {mode === "new" ? (
          <SelectField
            label="Thuộc Quận/Huyện cũ"
            value={ward.oldDistrictId}
            options={oldDistricts}
            onChange={(oldDistrictId) => onChange({ ...ward, oldDistrictId })}
          />
        ) : (
          <SelectField
            label="Nay thuộc Phường/Xã mới"
            value={ward.newWardId}
            options={newWardOptions}
            onChange={(newWardId) => onChange({ ...ward, newWardId })}
          />
        )}
      </div>
    </div>
  );
}

function DashedAdd({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#0588f0] bg-white px-4 py-1.5 text-sm font-medium text-[#0588f0]"
    >
      <Plus size={14} />
      {label}
    </button>
  );
}

export default function AddressModal({
  open,
  mode,
  intent = "create",
  initialWard,
  initialStreet,
  initialProvince,
  initialDistrict,
  createKind = "ward",
  selectedWardId,
  selectedMappedWardId,
  selectedOldDistrictId,
  selectedDistrictId,
  provinceId,
  provinceName,
  provinceOptions,
  onProvinceChange,
  oldDistricts,
  onClose,
  onSaved,
}: Props) {
  const [wards, setWards] = useState<WardDraft[]>([]);
  const [districts, setDistricts] = useState<DistrictDraft[]>([newDistrict()]);
  const [saving, setSaving] = useState(false);
  const [streetName, setStreetName] = useState("");
  const [streetShortName, setStreetShortName] = useState("");
  const [entityName, setEntityName] = useState("");
  const [streetOldWardId, setStreetOldWardId] = useState<number>();
  const [streetWardId, setStreetWardId] = useState<number>();
  const [streetDistrictId, setStreetDistrictId] = useState<number>();
  const newWards = useSWR(
    open && provinceId && (createKind === "street" || mode === "old")
      ? ["modal-street-new-wards", provinceId]
      : null,
    () => wardApi.get({ pageIndex: 1, pageSize: 10000, ProvinceId: provinceId, IsNew: true })
  );
  const newWardOpts: Opt[] = (newWards.data?.data ?? []).map((ward) => ({
    id: ward.Id,
    name: ward.Name,
    districtId: ward.DistrictId,
  }));
  const streetOldWards = useSWR(
    streetDistrictId ? ["modal-street-old-wards", streetDistrictId] : null,
    () => wardApi.get({ pageIndex: 1, pageSize: 10000, DistrictId: streetDistrictId, IsNew: false })
  );
  const streetOldWardOpts: Opt[] = (streetOldWards.data?.data ?? []).map((w) => ({
    id: w.Id,
    name: w.Name,
    districtId: w.DistrictId,
  }));

  useEffect(() => {
    if (!open) return;
    setWards(
      intent === "edit" && initialWard
        ? [{ ...newWard(), id: initialWard.id, name: initialWard.name, oldDistrictId: initialWard.oldDistrictId, newWardId: initialWard.newWardId }]
        : mode === "old" && createKind === "ward"
          ? [newWard()]
          : []
    );
    setDistricts(mode === "old" && createKind === "district" ? [] : [newDistrict()]);
    setStreetName(initialStreet?.name ?? "");
    setStreetShortName(initialStreet?.shortName ?? "");
    setStreetOldWardId(initialStreet?.oldWardId ?? (mode === "old" && createKind === "street" ? selectedWardId : undefined));
    setStreetWardId(initialStreet?.wardId ?? (mode === "new" ? selectedWardId : selectedMappedWardId));
    setStreetDistrictId(initialStreet?.districtId ?? selectedOldDistrictId ?? selectedDistrictId);
    setEntityName(initialProvince?.name ?? initialDistrict?.name ?? "");
  }, [open, intent, mode, createKind, selectedWardId, selectedMappedWardId, selectedOldDistrictId, selectedDistrictId, initialWard?.id, initialWard?.name, initialWard?.oldDistrictId, initialWard?.newWardId, initialStreet?.id, initialStreet?.name, initialStreet?.shortName, initialStreet?.oldWardId, initialStreet?.wardId, initialStreet?.districtId, initialProvince?.id, initialProvince?.name, initialDistrict?.id, initialDistrict?.name]);

  const reset = () => {
    setWards([]);
    setDistricts([newDistrict()]);
  };
  const close = () => {
    reset();
    onClose();
  };

  const patchWard = (list: WardDraft[], w: WardDraft) => list.map((x) => (x.key === w.key ? w : x));

  const save = async () => {
    if (!provinceId && createKind !== "province" && !initialProvince) return toast.error("Chưa chọn Tỉnh/Thành phố");
    if (mode === "new" && !initialStreet && !initialProvince && !initialDistrict && !["street", "province", "district"].includes(createKind) && !wards.some((ward) => ward.name.trim())) {
      return toast.error("Vui lòng thêm Phường/Xã trước khi lưu");
    }
    const base = (Name: string) => ({
      Id: 0,
      Name,
      ShortName: Name,
      RefKey: "",
      Type: "",
      Images: "",
    });

    setSaving(true);
    try {
      if (initialProvince) {
        const name = entityName.trim();
        if (!name) throw new Error("Vui lòng nhập tên Tỉnh/Thành phố");
        await provinceApi.update({ ...base(name), Id: initialProvince.id });
      } else if (initialDistrict) {
        const name = entityName.trim();
        if (!name) throw new Error("Vui lòng nhập tên Quận/Huyện");
        if (!provinceId) throw new Error("Chưa chọn Tỉnh/Thành phố");
        await districtApi.update({ ...base(name), Id: initialDistrict.id, ProvinceId: provinceId });
      } else if (!initialStreet && createKind === "province") {
        const name = entityName.trim();
        if (!name) throw new Error("Vui lòng nhập tên Tỉnh/Thành phố");
        await provinceApi.add(base(name));
      } else if (!initialWard && !initialStreet && mode === "old" && createKind === "ward") {
        if (!selectedDistrictId) throw new Error("Vui lòng chọn Quận/Huyện trước khi thêm phường");
        const wardsToCreate = wards.filter((ward) => ward.name.trim());
        if (!wardsToCreate.length) throw new Error("Vui lòng thêm Phường/Xã trước khi lưu");
        for (const ward of wardsToCreate) {
          if (!ward.newWardId) throw new Error(`Vui lòng chọn Phường/Xã mới cho "${ward.name.trim()}"`);
        }
        for (const ward of wardsToCreate) {
          const createdWard = await wardApi.add({ ...base(ward.name.trim()), DistrictId: selectedDistrictId, IsNew: false });
          await mergeWardApi.add({ OldWardId: Number(createdWard.data), NewWardId: ward.newWardId!, Description: "" });
        }
      } else if (!initialStreet && mode === "old" && createKind === "street") {
        const name = streetName.trim();
        if (!name) throw new Error("Vui lòng nhập tên đường");
        if (!streetDistrictId) throw new Error("Vui lòng chọn Quận/Huyện trước khi thêm đường");
        if (!streetOldWardId) throw new Error("Vui lòng chọn Phường/Xã cũ");
        if (!streetWardId) throw new Error("Vui lòng chọn Phường/Xã mới tương ứng");
        await streetApi.add({
          ...base(name),
          ShortName: streetShortName.trim() || name,
          DistrictId: streetDistrictId,
          WardId: streetWardId ?? null,
          OldWardId: streetOldWardId ?? selectedWardId ?? null,
        });
      } else if (initialStreet) {
        const name = streetName.trim();
        if (!name) throw new Error("Vui lòng nhập tên đường");
        const oldDistrictId = streetDistrictId ?? streetOldWardOpts.find((w) => w.id === streetOldWardId)?.districtId ?? initialStreet.districtId;
        await streetApi.update({
          ...base(name),
          ShortName: streetShortName.trim() || initialStreet.shortName || name,
          Id: initialStreet.id,
          DistrictId: oldDistrictId,
          WardId: streetWardId ?? selectedWardId ?? initialStreet.wardId ?? null,
          OldWardId: streetOldWardId ?? null,
          UpdateWardLinks: true,
        });
      } else if (mode === "new" && createKind === "street") {
        const name = streetName.trim();
        if (!name) throw new Error("Vui lòng nhập tên đường");
        if (!streetWardId) throw new Error("Vui lòng chọn Phường/Xã mới trước khi thêm đường");
        if (!streetOldWardId) throw new Error("Vui lòng chọn Phường/Xã cũ");
        const districtId = streetDistrictId ?? streetOldWardOpts.find((w) => w.id === streetOldWardId)?.districtId ?? selectedOldDistrictId;
        if (!districtId) throw new Error("Không tìm thấy Quận/Huyện cũ của Phường/Xã mới");
        await streetApi.add({
          ...base(name),
          ShortName: streetShortName.trim() || name,
          DistrictId: districtId,
          WardId: streetWardId ?? selectedWardId,
          OldWardId: streetOldWardId ?? null,
        });
      } else if (initialWard) {
        const wardsToSave = wards.filter((ward) => ward.name.trim());
        if (!wardsToSave.length) throw new Error("Vui lòng nhập tên Phường/Xã");
        const mappings = mode === "old" ? await mergeWardApi.get() : undefined;
        const mappingsByOldWard = new Map(
          (mappings?.data ?? []).map((mapping) => [mapping.OldWardId, mapping])
        );
        for (const ward of wardsToSave) {
          const oldDistrictId = ward.oldDistrictId ?? initialWard.oldDistrictId ?? selectedDistrictId;
          if (mode === "new" && !oldDistrictId) throw new Error(`Vui lòng chọn Quận/Huyện cũ cho "${ward.name.trim()}"`);
          if (mode === "old" && !ward.newWardId) throw new Error(`Vui lòng chọn Phường/Xã mới cho "${ward.name.trim()}"`);
          if (mode === "old" && !oldDistrictId) throw new Error("Vui lòng chọn Quận/Huyện cũ");
          const payload = {
            ...base(ward.name.trim()),
            Id: ward.id ?? 0,
            ...(mode === "old"
              ? { DistrictId: oldDistrictId }
              : { ProvinceId: provinceId, DistrictId: oldDistrictId }),
            IsNew: mode === "new",
          };
          const savedWard = ward.id
            ? await wardApi.update(payload)
            : await wardApi.add(payload);
          if (mode === "old" && ward.newWardId) {
            const oldWardId = ward.id ?? Number(savedWard.data);
            const existing = mappingsByOldWard.get(oldWardId);
            if (existing) {
              await mergeWardApi.update(existing.Id, { NewWardId: ward.newWardId, Description: "" });
            } else {
              await mergeWardApi.add({ OldWardId: oldWardId, NewWardId: ward.newWardId, Description: "" });
            }
          }
        }
      } else if (mode === "new") {
        for (const w of wards.filter((x) => x.name.trim())) {
          if (!provinceId) throw new Error("Chưa chọn Tỉnh/Thành phố");
          if (!w.oldDistrictId) throw new Error(`Vui lòng chọn Quận/Huyện cũ cho Phường/Xã "${w.name.trim()}"`);
          const wardPayload = {
            ...base(w.name.trim()),
            Id: w.id ?? 0,
            IsNew: true,
            ProvinceId: provinceId,
            DistrictId: w.oldDistrictId,
          };
          if (w.id) await wardApi.update(wardPayload);
          else await wardApi.add(wardPayload);
        }
      } else {
        if (!provinceId) throw new Error("Chưa chọn Tỉnh/Thành phố");
        const districtsToCreate = districts.filter((d) => d.name.trim());
        if (!districtsToCreate.length) throw new Error("Vui lòng thêm Quận/Huyện trước khi lưu");
        for (const district of districtsToCreate) {
          for (const ward of district.wards.filter((item) => item.name.trim())) {
            if (!ward.newWardId) throw new Error(`Vui lòng chọn Phường/Xã mới cho "${ward.name.trim()}"`);
          }
        }
        for (const d of districtsToCreate) {
          const created = await districtApi.add({
            ...base(d.name.trim()),
            ProvinceId: provinceId,
          });
          const districtId = Number(created.data);
          for (const w of d.wards.filter((x) => x.name.trim())) {
            const createdWard = await wardApi.add({
              ...base(w.name.trim()),
              DistrictId: districtId,
              IsNew: false,
            });
            const oldWardId = Number(createdWard.data);
            await mergeWardApi.add({ OldWardId: oldWardId, NewWardId: w.newWardId!, Description: "" });
          }
        }
      }
      toast.success("Đã lưu thông tin địa giới");
      reset();
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lưu thất bại, vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[780px]">
        <div className="border-b border-[#f5f5f5] px-5 py-3.5">
          <DialogTitle className="text-base font-bold text-[#0a0a0a]">
            {intent === "edit"
              ? createKind === "street" ? "CHỈNH SỬA ĐỊA GIỚI - TÊN ĐƯỜNG" : "CHỈNH SỬA ĐỊA GIỚI"
              : createKind === "street" ? "THÊM MỚI ĐỊA GIỚI - TÊN ĐƯỜNG" : "THÊM MỚI ĐỊA GIỚI"}
          </DialogTitle>
          <DialogDescription className="sr-only">Thêm mới đơn vị hành chính</DialogDescription>
        </div>

        <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-8 py-5">
          {createKind !== "province" && (
            <div className="flex">
              {initialProvince ? (
                <Field label="Thuộc Tỉnh/Thành phố" active={Boolean(provinceName)}>
                  <Input
                    disabled
                    value={provinceName ?? ""}
                    className={cn(inputCls, "bg-[#f5f5f5] text-[#a1a1aa] disabled:opacity-100")}
                  />
                </Field>
              ) : (
                <SelectField
                  label="Thuộc Tỉnh/Thành phố"
                  value={provinceId}
                  options={provinceOptions}
                  onChange={onProvinceChange}
                />
              )}
            </div>
          )}

          {initialProvince || initialDistrict || createKind === "province" ? (
            <TextField label={initialProvince || createKind === "province" ? "Tên Tỉnh/Thành phố" : "Tên Quận/Huyện"} value={entityName} onChange={setEntityName} />
          ) : initialStreet || createKind === "street" ? (
            <div className="flex flex-col gap-3">
              {mode === "new" ? (
                <div className="flex gap-3">
                  <SelectField
                    label="Thuộc Phường/Xã"
                    value={streetWardId}
                    options={newWardOpts}
                    onChange={setStreetWardId}
                  />
                  <SelectField
                    label="Thuộc Quận/Huyện cũ"
                    value={streetDistrictId}
                    options={oldDistricts}
                    onChange={(id) => {
                      setStreetDistrictId(id);
                      setStreetOldWardId(undefined);
                    }}
                  />
                </div>
              ) : (
                <div className="flex gap-3">
                  <SelectField
                    label="Thuộc Quận/Huyện"
                    value={streetDistrictId}
                    options={oldDistricts}
                    onChange={(id) => {
                      setStreetDistrictId(id);
                      setStreetOldWardId(undefined);
                    }}
                  />
                  <SelectField
                    label="Thuộc Phường/Xã"
                    value={streetOldWardId}
                    options={streetOldWardOpts}
                    onChange={setStreetOldWardId}
                  />
                  <SelectField
                    label="Nay thuộc Phường/Xã mới"
                    value={streetWardId}
                    options={newWardOpts}
                    onChange={setStreetWardId}
                  />
                </div>
              )}
              <div className="flex gap-3">
                <TextField label="Tên đường" value={streetName} onChange={setStreetName} />
                {mode === "new" ? (
                  <SelectField
                    label="Thuộc Phường/Xã cũ"
                    value={streetOldWardId}
                    options={streetOldWardOpts}
                    onChange={setStreetOldWardId}
                  />
                ) : (
                  <TextField label="Tên viết tắt" value={streetShortName} onChange={setStreetShortName} />
                )}
              </div>
            </div>
          ) : mode === "new" || initialWard || (mode === "old" && createKind === "ward") ? (
            <>
              {wards.map((w, i) => (
                <WardGroup
                  key={w.key}
                  index={i + 1}
                  ward={w}
                  mode={mode}
                  oldDistricts={oldDistricts}
                  newWardOptions={newWardOpts}
                  onChange={(nw) => setWards((l) => patchWard(l, nw))}
                  onRemove={() => setWards((l) => l.filter((x) => x.key !== w.key))}
                />
              ))}
              <DashedAdd
                label="Thêm mới Phường/Xã"
                onClick={() => setWards((l) => [...l, newWard()])}
              />
            </>
          ) : (
            <>
              {districts.map((d, di) => (
                <div
                  key={d.key}
                  className="flex flex-col gap-3 border-b border-[#e5e5e5] pb-4"
                >
                  <div className="flex items-center gap-2">
                    <p className="flex-1 py-2 text-[13px] font-medium text-[#0a0a0a]">
                      Quận/Huyện<span className="text-[#dc3e42]">*</span>: <span className="text-[#0588f0]">#{di + 1}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setDistricts((l) => l.filter((x) => x.key !== d.key))}
                      aria-label={`Xóa Quận/Huyện ${di + 1}`}
                      title="Xóa Quận/Huyện"
                      className="rounded p-1 text-[#525252] hover:bg-[#fff1f0] hover:text-[#dc3e42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc3e42]/30"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDistricts((l) => l.map((x) =>
                          x.key === d.key ? { ...x, wards: [...x.wards, newWard()] } : x
                        ))
                      }
                      className="inline-flex items-center gap-1 rounded-md bg-[#0588f0] px-2.5 py-1 text-[12px] font-medium text-white"
                    >
                      <Plus size={14} />
                      Thêm Phường/Xã
                    </button>
                  </div>
                  <div className="flex pt-1">
                    <TextField
                      label="Quận/Huyện"
                      value={d.name}
                      onChange={(name) =>
                        setDistricts((l) => l.map((x) => (x.key === d.key ? { ...x, name } : x)))
                      }
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    {d.wards.map((w, wi) => (
                      <WardGroup
                        key={w.key}
                        index={wi + 1}
                        ward={w}
                        mode={mode}
                        oldDistricts={oldDistricts}
                        newWardOptions={newWardOpts}
                        onChange={(nw) =>
                          setDistricts((l) =>
                            l.map((x) => (x.key === d.key ? { ...x, wards: patchWard(x.wards, nw) } : x))
                          )
                        }
                        onRemove={() =>
                          setDistricts((l) =>
                            l.map((x) =>
                              x.key === d.key ? { ...x, wards: x.wards.filter((y) => y.key !== w.key) } : x
                            )
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
              <DashedAdd
                label="Thêm mới Quận/Huyện"
                onClick={() => setDistricts((l) => [...l, newDistrict()])}
              />
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e5e5e5] bg-white px-5 py-3">
          <button
            type="button"
            onClick={close}
            className="rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-1.5 text-sm font-medium text-[#0a0a0a]"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="rounded-[10px] bg-[#0588f0] px-4 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : intent === "edit" ? "Cập nhật thay đổi" : "Lưu thông tin"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
