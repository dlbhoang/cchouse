import { IPropAddressBase } from '../base/IPropAddressBase';

export interface IPropAddressRequest extends IPropAddressBase {
  Id: number;
  PropName: string;

  StreetWidth: number;
  DistanceToFont: number;
  AlleyTurns: number;
  AlleyValues?: number[];

  LengthLegal: number;
  WidthLegal: number;
  AreaLegal: number;
  BackSideLegal: number;
  Errors: string | string[];

  LocationFeature: number;
  IsOneWay: boolean;
  UsageLaw: number;

  PriceForRent?: number;
  PriceForRentMethod?: number;
  EndTimeRent?: string;
  EndTimeRentUnit?: string; //FE only

  OldAddressNumber: string;
  OldDistrictId: number | null;
  OldWardId: number | null;
  OldStreetId: number | null;
  SubAddress?: number;
}

export interface IPropAddressResponse extends IPropAddressRequest {
  ProvinceName?: string;
  DistrictName?: string;
  WardName?: string;
  StreetName?: string;
  PropTypeName: string;
  StatusUsageName: string;
  DirectionName: string;
  LocationName: string;
  LocationFeatureName: string;
  // display
  DisplayPriceForRent?: string;
  DisplayLaws: string[];
  DisplayAddress: string;

  OldDistrictName?: string;
  OldWardName?: string;
  OldStreetName?: string;
  SubAddressName?: string;

  Lat?: number;
  Lng?: number;
}

export interface IPropAddressQU {
  Direction: number;
  Length: number;
  Width: number;
  Area: number;
  BackSide: number;
  FloorArea: number;

  Laws: string | string[];
  Structures: string | string[];
  Equipments: string | string[];
  Utils: string | string[];
  Errors: string | string[];

  Basement: number;
  Floors: number;
  Bedroom: number;
  Bathroom: number;

  Status: number;
}
