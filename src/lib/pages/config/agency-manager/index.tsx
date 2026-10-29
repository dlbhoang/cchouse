"use client";
import { Modal as LucideModal } from "@/lib/components/antd-lucide";

import {Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, Modal } from "antd";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { AddressSelectCustom } from "@/lib/components/shared/MySelect/Address/AddressSelectCustom";
import {
  WARD_AGENCIES,
  type AgencyMap,
  type WardAgencyData,
} from "@/data/ward-agencies";
import { normalizeAddressName, withAddressType } from "./format";
import type {
  IDistrictResponse,
  IProvinceResponse,
  IStreetResponse,
  IWardResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import districtApi from "@/services/api/districtApi";
import lookupApi from "@/services/api/lookupApi";
import mergeWardApi from "@/services/api/mergeWardApi";
import provinceApi from "@/services/api/provinceApi";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";

type AgencyType = keyof AgencyMap;
type AgencyTypeFilter = AgencyType | "all";
type AgencyRecord = {
  type: AgencyType;
  name: string;
  address: string;
  wardId?: number;
  wardIds?: number[];
  agencyLinks?: Array<{ name: string; address: string; wardId: number }>;
  oldAddress?: string;
  status?: "active" | "hidden";
  updatedAt?: string;
};
type AgencyAddressOption = Pick<
  IWardResponse,
  "Id" | "Name" | "Type" | "ProvinceId" | "DistrictId"
>;
type AgencyStatusFilter = "all" | "active" | "hidden";
type AgencyAreaFilter = {
  isNewAddress: boolean;
  provinceId?: number;
  districtId?: number;
  wardId?: number;
  newWardId?: number;
  streetName?: string;
  label: string;
};
type AgencyWardMerge = {
  OldDistrictId: number;
  OldDistrictName: string;
  OldWardId: number;
  OldWardName: string;
  NewWardId: number;
};

const agencyTypes: AgencyType[] = [
  "Ủy ban nhân dân phường",
  "Văn phòng đất đai",
  "Chi cục thuế",
  "Văn phòng công chứng",
  "Sở tư pháp",
  "Tòa án",
  "Thừa phát lại",
];
const agencyTypeLabel = (type: AgencyType) =>
  type === "Văn phòng công chứng"
    ? "Phòng công chứng"
    : type === "Ủy ban nhân dân phường"
      ? "Ủy ban phường"
      : type;
const figmaAgencyNames: Record<string, string> = {
  "Phòng Công chứng số 1": "Văn phòng Công chứng số 1",
  "VP Công chứng Bến Thành": "Văn phòng công chứng Bến Thành",
};
const agencyDisplayName = (name: string) => figmaAgencyNames[name] ?? name;
const emptyAgencyMap = (): AgencyMap => ({
  "Văn phòng công chứng": [],
  "Văn phòng đất đai": [],
  "Chi cục thuế": [],
  "Ủy ban nhân dân phường": [],
  "Tòa án": [],
  "Sở tư pháp": [],
  "Thừa phát lại": [],
});

const flattenWard = (ward: WardAgencyData): AgencyRecord[] =>
  agencyTypes.flatMap((type) =>
    (ward.Agencies[type] ?? []).map((agency) => ({
      type,
      ...agency,
      wardId: ward.WardId,
    })),
  );

const normalizeAgencyIdentityPart = (value: string) =>
  normalizeAddressName(value)
    .replace(/\btp\b/g, "thanh pho")
    .replace(/\btphcm\b/g, "thanh pho ho chi minh")
    .replace(/\bduong\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const groupAgencyRecords = (records: AgencyRecord[]) => {
  const groups = new Map<string, AgencyRecord>();
  for (const record of records) {
    const key = [
      record.type,
      normalizeAgencyIdentityPart(agencyDisplayName(record.name)),
      normalizeAgencyIdentityPart(record.address),
    ].join("|");
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, {
        ...record,
        wardIds: record.wardId === undefined ? [] : [record.wardId],
        agencyLinks:
          record.wardId === undefined
            ? []
            : [{ name: record.name, address: record.address, wardId: record.wardId }],
      });
      continue;
    }

    if (record.wardId !== undefined) {
      existing.wardIds ??= [];
      existing.agencyLinks ??= [];
      if (!existing.wardIds.includes(record.wardId)) {
        existing.wardIds.push(record.wardId);
      }
      if (
        !existing.agencyLinks.some(
          (link) =>
            link.wardId === record.wardId &&
            link.name === record.name &&
            link.address === record.address,
        )
      ) {
        existing.agencyLinks.push({
          name: record.name,
          address: record.address,
          wardId: record.wardId,
        });
      }
    }
  }
  return [...groups.values()];
};

const matchesAgencyLink = (
  record: { name: string; address: string },
  group: AgencyRecord,
  wardId: number,
) => {
  const links = group.agencyLinks;
  return links?.length
    ? links.some(
        (link) =>
          link.wardId === wardId &&
          link.name === record.name &&
          link.address === record.address,
      )
    : group.wardId === wardId &&
        group.name === record.name &&
        group.address === record.address;
};

const saveWardAgencyUpdates = async (updates: WardAgencyData[]) => {
  for (let index = 0; index < updates.length; index += 8) {
    await Promise.all(
      updates.slice(index, index + 8).map((ward) =>
        lookupApi.saveWardAgencies(ward.WardId, ward),
      ),
    );
  }
};

const convertAgencyAddressToOld = (
  newAddress: string,
  wards: WardAgencyData[],
  fallbackWardName?: string,
) => {
  const parts = newAddress
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const streetAddress = parts[0];
  const currentWardName =
    parts.find((part) => /^(phường|xã|đặc khu)\s+/i.test(part)) ??
    fallbackWardName;
  const currentWard = currentWardName
    ? wards.find(
        (ward) =>
          normalizeAddressName(ward.WardName) ===
          normalizeAddressName(currentWardName),
      )
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
  const plainDistricts = new Set([
    "Bình Tân",
    "Bình Thạnh",
    "Gò Vấp",
    "Phú Nhuận",
    "Tân Bình",
    "Tân Phú",
  ]);
  const plainCounties = new Set([
    "Bình Chánh",
    "Củ Chi",
    "Hóc Môn",
    "Nhà Bè",
    "Cần Giờ",
  ]);
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
  const provinceName =
    parts.find((part) => /^(TP\.?|Thành phố)\s+/i.test(part)) ??
    "TP. Hồ Chí Minh";

  return [
    streetAddress,
    oldWardAddressName,
    oldDistrictName,
    provinceName,
  ].join(", ");
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
        className={`pointer-events-none absolute left-3 z-10 flex -translate-y-1/2 items-center gap-1 bg-white px-1 transition-all duration-200 ease-out group-focus-within/agency-field:top-0 group-focus-within/agency-field:text-xs group-focus-within/agency-field:text-[#168cf2] ${
          filled
            ? "top-0 text-xs text-neutral-600"
            : "top-1/2 text-sm text-neutral-500"
        }`}
      >
        <span>{label}</span>
        {required && (
          <span className="text-[10px] leading-none text-red-500">*</span>
        )}
      </label>
    </div>
  );
}

export default function AgencyManagerPage() {
  const [areaFilterForm] = Form.useForm();
  const [wards, setWards] = useState<WardAgencyData[]>([]);
  const areaProvinceOptionsRef = useRef<IProvinceResponse[]>([]);
  const [areaWardOptions, setAreaWardOptions] = useState<IWardResponse[]>([]);
  const [areaWardMerges, setAreaWardMerges] = useState<AgencyWardMerge[]>([]);
  const [agencyAreaFilter, setAgencyAreaFilter] = useState<AgencyAreaFilter>({
    isNewAddress: true,
    label: "Thành phố Hồ Chí Minh",
  });
  const [selectedWardId, setSelectedWardId] = useState<number>();
  const [agencySearchInput, setAgencySearchInput] = useState("");
  const [agencySearch, setAgencySearch] = useState("");
  const [agencyTypeFilter, setAgencyTypeFilter] = useState<AgencyTypeFilter>("Văn phòng công chứng");
  const [agencyStatusFilter, setAgencyStatusFilter] =
    useState<AgencyStatusFilter>("all");
  const [mode, setMode] = useState<"new" | "old">("new");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AgencyRecord>();
  const [editing, setEditing] = useState<AgencyRecord>();
  const [editingWardId, setEditingWardId] = useState<number>();
  const [formWardId, setFormWardId] = useState<number>();
  const [streetOptions, setStreetOptions] = useState<IStreetResponse[]>([]);
  const [streetName, setStreetName] = useState("");
  const [provinceOptions, setProvinceOptions] = useState<IProvinceResponse[]>(
    [],
  );
  const [provinceDistricts, setProvinceDistricts] = useState<
    IDistrictResponse[]
  >([]);
  const [configuredWardOptions, setConfiguredWardOptions] = useState<
    IWardResponse[]
  >([]);
  const [oldWardOptions, setOldWardOptions] = useState<IWardResponse[]>([]);
  const [oldDistrictId, setOldDistrictId] = useState<number>();
  const [oldWardId, setOldWardId] = useState<number>();
  const [provinceId, setProvinceId] = useState<number>();
  const [form, setForm] = useState<AgencyRecord>({
    type: "Văn phòng công chứng",
    name: "",
    address: "",
  });

  useEffect(() => {
    let active = true;
    lookupApi
      .getWardAgencies()
      .then((response) => {
        if (!active) return;
        const data =
          Array.isArray(response.data) && response.data.length
            ? response.data
            : WARD_AGENCIES;
        setWards(data);
      })
      .catch(() => {
        if (!active) return;
        setWards(WARD_AGENCIES);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    mergeWardApi
      .get()
      .then((response) => {
        if (active) setAreaWardMerges(response.data ?? []);
      })
      .catch(() => {
        if (active) setAreaWardMerges([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      provinceApi.get({ pageIndex: 1, pageSize: 10000 }),
      wardApi.get({ pageIndex: 1, pageSize: 10000, IsNew: true }),
    ])
      .then(([provincesResponse, wardsResponse]) => {
        if (!active) return;
        areaProvinceOptionsRef.current = provincesResponse.data ?? [];
        setAreaWardOptions(wardsResponse.data ?? []);
      })
      .catch(() => {
        if (!active) return;
        areaProvinceOptionsRef.current = [];
        setAreaWardOptions([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedWard =
    wards.find((ward) => ward.WardId === selectedWardId);
  const editorSourceWard =
    wards.find((ward) => ward.WardId === editingWardId) ?? selectedWard;
  const configuredProvinceWardOptions = configuredWardOptions.filter(
    (ward) => ward.ProvinceId === provinceId,
  );
  const linkedProvinceWardOptions = configuredProvinceWardOptions.filter(
    (ward) =>
      provinceDistricts.some((district) => district.Id === ward.DistrictId),
  );
  const selectedProvince = provinceOptions.find(
    (province) => province.Id === provinceId,
  );
  const provinceWardOptions: AgencyAddressOption[] =
    linkedProvinceWardOptions.length
      ? linkedProvinceWardOptions
      : configuredProvinceWardOptions.length
        ? configuredProvinceWardOptions
        : String(selectedProvince?.Name ?? "")
              .toLocaleLowerCase("vi")
              .includes("hồ chí minh")
          ? WARD_AGENCIES.map((ward) => ({
              Id: ward.WardId,
              Name: ward.WardName,
              Type: ward.WardType,
            }))
          : [];
  const selectedFormWardOption = provinceWardOptions.find(
    (ward) => ward.Id === formWardId,
  );
  const selectedAgencyWard = selectedFormWardOption
    ? (wards.find(
        (ward) =>
          normalizeAddressName(ward.WardName) ===
          normalizeAddressName(selectedFormWardOption.Name),
      ) ??
      WARD_AGENCIES.find(
        (ward) =>
          normalizeAddressName(ward.WardName) ===
          normalizeAddressName(selectedFormWardOption.Name),
      ))
    : undefined;
  const oldDistrictOptions = provinceDistricts;
  const formWard =
    selectedAgencyWard ??
    wards.find((ward) => ward.WardId === formWardId) ??
    WARD_AGENCIES.find((ward) => ward.WardId === formWardId) ??
    (selectedFormWardOption
      ? {
          WardId: selectedFormWardOption.Id,
          WardName: selectedFormWardOption.Name.replace(
            /^(phường|xã|đặc khu)\s+/i,
            "",
          ),
          WardType: (/xã/i.test(selectedFormWardOption.Type)
            ? "xã"
            : /đặc khu/i.test(selectedFormWardOption.Type)
              ? "đặc khu"
              : "phường") as WardAgencyData["WardType"],
          UBNDAddress: "",
          MergedFrom: [],
          Agencies: emptyAgencyMap(),
        }
      : undefined);

  useEffect(() => {
    if (!dialogOpen) return;
    let active = true;
    Promise.all([
      provinceApi.get({ pageIndex: 1, pageSize: 10000 }),
      wardApi.get({ pageIndex: 1, pageSize: 10000, IsNew: true }),
    ])
      .then(([provincesResponse, wardsResponse]) => {
        if (!active) return;
        const provinceRows = Array.isArray(provincesResponse.data)
          ? provincesResponse.data.filter(
              (province) =>
                province && typeof province === "object" && province.Id != null,
            )
          : [];
        const wardRows = Array.isArray(wardsResponse.data)
          ? wardsResponse.data.filter(
              (ward) => ward && typeof ward === "object" && ward.Id != null,
            )
          : [];
        setProvinceOptions(provinceRows);
        setConfiguredWardOptions(wardRows);
        const hcm = provinceRows.find((province) =>
          String(province.Name ?? "")
            .toLocaleLowerCase("vi")
            .includes("hồ chí minh"),
        );
        const editingProvinceName =
          String(editing?.address ?? "")
            .split(",")
            .at(-1)
            ?.trim() ?? "";
        const editingProvince = editingProvinceName
          ? provinceRows.find(
              (province) =>
                Boolean(province.Name) &&
                normalizeAddressName(editingProvinceName).includes(
                  normalizeAddressName(province.Name),
                ),
            )
          : undefined;
        const resolvedProvinceId =
          editingProvince?.Id ?? hcm?.Id ?? provinceRows[0]?.Id;
        setProvinceId((current) => current ?? resolvedProvinceId);
        if (editing && editingWardId !== undefined) {
          const sourceWard = wards.find(
            (ward) => ward.WardId === editingWardId,
          );
          const matchedWard =
            sourceWard &&
            wardRows.find(
              (ward) =>
                ward.ProvinceId === resolvedProvinceId &&
                normalizeAddressName(ward.Name) ===
                  normalizeAddressName(sourceWard.WardName),
            );
          if (matchedWard) setFormWardId(matchedWard.Id);
        }
      })
      .catch(() => {
        if (!active) return;
        setProvinceOptions([]);
        setConfiguredWardOptions([]);
      });
    return () => {
      active = false;
    };
  }, [dialogOpen, editing, editingWardId, wards]);

  useEffect(() => {
    if (!dialogOpen || !provinceId) {
      setProvinceDistricts([]);
      return;
    }
    let active = true;
    districtApi
      .get({ pageIndex: 1, pageSize: 10000, ProvinceId: provinceId })
      .then((response) => {
        if (active) setProvinceDistricts(response.data ?? []);
      })
      .catch(() => {
        if (active) setProvinceDistricts([]);
      });
    return () => {
      active = false;
    };
  }, [dialogOpen, provinceId]);

  useEffect(() => {
    if (!dialogOpen || mode !== "old" || !oldDistrictOptions.length) return;
    const legacyDistrictNumber = editorSourceWard?.MergedFrom.map(
      (address) => address.match(/\(Q(\d+)\)/)?.[1],
    ).find(Boolean);
    const legacyDistrict = legacyDistrictNumber
      ? oldDistrictOptions.find((district) =>
          new RegExp(`quận\\s*${legacyDistrictNumber}(?!\\d)`, "i").test(
            district.Name,
          ),
        )
      : undefined;
    setOldDistrictId((current) =>
      oldDistrictOptions.some((district) => district.Id === current)
        ? current
        : (legacyDistrict?.Id ?? oldDistrictOptions[0]?.Id),
    );
  }, [dialogOpen, mode, oldDistrictOptions, editorSourceWard]);

  useEffect(() => {
    if (!dialogOpen || mode !== "new" || !formWardId) {
      setStreetOptions([]);
      return;
    }

    let active = true;
    streetApi
      .get({ pageIndex: 1, pageSize: 10000, WardId: formWardId, IsNew: true })
      .then((response) => {
        if (!active) return;
        const options = Array.isArray(response.data) ? response.data : [];
        setStreetOptions(options);

        const sourceWard = wards.find((ward) => ward.WardId === editingWardId);
        if (
          editing &&
          sourceWard &&
          selectedFormWardOption &&
          normalizeAddressName(sourceWard.WardName) ===
            normalizeAddressName(selectedFormWardOption.Name)
        ) {
          const addressParts = editing.address
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean);
          const normalize = (value: string) =>
            value
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/^duong\s+/i, "")
              .trim()
              .toLocaleLowerCase("vi");
          const streetMatch = options.flatMap((street) => {
            const streetLabel = street.Name.replace(/^đường\s+/i, "").trim();
            if (!streetLabel) return [];
            const index = addressParts.findIndex(
              (part) =>
                normalize(part).endsWith(normalize(street.Name)) ||
                normalize(part).endsWith(normalize(streetLabel)),
            );
            return index === -1 ? [] : [{ street, streetLabel, index }];
          })[0];
          if (streetMatch) {
            const { street, streetLabel, index } = streetMatch;
            const escapedStreetLabel = streetLabel.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            );
            const segmentPrefix =
              index === 0
                ? addressParts[0]
                    .replace(new RegExp(`\\s*${escapedStreetLabel}$`, "i"), "")
                    .replace(/^đường\s*$/i, "")
                    .trim()
                : "";
            setStreetName(street.Name);
            setForm((current) => ({
              ...current,
              address: [...addressParts.slice(0, index), segmentPrefix]
                .filter(Boolean)
                .join(", "),
            }));
          }
        }
      })
      .catch(() => {
        if (active) setStreetOptions([]);
      });

    return () => {
      active = false;
    };
  }, [
    dialogOpen,
    editing,
    editingWardId,
    formWard?.WardId,
    formWardId,
    mode,
    selectedFormWardOption?.Name,
    wards,
  ]);

  useEffect(() => {
    if (!dialogOpen || mode !== "old" || !oldDistrictId) {
      if (mode !== "old") setOldWardOptions([]);
      return;
    }
    let active = true;
    Promise.all([
      wardApi.get({
        pageIndex: 1,
        pageSize: 10000,
        DistrictId: oldDistrictId,
        IsNew: false,
      }),
      streetApi.get({
        pageIndex: 1,
        pageSize: 10000,
        DistrictId: oldDistrictId,
        IsNew: false,
      }),
    ])
      .then(([wardsResponse, streetsResponse]) => {
        if (!active) return;
        const wardOptions = wardsResponse.data ?? [];
        setOldWardOptions(wardOptions);
        const legacyWardName = editorSourceWard?.MergedFrom[0]
          ?.split("(")[0]
          ?.replace(/^một phần\s+/i, "")
          .trim();
        const matchingWard = legacyWardName
          ? wardOptions.find(
              (ward) =>
                normalizeAddressName(ward.Name) ===
                normalizeAddressName(legacyWardName),
            )
          : undefined;
        setOldWardId((current) =>
          wardOptions.some((ward) => ward.Id === current)
            ? current
            : (matchingWard?.Id ?? wardOptions[0]?.Id),
        );
        setStreetOptions(streetsResponse.data ?? []);
        setStreetName("");
      })
      .catch(() => {
        if (active) {
          setOldWardOptions([]);
          setStreetOptions([]);
        }
      });
    return () => {
      active = false;
    };
  }, [dialogOpen, mode, oldDistrictId, editorSourceWard]);
  const areaWardIds = useMemo(() => {
    if (agencyAreaFilter.wardId !== undefined) {
      return agencyAreaFilter.isNewAddress
        ? [agencyAreaFilter.wardId]
        : areaWardMerges
            .filter((merge) => merge.OldWardId === agencyAreaFilter.wardId)
            .map((merge) => merge.NewWardId);
    }
    if (agencyAreaFilter.districtId !== undefined) {
      return areaWardMerges
        .filter((merge) => merge.OldDistrictId === agencyAreaFilter.districtId)
        .map((merge) => merge.NewWardId);
    }
    if (agencyAreaFilter.provinceId !== undefined) {
      return areaWardOptions
        .filter((ward) => ward.ProvinceId === agencyAreaFilter.provinceId)
        .map((ward) => ward.Id);
    }
    return undefined;
  }, [agencyAreaFilter, areaWardMerges, areaWardOptions]);
  const areaWardIdSet = useMemo(
    () => (areaWardIds ? new Set(areaWardIds) : undefined),
    [areaWardIds],
  );

  const agencies = useMemo(() => {
    const filter = agencySearch.trim().toLocaleLowerCase("vi");
    const sourceWards = areaWardIdSet
      ? wards.filter((ward) => areaWardIdSet.has(ward.WardId))
      : wards;
    return groupAgencyRecords(sourceWards.flatMap(flattenWard))
      .filter(
        (item) =>
          (agencyTypeFilter === "all" || item.type === agencyTypeFilter) &&
          (agencyStatusFilter === "all" ||
            (item.status ?? "active") === agencyStatusFilter) &&
          (!agencyAreaFilter.streetName ||
            normalizeAddressName(item.address).includes(
              normalizeAddressName(agencyAreaFilter.streetName),
            )) &&
          (!filter ||
            `${item.type} ${item.name} ${item.address}`
              .toLocaleLowerCase("vi")
              .includes(filter)),
      );
  }, [
    agencyAreaFilter.streetName,
    agencySearch,
    agencyStatusFilter,
    agencyTypeFilter,
    areaWardIdSet,
    selectedWard,
    selectedWardId,
    wards,
  ]);

  const areaScopeLabel = agencyAreaFilter.label;
  const agencyCount = agencies.length;

  const saveAgency = async () => {
    if (
      !formWard ||
      !provinceId ||
      !form.name.trim() ||
      !streetName.trim() ||
      !form.address.trim()
    )
      return;
    if (mode === "old" && (!oldDistrictId || !oldWardId)) return;
    const address = [
      form.address.trim(),
      streetName.trim(),
      `${formWard.WardType === "phường" ? "phường" : formWard.WardType === "xã" ? "xã" : "đặc khu"} ${formWard.WardName}`,
      withAddressType(
        selectedProvince?.Type ?? "",
        selectedProvince?.Name ?? "",
      ),
    ].join(", ");
    const newItem = {
      name: form.name.trim(),
      address,
      status: form.status ?? "active",
      updatedAt: new Date().toLocaleDateString("vi-VN"),
    };
    const sourceWardIds = editing
      ? (editing.wardIds?.length
          ? editing.wardIds
          : editingWardId === undefined
            ? []
            : [editingWardId])
      : [];
    const targetWardIds =
      editing && formWard.WardId === editing.wardId
        ? sourceWardIds
        : [formWard.WardId];
    const sourceWardIdSet = new Set(sourceWardIds);
    const targetWardIdSet = new Set(targetWardIds);
    const affectedWardIds = new Set([...sourceWardIds, ...targetWardIds]);
    const wardsById = new Map(wards.map((ward) => [ward.WardId, ward]));
    const updates = new Map<number, WardAgencyData>();

    for (const wardId of affectedWardIds) {
      const original =
        wardsById.get(wardId) ??
        (formWard.WardId === wardId ? formWard : undefined);
      if (!original) continue;

      const agencies = { ...original.Agencies };
      if (editing && sourceWardIdSet.has(wardId)) {
        agencies[editing.type] = (agencies[editing.type] ?? []).filter(
          (item) => !matchesAgencyLink(item, editing, wardId),
        );
      }
      if (targetWardIdSet.has(wardId)) {
        agencies[form.type] = [...(agencies[form.type] ?? []), newItem];
      }
      updates.set(wardId, { ...original, Agencies: agencies });
    }

    const updatedWards = [...updates.values()];
    await saveWardAgencyUpdates(updatedWards);
    const updatedById = new Map(
      updatedWards.map((ward) => [ward.WardId, ward]),
    );
    const next = wards.map((ward) => updatedById.get(ward.WardId) ?? ward);
    if (!wards.some((ward) => ward.WardId === formWard.WardId)) {
      const createdWard = updatedById.get(formWard.WardId);
      if (createdWard) next.push(createdWard);
    }
    setWards(next);
    setSelectedWardId(formWard.WardId);
    setDialogOpen(false);
    setEditing(undefined);
    setEditingWardId(undefined);
  };

  const removeAgency = async () => {
    if (!deleteTarget) return;
    const sourceWardIds = deleteTarget.wardIds?.length
      ? deleteTarget.wardIds
      : deleteTarget.wardId === undefined
        ? []
        : [deleteTarget.wardId];
    const sourceWardIdSet = new Set(sourceWardIds);
    const updates = wards
      .filter((ward) => sourceWardIdSet.has(ward.WardId))
      .map((ward) => ({
        ...ward,
        Agencies: {
          ...ward.Agencies,
          [deleteTarget.type]: (ward.Agencies[deleteTarget.type] ?? []).filter(
            (item) => !matchesAgencyLink(item, deleteTarget, ward.WardId),
          ),
        },
      }));
    await saveWardAgencyUpdates(updates);
    const updatedById = new Map(updates.map((ward) => [ward.WardId, ward]));
    setWards((current) =>
      current.map((ward) => updatedById.get(ward.WardId) ?? ward),
    );
    setDeleteTarget(undefined);
  };

  const applyAreaFilters = async (values: Record<string, unknown>) => {
    const asId = (value: unknown) =>
      value === undefined || value === null || value === ""
        ? undefined
        : Number(value);
    const isNewAddress = values.AreaIsNewAddress !== false;
    const nextProvinceId = asId(values.AreaProvinceId);
    const districtId = asId(values.AreaDistrictId);
    const wardId = asId(values.AreaWardId);
    const newWardId = isNewAddress
      ? wardId
      : areaWardMerges.find((merge) => merge.OldWardId === wardId)?.NewWardId;
    let nextStreetName = "";
    const streetId = asId(values.AreaStreetId);
    if (streetId) {
      try {
        const result = await streetApi.getById(streetId);
        nextStreetName = result.data?.Name?.replace(/^đường\s+/i, "") ?? "";
      } catch {
        nextStreetName = "";
      }
    }

    const selectedProvince = areaProvinceOptionsRef.current.find(
      (province) => province.Id === nextProvinceId,
    );
    const selectedNewWard = areaWardOptions.find(
      (ward) => ward.Id === newWardId,
    );
    const mergeForOldWard = areaWardMerges.find(
      (merge) => merge.OldWardId === wardId,
    );
    const selectedDistrictName = districtId
      ? areaWardMerges.find((merge) => merge.OldDistrictId === districtId)
          ?.OldDistrictName
      : undefined;
    const label = [
      selectedProvince
        ? withAddressType(selectedProvince.Type, selectedProvince.Name)
        : undefined,
      !isNewAddress && selectedDistrictName,
      isNewAddress && selectedNewWard
        ? withAddressType(selectedNewWard.Type, selectedNewWard.Name)
        : mergeForOldWard?.OldWardName,
      nextStreetName,
    ]
      .filter(Boolean)
      .join(" · ") || "Thành phố Hồ Chí Minh";

    setAgencyAreaFilter({
      isNewAddress,
      provinceId: nextProvinceId,
      districtId: isNewAddress ? undefined : districtId,
      wardId,
      newWardId,
      streetName: nextStreetName || undefined,
      label,
    });
    setSelectedWardId(newWardId);
  };

  const openEditor = (item?: AgencyRecord) => {
    setEditing(item);
    setEditingWardId(item?.wardId);
    setFormWardId(item?.wardId ?? selectedWardId);
    setStreetOptions([]);
    setStreetName("");
    setProvinceOptions([]);
    setProvinceDistricts([]);
    setConfiguredWardOptions([]);
    setProvinceId(undefined);
    setOldWardOptions([]);
    setOldDistrictId(undefined);
    setOldWardId(undefined);
    setForm(
      item
        ? {
            ...item,
            name: agencyDisplayName(item.name),
            status: item.status ?? "active",
          }
        : {
            type: "Văn phòng công chứng",
            name: "",
            address: "",
            status: "active",
          },
    );
    setMode("new");
    setDialogOpen(true);
  };

  const selectOldAddressMode = () => {
    const legacyDistrictNumber = editorSourceWard?.MergedFrom.map(
      (address) => address.match(/\(Q(\d+)\)/)?.[1],
    ).find(Boolean);
    const legacyDistrict = legacyDistrictNumber
      ? oldDistrictOptions.find((district) =>
          new RegExp(`quận\\s*${legacyDistrictNumber}(?!\\d)`, "i").test(
            district.Name,
          ),
        )
      : undefined;
    setOldDistrictId(legacyDistrict?.Id);
    setOldWardId(undefined);
    setStreetName("");
    setMode("old");
  };

  const resetAgencyFilters = () => {
    setSelectedWardId(undefined);
    areaFilterForm.resetFields();
    areaFilterForm.setFieldsValue({ AreaIsNewAddress: true });
    setAgencyAreaFilter({ isNewAddress: true, label: "Thành phố Hồ Chí Minh" });
    setMode("new");
    setAgencyTypeFilter("Văn phòng công chứng");
    setAgencyStatusFilter("all");
    setAgencySearchInput("");
    setAgencySearch("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 bg-[#f5f5f5] p-6 max-md:p-3">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3">
        <div className="w-full sm:w-[280px]">
          <Form
            component={false}
            form={areaFilterForm}
            initialValues={{ AreaIsNewAddress: true }}
            onFinish={applyAreaFilters}
          >
            <AddressSelectCustom
              form={areaFilterForm}
              nameProvince="AreaProvinceId"
              nameDistrict="AreaDistrictId"
              nameWard="AreaWardId"
              nameStreet="AreaStreetId"
              nameAddressNumber="AreaAddressNumber"
              nameIsNewAddress="AreaIsNewAddress"
              nameLandParcel="AreaLandParcel"
              nameMapSheet="AreaMapSheet"
              isHiddenField
              hideParcelFields
            />
          </Form>
        </div>
        <div className="relative w-full sm:w-[190px]">
          <span className="pointer-events-none absolute -top-1.5 left-3 z-10 bg-white px-1 text-[10px] leading-none text-neutral-500">
            Trạng thái
          </span>
          <SearchableSelect
            value={agencyStatusFilter}
            aria-label="Trạng thái"
            options={[
              { value: "all", label: "Tất cả" },
              { value: "active", label: "Hoạt động" },
              { value: "hidden", label: "Tạm ngừng" },
            ]}
            onValueChange={(value) =>
              setAgencyStatusFilter(value as AgencyStatusFilter)
            }
            className="h-10 rounded-lg pt-1"
          />
        </div>
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-neutral-400" />
          <Input
            aria-label="Tìm kiếm cơ quan hành chính"
            value={agencySearchInput}
            onChange={(event) => setAgencySearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") setAgencySearch(agencySearchInput);
            }}
            placeholder="Tìm kiếm cơ quan hành chính"
            className="h-10 rounded-lg pl-9"
          />
        </div>
        <Button
          onClick={() => setAgencySearch(agencySearchInput)}
          style={{ backgroundColor: "#0587ef" }}
          className="appearance-none !bg-[#0587ef] hover:!bg-[#0587ef] h-10 gap-2 rounded-lg"
        >
          <Search size={16} />
          Tìm kiếm
        </Button>
        <Button
          variant="outline"
          aria-label="Làm mới bộ lọc"
          onClick={resetAgencyFilters}
          className="h-10 w-10 rounded-lg p-0"
        >
          <RefreshCw size={16} />
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-xl font-bold text-neutral-950">
          QUẢN LÝ CƠ QUAN HÀNH CHÍNH
        </h1>
        <Button
          onClick={() => openEditor()}
          style={{ backgroundColor: "#0587ef" }}
          className="appearance-none !bg-[#0587ef] hover:!bg-[#0587ef] gap-2 rounded-lg"
        >
          <Plus size={16} />
          Thêm mới cơ quan
        </Button>
      </div>

      <section className="min-h-0 flex-1 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
        <div className="border-b border-neutral-200 bg-[#e8f3ff] px-5 py-3 text-sm font-bold uppercase text-neutral-900">
          Danh mục cơ quan hành chính
        </div>
        <div className="flex h-[calc(100%-45px)] min-h-0 flex-col gap-5 overflow-y-auto p-4 sm:p-5">
          <div className="relative">
            <span className="pointer-events-none absolute -top-1.5 left-3 z-10 bg-white px-1 text-[10px] leading-none text-neutral-500">
              Danh mục cơ quan hành chính
            </span>
            <SearchableSelect
              value={agencyTypeFilter}
              placeholder="Chọn cơ quan hành chính"
              searchPlaceholder="Tìm danh mục cơ quan..."
              aria-label="Danh mục cơ quan hành chính"
              options={[
                { value: "all", label: "Tất cả cơ quan" },
                ...agencyTypes.map((type) => ({
                  value: type,
                  label: agencyTypeLabel(type),
                })),
              ]}
              onValueChange={(value) => setAgencyTypeFilter(value as AgencyTypeFilter)}
              className="h-10 rounded-lg bg-white pt-1"
            />
          </div>

          <div className="flex min-h-0 flex-col gap-3">
            <div className="border-b border-neutral-200 pb-3">
              <h2 className="text-sm font-bold">
                Danh sách{" "}
                {agencyTypeFilter === "all"
                  ? "tất cả cơ quan"
                  : agencyTypeFilter}{" "}
                ({agencyCount})
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Phạm vi áp dụng:{" "}
                {areaScopeLabel}
              </p>
            </div>
            {!agencies.length ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <p className="font-semibold">Chưa có cơ quan hành chính</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Thêm cơ quan để hiển thị tại đây.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 gap-2"
                  onClick={() => openEditor()}
                >
                  <Plus size={16} />
                  Thêm mới
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {agencies.map((item, index) => {
                  const legacyAddress =
                    convertAgencyAddressToOld(
                      item.address,
                      wards,
                      wards.find((ward) => ward.WardId === item.wardId)?.WardName,
                    ) ?? item.oldAddress;
                  const capitalizeWardType = (address: string) =>
                    address.replace(
                      /(^|,\s*)(phường|xã|đặc khu)\s+/gi,
                      (_, prefix: string, type: string) =>
                        `${prefix}${type[0].toLocaleUpperCase("vi")}${type.slice(1)} `,
                    );
                  const currentAddress = capitalizeWardType(item.address);
                  const legacyParts =
                    legacyAddress?.split(",").map((part) => part.trim()) ?? [];
                  const hasSameStreet =
                    normalizeAddressName(legacyParts[0] ?? "") ===
                    normalizeAddressName(item.address.split(",")[0] ?? "");
                  const previousAddress = legacyAddress
                    ? `${capitalizeWardType((hasSameStreet ? legacyParts.slice(1) : legacyParts).join(", "))} cũ`
                    : undefined;
                  const updatedAt =
                    item.updatedAt ??
                    (figmaAgencyNames[item.name] ? "03/07/2026" : undefined);
                  return (
                    <article
                      key={`${item.name}-${item.address}-${index}`}
                      className="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-50 sm:p-4"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-neutral-900">
                            {agencyDisplayName(item.name)}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${item.status === "hidden" ? "bg-neutral-200 text-neutral-600" : "bg-[#e8f3ff] text-[#167ee0]"}`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${item.status === "hidden" ? "bg-neutral-500" : "bg-[#168cf2]"}`}
                            />
                            {item.status === "hidden"
                              ? "Tạm ngừng"
                              : "Hoạt động"}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-5 text-neutral-500">
                          Địa chỉ: {currentAddress}
                          {previousAddress ? ` (${previousAddress})` : ""}
                        </p>
                        {updatedAt && (
                          <p className="mt-0.5 text-[10px] leading-4 text-neutral-400">
                            Cập nhật: {updatedAt}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Sửa cơ quan"
                          className="size-8 rounded-md"
                          onClick={() => openEditor(item)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Xóa cơ quan"
                          className="size-8 rounded-md text-red-600"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <LucideModal
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        footer={null}
        width={768}
        centered
        styles={{
          content: { padding: 0, borderRadius: 16 },
          body: { maxHeight: "90vh", overflowY: "auto" },
        }}
      >
        <div className="border-b border-neutral-200 px-6 py-5">
          <h2 className="text-lg font-bold">
            {editing ? "SỬA CƠ QUAN HÀNH CHÍNH" : "THÊM MỚI CƠ QUAN HÀNH CHÍNH"}
          </h2>
        </div>
        <div className="flex flex-col gap-6 px-6 py-6">
          <div>
            <h3 className="mb-3 text-sm font-bold">Thông tin cơ quan</h3>
            <p className="mb-3 text-xs text-neutral-500">
              Chọn đúng đơn vị hành chính để địa chỉ xuất hiện trong danh sách
              tương ứng.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <AgencyFloatingField
                id="agency-type"
                label="Danh mục cơ quan"
                required
                filled
              >
                <SearchableSelect
                  value={form.type}
                  aria-label="Danh mục cơ quan"
                  searchPlaceholder="Tìm danh mục cơ quan..."
                  options={agencyTypes.map((type) => ({
                    value: type,
                    label: agencyTypeLabel(type),
                  }))}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      type: value as AgencyType,
                    }))
                  }
                  className="h-10 rounded-md"
                />
              </AgencyFloatingField>
              <AgencyFloatingField
                id="agency-name"
                label="Tên cơ quan"
                required
                filled={Boolean(form.name.trim())}
              >
                <Input
                  id="agency-name"
                  aria-label="Tên cơ quan"
                  className="h-10 border-neutral-200 bg-white shadow-none focus-visible:border-[#168cf2] focus-visible:ring-2 focus-visible:ring-[#168cf2]/20 focus-visible:ring-offset-0"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </AgencyFloatingField>
            </div>
          </div>
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold">Thông tin địa chỉ</h3>
              <div
                className="flex w-fit rounded-lg bg-neutral-100 p-1"
                role="group"
                aria-label="Kiểu địa chỉ"
              >
                <button
                  type="button"
                  aria-pressed={mode === "new"}
                  onClick={() => setMode("new")}
                  className={`rounded-md px-3 py-1.5 text-xs transition-colors ${mode === "new" ? "bg-white font-semibold text-neutral-900 shadow-sm" : "text-neutral-500"}`}
                >
                  Địa chỉ mới
                </button>
                <button
                  type="button"
                  aria-pressed={mode === "old"}
                  onClick={selectOldAddressMode}
                  className={`rounded-md px-3 py-1.5 text-xs transition-colors ${mode === "old" ? "bg-white font-semibold text-neutral-900 shadow-sm" : "text-neutral-500"}`}
                >
                  Địa chỉ cũ
                </button>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className={mode === "old" ? "sm:col-span-2" : undefined}>
                <AgencyFloatingField
                  id="agency-province"
                  label="Tỉnh/Thành phố"
                  filled
                >
                  <SearchableSelect
                    value={String(provinceId ?? "")}
                    aria-label="Tỉnh/Thành phố"
                    placeholder="Chọn tỉnh/thành phố"
                    searchPlaceholder="Tìm tỉnh/thành phố..."
                    options={provinceOptions.map((province) => ({
                      value: String(province.Id),
                      label: withAddressType(province?.Type, province?.Name),
                    }))}
                    onValueChange={(value) => {
                      setProvinceId(Number(value));
                      setFormWardId(undefined);
                      setOldDistrictId(undefined);
                      setOldWardId(undefined);
                      setStreetName("");
                    }}
                    className="h-10 rounded-md"
                  />
                </AgencyFloatingField>
              </div>
              {mode === "old" ? (
                <>
                  <AgencyFloatingField
                    id="agency-district"
                    label="Quận/Huyện"
                    filled={Boolean(oldDistrictId)}
                  >
                    <SearchableSelect
                      value={String(oldDistrictId ?? "")}
                      aria-label="Quận/Huyện"
                      placeholder="Chọn quận/huyện"
                      searchPlaceholder="Tìm quận/huyện..."
                      options={oldDistrictOptions.map((district) => ({
                        value: String(district.Id),
                        label: withAddressType(district?.Type, district?.Name),
                      }))}
                      onValueChange={(value) => {
                        setOldDistrictId(Number(value));
                        setOldWardId(undefined);
                        setStreetName("");
                      }}
                      className="h-10 rounded-md"
                    />
                  </AgencyFloatingField>
                  <AgencyFloatingField
                    id="agency-old-ward"
                    label="Phường/Xã"
                    filled={Boolean(oldWardId)}
                  >
                    <SearchableSelect
                      value={String(oldWardId ?? "")}
                      aria-label="Phường/Xã cũ"
                      placeholder="Chọn phường/xã"
                      searchPlaceholder="Tìm phường/xã..."
                      options={oldWardOptions.map((ward) => ({
                        value: String(ward.Id),
                        label: withAddressType(ward?.Type, ward?.Name),
                      }))}
                      onValueChange={(value) => {
                        setOldWardId(Number(value));
                        setStreetName("");
                      }}
                      className="h-10 rounded-md"
                    />
                  </AgencyFloatingField>
                </>
              ) : (
                <AgencyFloatingField
                  id="agency-ward"
                  label="Phường/Xã"
                  filled={Boolean(formWard?.WardName)}
                >
                  <SearchableSelect
                    value={String(formWardId ?? "")}
                    aria-label="Phường/Xã"
                    placeholder="Chọn phường/xã"
                    searchPlaceholder="Tìm phường/xã..."
                    options={provinceWardOptions.map((ward) => ({
                      value: String(ward.Id),
                      label: withAddressType(ward?.Type, ward?.Name),
                    }))}
                    onValueChange={(value) => {
                      setFormWardId(Number(value));
                      setStreetName("");
                    }}
                    className="h-10 rounded-md"
                  />
                </AgencyFloatingField>
              )}
              <AgencyFloatingField
                id="agency-street"
                label="Tên đường"
                required
                filled={Boolean(streetName)}
              >
                <SearchableSelect
                  value={streetName}
                  onValueChange={setStreetName}
                  aria-label="Tên đường"
                  placeholder="Chọn tên đường"
                  searchPlaceholder="Tìm tên đường..."
                  emptyMessage="Chưa có tên đường được cấu hình"
                  options={streetOptions.map((street) => ({
                    value: street.Name,
                    label: street.Name,
                  }))}
                  className="h-10 rounded-md"
                />
              </AgencyFloatingField>
              <AgencyFloatingField
                id="agency-address"
                label="Địa chỉ"
                required
                filled={Boolean(form.address.trim())}
              >
                <Input
                  id="agency-address"
                  aria-label="Địa chỉ"
                  className="h-10 border-neutral-200 bg-white shadow-none focus-visible:border-[#168cf2] focus-visible:ring-2 focus-visible:ring-[#168cf2]/20 focus-visible:ring-offset-0"
                  value={form.address}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                />
              </AgencyFloatingField>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-neutral-700">Trạng thái</span>
              <button
                type="button"
                role="switch"
                aria-label="Trạng thái hoạt động"
                aria-checked={(form.status ?? "active") === "active"}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    status: current.status === "hidden" ? "active" : "hidden",
                  }))
                }
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168cf2] focus-visible:ring-offset-2 ${(form.status ?? "active") === "active" ? "bg-[#168cf2]" : "bg-neutral-300"}`}
              >
                <span
                  className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${(form.status ?? "active") === "active" ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </button>
              <span className="text-xs text-neutral-500">
                {(form.status ?? "active") === "active"
                  ? "Hoạt động"
                  : "Tạm ngừng"}
              </span>
            </div>
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Đóng
          </Button>
          <Button
            onClick={saveAgency}
            disabled={
              !formWard ||
              !provinceId ||
              !form.name.trim() ||
              !streetName.trim() ||
              !form.address.trim() ||
              (mode === "old" && (!oldDistrictId || !oldWardId))
            }
            style={{ backgroundColor: "#0587ef" }}
            className="appearance-none !bg-[#0587ef] hover:!bg-[#0587ef]"
          >
            Lưu
          </Button>
        </footer>
      </LucideModal>

      <LucideModal
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(undefined)}
        footer={null}
        width={440}
        centered
        styles={{ content: { padding: 0, borderRadius: 16 } }}
      >
        <div className="p-6">
          <h2 className="text-lg font-bold">Xóa cơ quan hành chính?</h2>
          <p className="mt-3 text-sm text-neutral-600">
            Bạn có chắc muốn xóa “{deleteTarget?.name}”? Thao tác này không thể
            hoàn tác.
          </p>
        </div>
        <footer className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
          <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={removeAgency}>
            Xóa
          </Button>
        </footer>
      </LucideModal>
    </div>
  );
}
