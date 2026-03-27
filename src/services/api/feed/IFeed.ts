import { Dayjs } from 'dayjs';
import { IPropFeedResponse } from './IPropFeed';

interface IFeedBase {
  Id: number;
  Title: string;
  Content: string;

  Days: number;
  StartDate?: string | Dayjs;
  ExpiredDate?: string | Dayjs;

  AutoRenew: number;
  IsCompanyPhone: boolean;
  ViewCount: number;
}

export interface IFeedRequest extends IFeedBase {
  Property: IPropFeedResponse;
}

export interface IFeedResponse extends IFeedRequest {
  AcceptDate?: string;
  AcceptBy?: string;
  Author?: IFeedAuthor;
  Status: number;
  StatusName: string;
  ReasonDeny: string;
}

interface IFeedAuthor {
  Id: number;
  Type: any;
  TypeName: any;
  Avatar: string;
  FullName: string;
  Email: string;
  Phone: string;
  Gender: number;
  IsAdmin: boolean;
}
