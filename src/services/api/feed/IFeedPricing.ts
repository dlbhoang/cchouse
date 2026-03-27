export interface IFeedPricingRequest {
  Id: number;
  Title: string;
  Content: string;
  ArrDiscount: number[];
  ArrTotalPrice: number[];
  IsActive: boolean;
}

export interface IFeedPricingResponse extends IFeedPricingRequest {
  CreatedBy: string;
  CreatedDate: string;
}
