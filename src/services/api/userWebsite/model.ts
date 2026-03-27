import { Dayjs } from "dayjs";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";

export interface IUserWebsiteOpts extends ISearchOptions {
  IsActive?: boolean;
  Status?: number;
  Type?: number;

  view?: "list" | "card";
}

export interface IUserWebsiteDemand {
  BasicDemandNames: string[];
  Id: number;
  BasicDemands: number[];
  OtherDemand?: string;
  ProvinceId?: number;
  ProvinceName?: string;
  DistrictIds: number[];
  DistrictNames: string[];
  TransTypes?: number[];
  PriceSellFrom: number;
  PriceSellTo: number;
  PriceRentFrom: number;
  PriceRentTo: number;

  Status: number;
  StatusName: string;
}

export interface IUserWebsiteRequest {
  Id?: number;
  Type: string | number;

  FullName: string;
  Email?: string | null;
  Phone: string;
  Gender?: number | null;
  Avatar?: string | null;
  Dob?: string | Dayjs | null;

  Banner?: string;
  About?: string;
}

export interface IUserWebsiteResponse extends IUserWebsiteRequest {
  VerifyEmail: boolean;
  IsActive: boolean;
  IsVerifiedPhone: boolean;
  ZaloId?: string;
  FacebookId?: string;
  TypeName: "Cá nhân" | "Công ty" | "Môi giới";
  StatusName: "Chưa xác thực" | "Chờ duyệt" | "Đã xác thực";
  IsNew: boolean;
  UserWebsiteDemand?: IUserWebsiteDemand;
  BackCCCDImg?: string;
  FrontCCCDImg?: string;

  UserApprove?: string;
  ApproveNote?: string;
  ApproveDate?: string;
}
