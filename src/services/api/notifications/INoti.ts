import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";

export interface INotiRequest {
  Id: number;
  Title: string;
  Summary: string;
  Description: string;
  Thumbnail: string;
  ReferenceId?: string;
  ReferenceType?: number;
  AttachFiles?: any[];

  SendToUsers?: number[];
}

export interface INotiResponse extends INotiRequest {
  ReferenceTypeName?: string;

  CreatedAvatar?: string;
  CreatedBy: string;
  CreatedDate: string;
  UpdatedBy: string;
  UpdatedDate: string;
}

export interface INotiUserResponse {
  Status: number;
  Notification: INotiResponse;
}

export interface INotiOpts extends ISearchOptions {
  Status?: number;
  OriginNoti?: boolean;
}
