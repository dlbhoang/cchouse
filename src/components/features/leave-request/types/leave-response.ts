/**
 * LeaveResponse
 */
export interface ILeaveResponse {
  EndDate: Date;
  Id?: number;
  RequestNotes?: null | string;
  StartDate: Date;
  StatusName?: null | string;
  Type?: number;
  TypeName?: null | string;
  UserApprovedId?: number | null;
  UserApprovedName?: null | string;
  UserRequestId?: number;
  UserRequestName?: null | string;

  ApprovedDate?: string;
  ApprovedNotes?: string;
  CreatedDate?: string;
}
