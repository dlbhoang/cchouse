import { ETransType } from "@/lib/core/enum";

/**
 * PropLimitInfoDtoBaseApiResponse
 */
export interface IPropAccess {
  Prop?: PropLimitInfoDto;
  IsAllowed: boolean;
}

/**
 * PropLimitInfoDto
 */
export interface PropLimitInfoDto {
  TransType: ETransType;
  AddressNumber?: null | string;
  Area?: number | null;
  BackSide?: number | null;
  UserAdminName?: null | string;
  DistrictName?: null | string;
  Id?: number;
  Length?: number | null;
  StreetName?: null | string;
  SubAddressName?: null | string;
  WardName?: null | string;
  Width?: number | null;
}
