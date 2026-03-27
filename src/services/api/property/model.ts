import { ETransType } from "@/lib/core/enum";
import { AddressOpts } from "@/lib/interfaces/filter/ISearchOptions";

export enum EPropTempStatus {
  NotConverted = 2,
  Converted,
  Error,
  Duplicate,
}

export interface IPropTemp {
  Id: number;
  ProvinceId: number;
  DistrictId: number;
  WardId: number;
  StreetId: number;
  AddressNumber: string;
  DistrictName: string;
  WardName: string;
  StreetName: string;
  TransType: number;
  Location: number;
  PropTypeId: number;
  PropTypeName: string;
  LandTypeName: string;
  CustomerName: string | null;
  CustomerPhone: string;
  Price: number;
  Note: string;
  ContractRent: string;
  FloorArea: number | null;
  Length: number;
  Width: number;
  Area: number;
  BackSide: number | null;
  Structures: string;
  CreatedAt: string;
  Status: number;
  StatusName: string;
  DisplayPrice: string;
}

export interface IPropTempOpts extends AddressOpts {
  Status?: number;
  UserAdminId?: number;
  PropTempId?: number;
  TransType?: ETransType;
  PropTypeIds?: string | number[];
  DistrictIds?: string;
  Location?: number;
  LocationFeature?: number;
  PriceFrm?: number;
  PriceTo?: number;
  AreaFrm?: number;
  AreaTo?: number;
  FloorAreaFrm?: number;
  FloorAreaTo?: number;
  LengthFrm?: number;
  LengthTo?: number;
  WidthFrm?: number;
  WidthTo?: number;
  LastUpdateDate?: string;
  IsSaved?: boolean;
  IsMonopoly?: boolean;
  CustomerType?: number;
}
