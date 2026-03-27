import { IAddressBase } from "@/lib/interfaces/base/IPropAddressBase";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { IAddressBaseReponse } from "../../../lib/interfaces/base/IBase";

export interface IApartmentRequest extends IAddressBase {
  Id?: number;

  Name: string;
  Description: string;
  Area: number;

  Investor: string;
  InvestorPhone: string;
  Utilities: number[];

  Types: number[]; // loai hinh
  Dimension: string; // Quy mô
  Location: number;
  Law: number;

  LawImages: any[];
  Images: any[];
  Video: string | IMyUploadFile[] | null;
}

export interface IApartmentResponse
  extends IApartmentRequest,
    IAddressBaseReponse {
  Slug: string;
  ProvinceId: number;
  LawName: string;

  DisplayAddress: string;
  DisplayUtilities: string[];
  DisplayTypes: string[];
}
