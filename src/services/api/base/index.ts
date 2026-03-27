export interface IQuickUpdate {
  Id: number;
  Note?: string;
  Status?: number;
}

export interface IPropAddressDto extends IAddressBaseDto {
  PropTypeId: number;
  Direction?: number;
  Location?: number;
  Laws?: number[];
  SubAddress?: number;

  OldAddressNumber?: number;
  OldDistrictId?: number;
  OldWardId?: number;
  OldStreetId?: number;
}

interface IAddressBaseDto {
  AddressNumber: string;
  DistrictId: number;
  WardId: number;
  StreetId: number;
}

export interface IBaseDto {
  CreatedBy: string;
  CreatedDate: string;
  UpdatedBy: string;
  UpdatedDate: string;
  IsDeleted: boolean;
}

export interface IPropBaseDto {
  Length?: number;
  Width?: number;
  Area?: number;
}

export interface IBaseOpts {
  search?: string | null;
  pageSize: number;
  pageIndex: number;
  filter?: string | null;
  sortName?: string | null;
  sortType?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface IStatusOpts extends IBaseOpts {
  Status?: number;
}
