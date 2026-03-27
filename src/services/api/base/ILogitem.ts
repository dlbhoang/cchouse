import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";

export interface ILogOpts extends ISearchOptions {
  UserAdminName?: string;
  Method?: string;
}

export interface ILogItem {
  "@t": string;
  Format: string;
  Exception: string; // exception
  Scheme: string;
  Query: string;
  RequestMethod: string;
  RequestPath: string;
  StatusCode: string;
  Elapsed: string;
  Body: string;
  BodyObj: any;

  ConnectionId: string;
  RequestId: string;

  User: string;
  Error: string;
}
