export interface IPropAddressBase extends IAddressBase {
  PropTypeId: number;
  Direction: number;
  Location: number;

  Laws: number[];
  StatusUsage: number; // TINH TRANG NHA
}

export interface IAddressBase {
  LandNumber?: string;
  MapNumber?: string;

  ProvinceId: number;
  DistrictId: number;
  WardId: number;
  StreetId: number;
  AddressNumber: string;

  Lng?: number;
  Lat?: number;
  PlaceId?: string;
}
