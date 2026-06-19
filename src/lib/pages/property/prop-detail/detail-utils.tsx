import { CombineAddress, CombineStructures } from "@/lib/core/utils/myFormat";
import { IEnumItem } from "@/lib/interfaces/base/ISelectListBase";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";

export const displayValue = (val?: string | number | null) => {
  if (val === undefined || val === null || val === "") return "--";
  return String(val);
};

export const getEnumName = (list: IEnumItem[], value?: number | string) => {
  if (value === undefined || value === null || value === "") return "--";
  return list.find((x) => x.Value === Number(value))?.Name ?? "--";
};

export const getEnumNames = (
  list: IEnumItem[],
  values?: string | string[] | number[]
) => {
  if (!values || (Array.isArray(values) && values.length === 0)) return "--";

  const valueArr = Array.isArray(values)
    ? values
    : values.toString().split(",");

  const names = valueArr
    .map((value) => list.find((x) => x.Value === Number(value))?.Name)
    .filter(Boolean);

  return names.length > 0 ? names.join(", ") : "--";
};

export const formatPropertyAddress = (data: IPropResponse) => {
  const main =
    data.PropAddress.DisplayAddress || CombineAddress({ ...data.PropAddress });

  const oldParts = [
    data.PropAddress.OldWardName &&
    data.PropAddress.WardId !== data.PropAddress.OldWardId
      ? data.PropAddress.OldWardName
      : undefined,
    data.PropAddress.OldDistrictName &&
    data.PropAddress.DistrictId !== data.PropAddress.OldDistrictId
      ? `${data.PropAddress.OldDistrictName} (cũ)`
      : undefined,
  ].filter(Boolean);

  if (oldParts.length === 0) return main;

  return `${main} (${oldParts.join(", ")})`;
};

export const formatStructures = (
  structures: IEnumItem[],
  data: IPropResponse
) => {
  const structureValues = Array.isArray(data.Structures)
    ? data.Structures.map(Number)
    : data.Structures
      ? data.Structures.toString().split(",").map(Number)
      : [];

  return (
    data.CustomDisplayStructures ||
    CombineStructures(structures, {
      Basement: data.Basement,
      Floors: data.Floors,
      Structures: structureValues,
    }) ||
    "--"
  );
};

export const formatStreetWidth = (value?: number) => {
  if (!value) return "--";
  if (value < 5) return "Dưới 5m";
  return `${value}m`;
};

export const formatAlleyTurn = (value?: number) => {
  if (value === undefined || value === null) return "--";
  if (value < 5) return "Dưới 5m";
  return `${value}m`;
};

export const formatCommission = (commission?: string | number | null) => {
  if (commission === undefined || commission === null || commission === "") {
    return null;
  }

  const raw = String(commission).trim().replace(/%/g, "").trim();
  if (!raw) return null;

  return `${raw}%`;
};
