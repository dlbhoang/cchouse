export interface IAddressBase {
  AddressNumber: string;
  StreetId: number;
  StreetName: string;
  WardId: number;
  WardName: string;
  DistrictId: number;
  DistrictName: string;
  ProvinceId: number;
  ShowAddressNumber: boolean;
}

export interface IAddressBaseReponse {
  StreetName: string;
  WardName: string;
  DistrictName: string;
  ProvinceId: number;
  ProvinceName: string;
}

export interface IStructuresBase {
  Basement?: number;
  Floors?: number;
  Structures: number[];
}

export interface IConfig {
  DateForCountOldProp: number;
  RuleUrl: string;
}

export interface ISuggestAddressDto {
  FullName: string;
  FullAddressUnaccented: string;
  Name: string;
  ProvinceId: number;
  ProvinceSlug: string;
  DistrictId: number;
  DistrictSlug: string;
  WardId: number;
  WardSlug: string;
  StreetId: number;
  StreetSlug: string;
}
