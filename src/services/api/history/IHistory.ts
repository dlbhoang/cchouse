import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { IUserAdminPublic } from "../userAdmin/IUserAdmin";

export interface IHistoryOpts extends ISearchOptions {
  InstanceId?: number;
  TableName?: string;
  UserId?: number;
  NoteOnly?: boolean;
}

export interface IHistory {
  Id: number;
  TableName: string;
  Action: string;
  InstanceId: number;
  ActionDate: string;
  HistoryDetails: IHistoryDetails[];
  TableNameVietnamese: string;
  UserAdmin: IUserAdminPublic;
}
interface IHistoryDetails {
  ColumnName: string;
  ColumnNameVietnamese: string;
  OldValue: string;
  NewValue: string;
}

export interface IHistoryOld {
  Content: string;
  UpdatedDate: string;
  UpdatedBy: string;
  UserId: number;
  PropertyId: number;
  Note: string;
  Id: number;
  IsDeleted: boolean;
}
