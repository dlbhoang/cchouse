import { Dayjs } from 'dayjs';

export interface IUserAccessRequest {
  RETypes: string;
  DistrictIds: string | string[];
  DistrictRentIds: string | string[];
  WardIds: string[];
  PriceFrm: number;
  PriceTo: number;
  PriceRentFrm: number;
  PriceRentTo: number;
  TransTypes: string | string[];
  Locations: string | string[];
  BlockProperty: boolean;
  DateStart: string | Dayjs;
  TimeFrom: string | any;
  TimeTo: string | any;
  WorkWeekend: string | string[];
}

export interface IUserAccessResponse extends IUserAccessRequest {
  DisplayWorkWeekend: string[] | null;
  DisplayTransTypes: string[] | null;
  DisplayLocations: string[] | null;
  DisplayDistricts: string[] | null;
}
