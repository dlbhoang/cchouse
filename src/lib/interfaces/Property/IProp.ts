import { UploadFile } from 'antd';
import { IFileUploadResponse } from '@/services/api/imagesApi';
import { IMyUploadFile } from '../custom/IMyUploadFile';
import { IPropAddressRequest, IPropAddressResponse } from './IPropAddress';

export interface IPropAdminMap {
  Id: number;
  DisplayPrice?: string;
  PropAddress: {
    Lat?: number;
    Lng?: number;
    DisplayAddress?: string;
  };
  CustomDisplayStructures?: string;
  Status: number;

  Length?: number;
  Width?: number;
  Area: number;
}

export interface IPropRequest {
  Id: number;

  TransType: number;
  CustomerType: number;
  CustomerLogo?: string | IMyUploadFile[];
  CustomerName: string;
  CustomerPhone: string[];
  IsHidePhone: boolean;

  Price: number;
  PriceVnd: number;
  PaymentMethod: number;
  Images: string[] | UploadFile[] | null;

  Video?: string | UploadFile[] | null;
  Note: string;
  Commission: string;
  Status: number;

  RootId: number;
  NoBroker: boolean;

  FloorArea: number;
  Length: number;
  Width: number;
  Area: number;
  BackSide: number;

  Furniture: string;
  Structures: string | string[];
  Equipments: string | string[];
  Utils: string | string[];

  Basement: number;
  Floors: number;
  Bedroom: number;
  Bathroom: number;

  PropAddress: IPropAddressRequest;
}

export interface IPropResponse extends IPropRequest {
  UserAdminId: number;
  UserAdminName: string; // người nhập SĐT
  StatusName: string;
  CustomerTypeName: string;

  CreatedBy: string;
  CreatedDate: string;
  UpdatedBy: string;
  UpdatedDate: string;

  DisplayPrice: string;
  IsSaved: boolean;
  MainImage: IFileUploadResponse;
  // ImageCount: number;
  Video: string;

  // display
  IsMonopoly: boolean; // độc quyền
  DisplayStructures: string[];
  DisplayUtilities: string[];
  DisplayEquipments: string[];

  PropAddress: IPropAddressResponse;
  CustomDisplayStructures: string;
  PricePerSquareMeter?: string;
}

export interface IPropQU {
  Id: number;
  Note?: string;
  Status?: number;
}

export interface IPropCheckAddress {
  Id: number;
  CreatedBy: string;
  AddressNumber: string;
  SubAddressName: string;
  StreetName: string;
  WardName: string;
  DistrictName: string;
  Area?: number;
  Length?: number;
  Width?: number;
  BackSide?: number;
}
