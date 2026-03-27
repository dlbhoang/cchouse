export interface IUserToken {
  token: string;
  id: number;
  expiredTime: string;
  username: string;
  fullName: string;
  email: string;
  roles: string;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface IUserAdminV1 {
  Id: number;
  NumberId: string;
  RankId: number;
  UserName: string;
  FullName: string;
  Email: string;
  Phone: string;
  CompanyPhone1: string;
  UserLevel: number;
  DateStart: string;
  DateOfBirth: string;
  managerName: string;
  avata: string;

  token: string;
  expiredDate: string;
}
