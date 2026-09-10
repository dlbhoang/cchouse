import { IUserAdminResponse } from '@/services/api/userAdmin/IUserAdmin';

declare module 'next-auth' {
  interface Session {
    token: string;
    user: IUserLogged;
  }
}

interface IUserLogged {
  Id?: number;
  Code?: string;
  Name?: string;
  Email?: string;
  Phone?: string;
  CompanyPhone?: string;
  RoleId?: number;
  RoleName?: string;
  BranchId?: number;
  BranchName?: string;
  ManagedBy?: number;
  Permission?: number;
  Avatar?: string;
  DateOfBirth?: string;
  MustChangePassword?: boolean;
  token: string;
  expiredDate: string;
}
