// src/services/auth/auth.ts
import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
      authorize: async (credentials) => {
        const { username, password } = credentials as IUserLogin;
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
            return {
              ...user?.data?.data,
              token: Token,
              expiredDate: ExpiredDate,
            };
          }

          return null;
        } catch (e: any) {
          const apiMessage =
            e?.response?.data?.message ?? "Đăng nhập thất bại";
          throw new Error(apiMessage);
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