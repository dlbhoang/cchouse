/* eslint-disable sonarjs/cognitive-complexity */
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";

import { IStructuresBase } from "@/lib/interfaces/base/IBase";
import { IEnumItem } from "@/lib/interfaces/base/ISelectListBase";
import { appConst } from "../configs/appConst";

export const convertToNumber = (
  value?: string | number
): number | undefined => {
  // Check if the value is defined before converting
  return value !== undefined ? Number(value) : undefined;
};

export const DisabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current && current.add(1, "day") < dayjs().endOf("day");
};

export const FormatNumber = (value?: number | string) =>
  `${value ?? 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const FormatDateSubmit = (value?: string) =>
  dayjs(value).format("YYYY-MM-DD");

export const FormatDateTime = (value?: string) =>
  dayjs(value).format(appConst.DATE_TIME_FORMAT);

export const FormatDate = (value?: string) =>
  value ? dayjs(value).format(appConst.DATE_FORMAT) : "";

export const FormatTime = (value?: string) =>
  dayjs(value, appConst.TIME_FORMAT).format(appConst.TIME_FORMAT);

export const CombineAddress = (data?: {
  AddressNumber?: string;
  SubAddressName?: string;
  StreetName?: string;
  WardName?: string;
  DistrictName?: string;
  ProvinceName?: string;
}) => {
  if (data) {
    const {
      AddressNumber,
      SubAddressName,
      StreetName,
      WardName,
      DistrictName,
      ProvinceName,
    } = data;
    if (
      !(AddressNumber || StreetName || WardName || DistrictName || ProvinceName)
    )
      return undefined;

    const result: string[] = [];
    if (StreetName)
      result.push(
        `${AddressNumber ?? ""} ${
          SubAddressName ? `(${SubAddressName})` : ""
        }${StreetName}`
      );
    if (WardName) result.push(WardName);
    if (DistrictName) result.push(DistrictName);
    if (ProvinceName) result.push(ProvinceName);

    return result.join(", ");
  }
  return undefined;
};

export const CombineStructures = (
  structures: IEnumItem[],
  data: IStructuresBase
) => {
  if (
    data.Basement === undefined &&
    data.Floors === undefined &&
    data.Structures === undefined
  )
    return undefined;

  const parts: string[] = [];
  // Handle basement
  if (data.Basement && data.Basement > 0) {
    parts.push(`${data.Basement} hầm`);
  }

  parts.push("trệt");

  // Process structures and handle 'lửng' (mezzanine) special case
  const structureNames = data.Structures?.toString()
    .split(",")
    .map((value) =>
      structures
        .find((x) => x.Value.toString() === value.toString())
        ?.Name.toLowerCase()
    )
    .filter((e) => e !== undefined);

  const hasLung = structureNames?.includes("lửng");

  // Handle floors with mezzanine
  if (data.Floors && data.Floors > 0) {
    if (hasLung) {
      parts.push("lửng", `${data.Floors} lầu`);
    } else {
      parts.push(`${data.Floors} lầu`);
    }
  }

  const remainingStructures = parts.includes("lửng")
    ? structureNames?.filter((name) => name !== "lửng" && name !== undefined)
    : structureNames?.filter((name) => name !== undefined);

  if (remainingStructures?.length) {
    parts.push(...(remainingStructures as string[]));
  }

  return parts.length ? parts.join(", ") : undefined;
};

export const ConvertToDisplayPrice = (
  price: number,
  paymentMethod: number
): string => {
  if (paymentMethod === 4) {
    return `${price} USD`;
  }
  const method = price >= 1000000000 ? "Tỷ" : "Triệu";
  if (price >= 1000000000) return `${price / 1000000000} ${method}`;
  return `${price / 1000000} ${method}`;
};

export const ConvertUsdToVnd = (price: number): string => {
  const value = price * 23000;
  const method = value >= 1000000000 ? "Tỷ" : "Triệu";

  if (value >= 1000000000) return `${value / 1000000000} ${method}`;
  return `${value / 1000000} ${method}`;
};

export const formatTimeAgo = (date: Dayjs) => {
  const currentTimestamp = dayjs();
  const timeDifference = currentTimestamp.diff(date, "second");

  const days = Math.floor(timeDifference / (3600 * 24));
  const hours = Math.floor((timeDifference % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeDifference % 3600) / 60);
  const seconds = timeDifference % 60;

  if (days > 0) {
    return `${days} ngày trước`;
  }
  if (hours > 0) {
    return `${hours} giờ trước`;
  }
  if (minutes > 0) {
    return `${minutes} phút trước`;
  }
  return `${seconds} giây trước`;
};
