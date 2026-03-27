export interface IREAddresRequest {
  id: number;
  reTypes: number[];
  direction: string;
  location: string;
  numberAddress: string;
  cityId: number;
  districtId: number;
  wardId: number;
  streetId: number;
  length: number;
  width: number;
  area: number;
  backSide: number;
  realLength: number;
  realWidth: number;
  realArea: number;
  realBackSide: number;
  lawStatus: string[];
  reStatus: string;
}

export interface IREAddresResponse extends IREAddresRequest {
  createdBy: string;
  createdDate: string;
}
