// src/services/auth/auth.ts
import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { CredentialsSignin } from "next-auth";

class InvalidLoginError extends CredentialsSignin {
  code: string;
  constructor(message: string) {
    super();
    this.code = message;
  }
}

import { IUserLogin } from "@/lib/interfaces/IUser";
import { authConfig } from "@/services/auth/auth.config";

const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "origin",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<any> => {
        const { username, password } = credentials as IUserLogin;

        // Log để chắc chắn biến môi trường đã được nạp đúng
        console.log("NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);

        try {
          const res = await axios.post(
            "/AdminAuth",
            { Username: username, Password: password },
            axiosConfig
          );

          const { ExpiredDate, Token } = res.data.data as any;

          const user = await axios.get("/Me", {
            ...axiosConfig,
            headers: { Authorization: `Bearer ${Token}` },
          });

          if (user?.data?.data) {
            const userData = user.data.data as Record<string, any>;

            return {
              Id: userData.Id,
              Code: userData.Code,
              Name: userData.Name,
              Email: userData.Email,
              Phone: userData.Phone,
              CompanyPhone: userData.CompanyPhone,
              RoleId: userData.RoleId,
              RoleName: userData.RoleName,
              BranchId: userData.BranchId,
              BranchName: userData.BranchName,
              ManagedBy: userData.ManagedBy,
              Permission: userData.Permission,
              Avatar: userData.Avatar,
              DateOfBirth: userData.DateOfBirth,
              MustChangePassword: Boolean(userData.MustChangePassword),
              token: Token,
              expiredDate: ExpiredDate,
            } as any;
          }

          return null;
        } catch (e: any) {
          // Log chi tiết lỗi thật để biết nguyên nhân gốc
          console.error("AUTH ERROR DETAIL:", {
            message: e?.message,
            code: e?.code,
            responseStatus: e?.response?.status,
            responseData: e?.response?.data,
            baseURL: axiosConfig.baseURL,
          });

          const apiMessage =
            e?.response?.data?.message ?? e?.message ?? "Đăng nhập thất bại";
          throw new InvalidLoginError(apiMessage);
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, ...message) {
      console.error(code, message);
    },
    warn(code, ...message) {
      console.warn(code, message);
    },
    debug(code, ...message) {
      console.debug(code, message);
    },
  },
});