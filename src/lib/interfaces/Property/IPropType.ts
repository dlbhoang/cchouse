export interface IPropTypeRequest {
  Id: number;
  IsActive: boolean;

  Name: string;
  PropRentCount: number;
  PropSellCount: number;
  ShowWebsite: boolean;
  TransTypes: string | string[];
  DisplayTransTypes: string[];
}

export interface IPropTypeResponse extends IPropTypeRequest {
  Slug: string;
  CreatedBy: string;
  CreatedDate: string;
}
