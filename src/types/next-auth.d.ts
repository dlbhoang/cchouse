import type { DefaultSession } from "next-auth";

declare module 'next-auth' {
  interface User extends IUserLogged {}
  interface Session {
    token: string;
    user: IUserLogged & DefaultSession["user"];
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
