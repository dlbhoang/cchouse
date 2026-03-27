import { IPropAddressQU, IPropAddressResponse } from './IPropAddress';

export interface IPropPreview {
  Id: number;
  Title: string;
  Content: string;

  TransType: number;
  Price: number;
  PaymentMethod: number;
  PublicImages: string;
  Video: string;

  ShowWebsite: boolean;
  ShowWebsiteDate: string;
  PropAddress: IPropAddressResponse;

  TransTypeName: string;
  DisplayPrice: string;
}

export interface IPropPreviewUpdate {
  Id: number;
  Title: string;
  Content: string;

  Price: number;
  PaymentMethod: number;

  PropAddress: IPropAddressQU;
}
