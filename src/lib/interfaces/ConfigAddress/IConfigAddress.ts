type IConfigAddress = {
  Id: number;
  Name: string;
  ShortName: string;
  RefKey: string;
  Type: string;
  Images: string | any[];
};

export interface IDVHCItem {
  Id: string;
  Name: string;
  NameEn: string;
  Type: string;
}

export type IProvinceRequest = IConfigAddress;
export type IProvinceResponse = IConfigAddress & {
  Slug: string;
};

export type IDistrictRequest = IConfigAddress & {
  ProvinceId: number;
};
export type IDistrictResponse = IDistrictRequest & {
  Slug: string;
  ProvinceName: string;
};

export type IWardRequest = IConfigAddress & {
  DistrictId?: number;
  ProvinceId?: number;
  IsNew?: boolean;
};
export type IWardResponse = IWardRequest & {
  Slug: string;
  DistrictName: string;
  ProvinceName: string;
  IsNew?: boolean;
};

export type ISearchWardDto = {
  WardId: number;
  WardName: string;
  Headquarters: string;
  MergedFrom: string[];
};

export type IStreetRequest = IConfigAddress & {
  DistrictId: number;
  WardId?: number | null;
  OldWardId?: number | null;
  UpdateWardLinks?: boolean;
};
export type IStreetResponse = IStreetRequest & {
  Slug: string;
  DistrictName: string;
};
