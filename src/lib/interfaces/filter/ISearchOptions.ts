import { ETransType } from "@/lib/core/enum";

export interface ISearchOptions {
  search?: string | null;
  pageSize: number;
  pageIndex: number;
  filter?: string | null;
  sortName?: string | null;
  sortType?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface AddressOpts extends ISearchOptions {
  AddressNumber?: string;
  SubAddress?: string;
  ProvinceId?: number | string;
  DistrictId?: number | string;
  WardId?: number | string;
  StreetId?: number | string;
  Direction?: number | number[];
}

export interface IRecruitmentOpts extends ISearchOptions {
  Role?: string;
  Place?: string;
  Status?: number;
}

export interface INewsOpts extends ISearchOptions {
  CreatedBy?: string;
  NewsTypeIds?: string;
  Status?: number;
}

export interface IConfigAddressFilter extends ISearchOptions {
  DistrictId?: number | string | string[];
  ProvinceId?: number | string | string[];
  IsNew?: boolean;
}

export interface IFeedFilter extends AddressOpts {
  Status?: number;
  TransType?: ETransType;
  UserAdminId?: number;
  UserId?: number; //user website id

  PriceFrm?: number;
  PriceTo?: number;
  AreaFrm?: number;
  AreaTo?: number;
  LengthFrm?: number;
  LengthTo?: number;
  WidthFrm?: number;
  WidthTo?: number;
}

export interface ICustomerWebsiteFilter extends ISearchOptions {
  IsActive?: boolean;
}

export interface IUserAdminOpts extends ISearchOptions {
  BranchId?: number;
  Status?: number;
  RoleId?: number;
  ManagedBy?: number;
}

export interface IPropAdminOpts extends AddressOpts {
  Status?: number[];
  UserAdminId?: number;
  PropertyId?: number;
  TransType: ETransType;
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
export interface IParcelLandAdminOpts extends AddressOpts {
  Status?: number;
  PriceFrm?: number;
  PriceTo?: number;
  AreaFrm?: number;
  AreaTo?: number;
  LengthFrm?: number;
  LengthTo?: number;
  WidthFrm?: number;
  WidthTo?: number;
  LandNumber?: number;
  MapNumber?: number;
}

export interface ICustomerOpts extends ISearchOptions {
  Type?: number;
  TransType?: number;
  PriceFrm?: number;
  PriceTo?: number;
  AreaFrm?: number;
  AreaTo?: number;
  LengthFrm?: number;
  LengthTo?: number;
  WidthFrm?: number;
  WidthTo?: number;
}
