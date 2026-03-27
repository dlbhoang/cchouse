import { IPropBaseDto } from '../base';

interface IPropRequirementRequest extends IPropBaseDto {
  Districts: number[];
  PropTypes: number[];

  Direction?: number[];
  Location?: number;
  LocationFeature?: number;
  PriceFrm?: number;
  PriceTo?: number;
  Floors?: number;
  Note?: string;
}

export type IPropBuyingRequirementRequest = IPropRequirementRequest;
export type IPropRentingRequirementRequest = IPropRequirementRequest;

export interface IPropRequirementResponse extends IPropRequirementRequest {
  Id: number;
  DistrictName: string[];
  PropTypeName: string[];

  DirectionName: string[];
  LocationName?: string;
  LocationFeatureName?: string;
  Status: number;
  StatusName: string;
  IsBuy: boolean;
}

export interface ICustomerRequest {
  Id: number;
  Type?: number;
  Name: string;
  Phone: string[];
  ViewableUserAdminIds: number[];
  BuyingRequirement?: IPropBuyingRequirementRequest;
  RentingRequirement?: IPropRentingRequirementRequest;
}

export interface ICustomerResponse extends ICustomerRequest {
  TypeName: string;
  IsSaved: boolean;
  IsShared: boolean;
  CreatedBy: string;
  CreatedDate: string;
  ViewableUserAdminNames: string[];
  BuyingRequirement?: IPropRequirementResponse;
  RentingRequirement?: IPropRequirementResponse;
}
