import { IUserAdminResponse } from '@/services/api/userAdmin/IUserAdmin';

declare module 'next-auth' {
  interface Session {
    token: string;
    user: IUserLogged;
  }
}

interface IUserLogged extends IUserAdminResponse {
  token: string;
  expiredDate: string;
}
