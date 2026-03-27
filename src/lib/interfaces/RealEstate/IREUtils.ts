export interface IREUtilsRequest {
  id: number;
  structures: string[];
  equiments: string[];
  utils: string[];
  errors: string[];
  floor: number;
  bedroom: number;
  bathroom: number;
}

export interface IREUtilsResponse extends IREUtilsRequest {
  createdBy: string;
  createdDate: string;
}
