import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { IBaseOpts } from "../../base";
import { IFileUploadResponse } from "../../imagesApi";
import { IApartmentResponse } from "../IApartment";

/**
 * ApartmentUnit_Post Request
 *
 * cchouse.Domain.Dtos.ApartmentUnit.ApartmentUnitRequest
 */
export interface IApartmentUnitRequest {
  ApartmentId?: number;
  Area?: number;
  Bathroom?: number;
  Bedroom?: number;
  Block?: string;
  Code: string;
  Contact: IApartmentUnitContactRequest;
  Direction?: number;
  BalconyDirection?: number;
  FloorNumber?: string;
  Furniture?: string;
  Id: number;
  Images?: any[];
  Note?: string;
  PropTypeId: number;
  Status: number;
  TransType: number;
  Video?: string | IMyUploadFile[] | null;
  Zone?: string;
  ApartmentUnitType?: number;

  StatusUsage?: number;
  Law?: number;
  InternalRoad?: string; //đường nội khu
  Outstanding?: string; //đặc điểm
  PriceForRent?: number;
  PriceForRentMethod?: number;
  EndTimeRent?: string;
}
export interface IApartmentUnitResponse extends IApartmentUnitRequest {
  TransTypeName: string;
  ApartmentUnitTypeName: string;
  StatusName: string;
  DirectionName?: string;
  BalconyDirectionName?: string;
  PropTypeName: string;
  UserAdminId: number;

  IsSaved: boolean;

  CustomDisplayStructures: string;

  MainImage: IFileUploadResponse;
  Contact: IApartmentUnitContactResponse;
  Apartment: IApartmentResponse;

  CreatedBy: string;
  CreatedDate: string;
}

export interface IApartmentUnitContactRequest {
  IsHidePhone?: boolean;
  PaymentMethod: number;
  Name: string;
  NoBroker?: boolean;
  Phone: string[];
  Price: number;
  Type: number;
}

export interface IApartmentUnitContactResponse
  extends IApartmentUnitContactRequest {
  DisplayPrice: string;
  TypeName: string;
}

/**
 * cchouse.Domain.Dtos.ApartmentUnit.ApartmentUnitOpts
 */
export interface IApartmentUnitOpts extends IBaseOpts {
  ApartmentId?: number;
  CreateUserId?: number;

  PropTypeId?: number[];
  Status?: number[];
  AreaFrm?: number;
  AreaTo?: number;
  PriceFrm?: number;
  PriceTo?: number;
  TransType?: number;
  DistrictId?: number;
}
