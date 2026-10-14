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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import districtApi from "@/services/api/districtApi";
import provinceApi from "@/services/api/provinceApi";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";

type StreetDraft = { key: number; name: string; oldWardId?: number };
type WardDraft = {
  key: number;
  id?: number;
  name: string;
  oldDistrictId?: number;
  streets: StreetDraft[];
};
type DistrictDraft = { key: number; name: string; wards: WardDraft[] };

type Opt = { id: number; name: string; districtId?: number };

type Props = {
  open: boolean;
  mode: "new" | "old";
  intent?: "create" | "edit";
  initialWard?: { id: number; name: string; oldDistrictId?: number };
  initialStreet?: { id: number; name: string; wardId?: number; oldWardId?: number; districtId: number };
  initialProvince?: { id: number; name: string };
  initialDistrict?: { id: number; name: string };
  createKind?: "province" | "district" | "ward" | "street";
  selectedWardId?: number;
  selectedOldDistrictId?: number;
  selectedDistrictId?: number;
  provinceId?: number;
  provinceName?: string;
  oldDistricts: Opt[];
  onClose: () => void;
  onSaved: () => void;
};

let seq = 0;
const k = () => ++seq;
const newStreet = (): StreetDraft => ({ key: k(), name: "" });
const newWard = (): WardDraft => ({ key: k(), name: "", streets: [newStreet()] });
const newDistrict = (): DistrictDraft => ({ key: k(), name: "", wards: [newWard()] });

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
      <Select value={value ? String(value) : ""} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className={cn(inputCls, "w-full")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.id} value={String(o.id)}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

const linkBtn = "px-3 py-1.5 text-[13px] font-medium text-[#0588f0] hover:underline";

function StreetRow({
  street,
  oldWards,
  onChange,
  onRemove,
}: {
  street: StreetDraft;
  oldWards: Opt[];
  onChange: (s: StreetDraft) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <TextField
        label="Tên đường"
        value={street.name}
        onChange={(name) => onChange({ ...street, name })}
      />
      <SelectField
        label="Thuộc Phường/Xã cũ"
        value={street.oldWardId}
        options={oldWards}
        onChange={(oldWardId) => onChange({ ...street, oldWardId })}
      />
      <button type="button" aria-label="Xoá đường" onClick={onRemove} className="text-[#dc3e42]">
        <Trash2 size={20} />
      </button>
    </div>
  );
}

function WardGroup({
  index,
  ward,
  mode,
  oldDistricts,
  onChange,
  onRemove,
  removeLabel = "x Bỏ",
}: {
  index: number;
  ward: WardDraft;
  mode: "new" | "old";
  oldDistricts: Opt[];
  onChange: (w: WardDraft) => void;
  onRemove: () => void;
  removeLabel?: string;
}) {
  const oldWards = useSWR(
    ward.oldDistrictId ? ["modal-old-wards", ward.oldDistrictId] : null,
    () => wardApi.get({ pageIndex: 1, pageSize: 10000, DistrictId: ward.oldDistrictId, IsNew: false })
  );
  const oldWardOpts: Opt[] = (oldWards.data?.data ?? []).map((w) => ({ id: w.Id, name: w.Name }));

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#e5e5e5] bg-white px-5 py-2">
      <div className="flex items-center gap-4">
        <p className="flex-1 text-[13px] font-medium text-[#0a0a0a]">
          Phường/Xã & Tên đường #{index}:
        </p>
        <button type="button" onClick={onRemove} className="px-3 py-1.5 text-[13px] font-medium underline">
          {removeLabel}
        </button>
      </div>
      <div className="flex gap-3 pt-1">
        <TextField label="Phường/Xã" value={ward.name} onChange={(name) => onChange({ ...ward, name })} />
        {mode === "old" && <SelectField
          label="Thuộc Quận/Huyện cũ"
          value={ward.oldDistrictId}
          options={oldDistricts}
          onChange={(oldDistrictId) => onChange({ ...ward, oldDistrictId })}
        />}
      </div>
      <p className="text-[13px] font-medium text-[#0a0a0a]">Danh sách Tên đường:</p>
      <div className="flex flex-col gap-3 pt-1">
        {ward.streets.map((s) => (
          <StreetRow
            key={s.key}
            street={s}
            oldWards={oldWardOpts}
            onChange={(ns) =>
              onChange({ ...ward, streets: ward.streets.map((x) => (x.key === s.key ? ns : x)) })
            }
            onRemove={() => onChange({ ...ward, streets: ward.streets.filter((x) => x.key !== s.key) })}
          />
        ))}
      </div>
      <button
        type="button"
        className={cn(linkBtn, "self-start")}
        onClick={() => onChange({ ...ward, streets: [...ward.streets, newStreet()] })}
      >
        + Thêm đường
      </button>
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
  selectedOldDistrictId,
  selectedDistrictId,
  provinceId,
  provinceName,
  oldDistricts,
  onClose,
  onSaved,
}: Props) {
  const [wards, setWards] = useState<WardDraft[]>([]);
  const [districts, setDistricts] = useState<DistrictDraft[]>([newDistrict()]);
  const [saving, setSaving] = useState(false);
  const [streetName, setStreetName] = useState("");
  const [entityName, setEntityName] = useState("");
  const [streetOldWardId, setStreetOldWardId] = useState<number>();
  const streetOldWards = useSWR(
    selectedOldDistrictId ? ["modal-street-old-wards", selectedOldDistrictId] : null,
    () => wardApi.get({ pageIndex: 1, pageSize: 10000, DistrictId: selectedOldDistrictId, IsNew: false })
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
        ? [{ ...newWard(), id: initialWard.id, name: initialWard.name, oldDistrictId: initialWard.oldDistrictId }]
        : []
    );
    setDistricts([newDistrict()]);
    setStreetName(initialStreet?.name ?? "");
    setStreetOldWardId(initialStreet?.oldWardId ?? (mode === "old" && createKind === "street" ? selectedWardId : undefined));
    setEntityName(initialProvince?.name ?? initialDistrict?.name ?? "");
  }, [open, intent, initialWard?.id, initialWard?.name, initialWard?.oldDistrictId, initialStreet?.id, initialStreet?.name, initialStreet?.oldWardId, initialProvince?.id, initialProvince?.name, initialDistrict?.id, initialDistrict?.name]);

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
    if (mode === "old" && createKind === "district" && !entityName.trim()) {
      return toast.error("Vui lòng nhập tên Quận/Huyện");
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
      } else if (!initialStreet && createKind === "district") {
        const name = entityName.trim();
        if (!name) throw new Error("Vui lòng nhập tên Quận/Huyện");
        if (!provinceId) throw new Error("Chưa chọn Tỉnh/Thành phố");
        await districtApi.add({ ...base(name), ProvinceId: provinceId });
      } else if (!initialWard && !initialStreet && mode === "old" && createKind === "ward") {
        const name = entityName.trim();
        if (!name) throw new Error("Vui lòng nhập tên Phường/Xã");
        if (!selectedDistrictId) throw new Error("Vui lòng chọn Quận/Huyện trước khi thêm phường");
        await wardApi.add({ ...base(name), DistrictId: selectedDistrictId, IsNew: false });
      } else if (!initialStreet && mode === "old" && createKind === "street") {
        const name = streetName.trim();
        if (!name) throw new Error("Vui lòng nhập tên đường");
        if (!selectedDistrictId) throw new Error("Vui lòng chọn Quận/Huyện trước khi thêm đường");
        await streetApi.add({ ...base(name), DistrictId: selectedDistrictId, OldWardId: streetOldWardId ?? selectedWardId ?? null });
      } else if (initialStreet) {
        const name = streetName.trim();
        if (!name) throw new Error("Vui lòng nhập tên đường");
        const oldDistrictId = streetOldWardOpts.find((w) => w.id === streetOldWardId)?.districtId ?? initialStreet.districtId;
        await streetApi.update({
          ...base(name),
          Id: initialStreet.id,
          DistrictId: oldDistrictId,
          WardId: selectedWardId ?? initialStreet.wardId ?? null,
          OldWardId: streetOldWardId ?? null,
          UpdateWardLinks: true,
        });
      } else if (mode === "new" && createKind === "street") {
        const name = streetName.trim();
        if (!name) throw new Error("Vui lòng nhập tên đường");
        if (!selectedWardId) throw new Error("Vui lòng chọn Phường/Xã mới trước khi thêm đường");
        const districtId = streetOldWardOpts.find((w) => w.id === streetOldWardId)?.districtId ?? selectedOldDistrictId;
        if (!districtId) throw new Error("Không tìm thấy Quận/Huyện cũ của Phường/Xã mới");
        await streetApi.add({
          ...base(name),
          DistrictId: districtId,
          WardId: selectedWardId,
          OldWardId: streetOldWardId ?? null,
        });
      } else if (initialWard) {
        const name = wards[0]?.name.trim() || initialWard.name.trim();
        const oldDistrictId = wards[0]?.oldDistrictId ?? initialWard.oldDistrictId;
        if (mode === "old" && !oldDistrictId) throw new Error("Vui lòng chọn Quận/Huyện cũ");
        const streetsToAdd = (wards[0]?.streets ?? [])
          .filter((item) => item.name.trim())
          .map((street) => {
            const oldWard = streetOldWardOpts.find((item) => item.id === street.oldWardId);
            const districtId = oldWard?.districtId ?? oldDistrictId;
            if (!districtId) {
              throw new Error(`Chưa xác định được Quận/Huyện cũ cho đường "${street.name.trim()}"`);
            }
            return { street, districtId };
          });
        await wardApi.update({
          ...base(name),
          Id: initialWard.id,
          ...(mode === "old" ? { DistrictId: oldDistrictId } : { ProvinceId: provinceId }),
          IsNew: mode === "new",
        });
        for (const { street, districtId } of streetsToAdd) {
          await streetApi.add({
            ...base(street.name.trim()),
            DistrictId: districtId,
            WardId: mode === "new" ? initialWard.id : null,
            OldWardId: street.oldWardId ?? null,
          });
        }
      } else if (mode === "new") {
        for (const w of wards.filter((x) => x.name.trim())) {
          if (!provinceId) throw new Error("Chưa chọn Tỉnh/Thành phố");
          const streetsToAdd = w.streets
            .filter((street) => street.name.trim())
            .map((street) => {
              const oldWard = streetOldWardOpts.find((old) => old.id === street.oldWardId);
              const districtId = oldWard?.districtId ?? w.oldDistrictId;
              if (!districtId) {
                throw new Error(`Chưa xác định được Quận/Huyện cũ cho đường "${street.name.trim()}"`);
              }
              return { street, districtId };
            });
          const wardPayload = {
            ...base(w.name.trim()),
            Id: w.id ?? 0,
            IsNew: true,
            ProvinceId: provinceId,
          };
          const savedWard = w.id
            ? await wardApi.update(wardPayload)
            : await wardApi.add(wardPayload);
          const savedWardId = w.id ?? Number(savedWard.data);
          for (const { street, districtId } of streetsToAdd) {
            await streetApi.add({
              ...base(street.name.trim()),
              DistrictId: districtId,
              WardId: savedWardId,
              OldWardId: street.oldWardId ?? null,
            });
          }
        }
      } else {
        if (!provinceId) throw new Error("Chưa chọn Tỉnh/Thành phố");
        for (const d of districts.filter((x) => x.name.trim())) {
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
            for (const s of w.streets.filter((x) => x.name.trim())) {
              await streetApi.add({
                ...base(s.name.trim()),
                DistrictId: districtId,
                OldWardId: oldWardId,
              });
            }
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
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[720px]">
        <div className="border-b border-[#f5f5f5] px-5 py-3.5">
          <DialogTitle className="text-base font-bold text-[#0a0a0a]">
            {intent === "edit" ? "CHỈNH SỬA ĐỊA GIỚI" : "THÊM MỚI ĐỊA GIỚI"}
          </DialogTitle>
          <DialogDescription className="sr-only">Thêm mới đơn vị hành chính</DialogDescription>
        </div>

        <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-8 py-5">
          <div className="flex">
            <Field label="Thuộc Tỉnh/Thành phố" active={Boolean(provinceName)}>
              <Input
                disabled
                value={provinceName ?? ""}
                className={cn(inputCls, "bg-[#f5f5f5] text-[#a1a1aa] disabled:opacity-100")}
              />
            </Field>
          </div>

          {initialProvince || initialDistrict || createKind === "province" || createKind === "district" || (mode === "old" && createKind === "ward" && !initialWard) ? (
            <TextField label={initialProvince || createKind === "province" ? "Tên Tỉnh/Thành phố" : mode === "old" && createKind === "ward" ? "Tên Phường/Xã" : "Tên Quận/Huyện"} value={entityName} onChange={setEntityName} />
          ) : initialStreet || createKind === "street" ? (
            <div className="flex flex-col gap-3">
              <TextField label="Tên đường" value={streetName} onChange={setStreetName} />
              <SelectField
                label="Thuộc Phường/Xã cũ"
                value={streetOldWardId}
                options={streetOldWardOpts}
                onChange={setStreetOldWardId}
              />
            </div>
          ) : mode === "new" || initialWard ? (
            <>
              {wards.map((w, i) => (
                <WardGroup
                  key={w.key}
                  index={i + 1}
                  ward={w}
                  mode={mode}
                  oldDistricts={oldDistricts}
                  onChange={(nw) => setWards((l) => patchWard(l, nw))}
                  onRemove={() => setWards((l) => l.filter((x) => x.key !== w.key))}
                />
              ))}
              {!initialWard && <DashedAdd
                label="Thêm mới Phường/Xã"
                onClick={() => setWards((l) => [...l, newWard()])}
              />}
            </>
          ) : (
            <>
              {districts.map((d, di) => (
                <div
                  key={d.key}
                  className="flex flex-col gap-4 rounded-lg border border-[#a1a1aa] px-5 pb-5 pt-2"
                >
                  <div className="flex items-center gap-4 border-b border-[#a1a1aa]">
                    <p className="flex-1 py-2.5 text-sm font-medium text-[#1e3a8a]">
                      Quận/Huyện #{di + 1}:
                    </p>
                    <button
                      type="button"
                      onClick={() => setDistricts((l) => l.filter((x) => x.key !== d.key))}
                      className="px-3 py-1.5 text-[13px] font-medium text-[#dc3e42]"
                    >
                      x Bỏ Quận/Huyện
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
                  <div className="flex gap-3">
                    <div className="w-[3px] shrink-0 rounded bg-[#0588f0]" />
                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      {d.wards.map((w, wi) => (
                        <WardGroup
                          key={w.key}
                          index={wi + 1}
                          ward={w}
                          mode={mode}
                          oldDistricts={oldDistricts}
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
                      <button
                        type="button"
                        className={cn(linkBtn, "self-start")}
                        onClick={() =>
                          setDistricts((l) =>
                            l.map((x) => (x.key === d.key ? { ...x, wards: [...x.wards, newWard()] } : x))
                          )
                        }
                      >
                        + Thêm Phường/xã thuộc Quận/huyện này
                      </button>
                    </div>
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
