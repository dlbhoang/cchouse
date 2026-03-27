export interface IBranchRequest {
  Id?: number;
  Code: string;
  Name: string;
  AddressNumber: string;
  DistrictId: number;
  WardId: number;
  StreetId: number;
  ContactName: string;
  ContactPhone: string;
  ContactEmail: string;
}
export interface IBranchResponse extends IBranchRequest {
  ProvinceId: number;
  ProvinceName: string;
  DistrictName: string;
  WardName: string;
  StreetName: string;
  NumberOfUsers: number;
}
