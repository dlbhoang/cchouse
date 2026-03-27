import { Dayjs } from 'dayjs';

import { IUserAccessRequest, IUserAccessResponse } from './IUserAccess';

export interface IRegisterAdmin {
  Email: string;
  EmailExt?: string; // hỗ trợ select
  Name: string;
  Sex?: number;
  Address?: string;
  TempAddress?: string;
  DateOfBirth?: string | Dayjs;

  Password: string;
  Phone: string;
  IdentityImages: any[];
}

interface IUserAdminBase {
  Id?: number;
  BranchId?: number;
  RoleId?: number;
  SimId?: number;
  Rank: number;

  Name: string;
  Email: string;
  EmailExt?: string; // hỗ trợ select
  Sex: number;
  Avatar: string | any[];
  Phone: string;
}

interface IUserAdminRequestBase extends IUserAdminBase {
  Address: string;
  TempAddress: string;
  DateOfBirth: string | Dayjs;
  Thumbnail: string;

  Literacy: number;
  Insurrance: boolean;
  Salary: number;
  Commission: number;
  ManagedBy: number;
  Note: string;
  IdentityImages: any[];
  Images: any[];
  UserAccess?: IUserAccessRequest | IUserAccessResponse;
}

interface IUserAdminResponseBase extends IUserAdminRequestBase {
  Code: string;
  Status: number;
  StatusName: string;
  RoleName: string;
  BranchName: string;

  Evaluation: string;
  ShowWebsite: boolean;

  CreatedBy: string;
  CreatedDate: string;
  ManagerName: string;
  CompanyPhone: string;
}

export interface IUserAdminRequest extends IUserAdminRequestBase {
  UserAccess?: IUserAccessRequest;
}

export interface IUserAdminResponse extends IUserAdminResponseBase {
  UserAccess?: IUserAccessResponse;
}
export interface IUserAdminQU {
  Id: number;
  Status: number;
  Evaluation: string;
  Note: string;
  Rank: number;
  ShowWebsite: boolean;
}

export interface IUserAdminPublic extends IUserAdminBase {
  Code: string;
  BranchName: string;
  RoleName: string;
  Status: number;
}
