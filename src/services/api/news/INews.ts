export interface INewsType {
  Id?: number;
  Name: string;
  NewsCount?: number;
}

export interface INewsRequest {
  Id?: number;
  NewsTypeId: number;
  Title: string;
  Summary: string;
  Content: string;
  Thumbnail: string | any[];
  Status: number;
}

export interface INewsResponse extends INewsRequest {
  StatusName: string;
  ViewCount: number;
  CreatedBy: string;
  CreatedDate: string;
  UpdatedDate: string;
}
