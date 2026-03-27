import { IREAddresRequest, IREAddresResponse } from './IREAddress';
import { IRealEstateRequest, IRealEstateResponse } from './IRealEstate';
import { IREUtilsRequest, IREUtilsResponse } from './IREUtils';

export interface IPropertyRequest {
  address: IREAddresRequest;
  utils: IREUtilsRequest;
  realEstate: IRealEstateRequest[];
}

export interface IPropertyResponse {
  address: IREAddresResponse;
  utils: IREUtilsResponse;
  realEstate: IRealEstateResponse[];
}
