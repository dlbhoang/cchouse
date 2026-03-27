import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { IPropAddressBase } from "../../../lib/interfaces/base/IPropAddressBase";
import { UploadFile } from "antd";

export interface IPropFeedRequest extends Omit<IPropAddressBase, "Laws"> {
  Id: number;
  RefPropId: number | null;
  Price: number;
  HiddenPrice: boolean;
  IsCorner: boolean;
  PaymentMethod: number;
  TransType: number;
  ShowAddressNumber: boolean;

  Images: string[] | UploadFile[] | null;
  Video: string | IMyUploadFile[] | null;

  FloorArea: number;
  Length: number;
  Width: number;
  Area: number;

  Furniture: string;
  Structures: number[];
  Utils: number[];
  Equipments: number[];

  Basement?: number;
  Floors?: number;
  Bedroom?: number;
  Bathroom?: number;

  Laws: number;

  //cho-thue
  DepositPrice?: number; //số tiền cọc

  //can-ho
  ApartmentName?: string;
  ApartmentUnitType?: number; // loại hình căn hộ
  Code?: string;
  Block?: string;
  BalconyDirection?: number; // hướng ban công
  FloorNumber?: string; // tầng, lầu số
}

export interface IPropFeedResponse extends IPropFeedRequest {
  PricePerSquareMeter?: string;
  CustomDisplayStructures?: string;

  ProvinceId: number;
  DistrictName: string;
  WardName: string;
  StreetName: string;

  DisplayPrice: string;
  FullPrice: number;
  PropTypeName: string;
  PaymentMethodName: string;
  TransTypeName: string;
  LocationName: string;
  DirectionName: string;
  StatusName: string;

  DisplayStructures: string[];
  DisplayUtilities: string[];
  DisplayEquipments: string[];
  DisplayLaws: string[];
}
