import { Dayjs } from 'dayjs';

export interface ISimRequest {
  Id: number;
  UserAdminId: number | null;
  PhoneNumber: string;

  IsPrepaid: boolean;
  MobileNetwork: number;
  MoneySupport: number;
  ReceivedDate: string | Dayjs;
  Note: string;
}

export interface ISimResponse extends ISimRequest {
  UserAdminPhone: string;
  UserAdminName: string;
  MobileNetworkName: string;
  CreatedBy: string;
  UpdatedBy: string;
  CreatedDate: string | Dayjs;
  UpdatedDate: string | Dayjs;
}
