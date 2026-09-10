import axios, {
  AxiosInstance,
  AxiosResponse,
} from "axios";
import { getSession, signOut } from "next-auth/react";

import { NotiBase } from "@/lib/components/shared/NotiBase";

const FORCE_CHANGE_PASSWORD_KEY = "cchouse-force-change-password";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => config,
  (error) => {
    console.log("error in request", error);
    return Promise.reject(error.message);
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (
      response.status === 200 &&
      response?.data?.message &&
      response.config.method !== "get" &&
      !response.config.url?.includes("upload") &&
      !response.config.url?.includes("video")
    ) {
      NotiBase("success", response?.data?.message);
    }
    return response.data;
  },
  async (error) => {
    const message = error?.response?.data?.message ?? error?.message ?? "";
    const isPermissionError = message.includes("Không có quyền thực hiện");

    if (isPermissionError) {
      const session = await getSession();
      const shouldForcePasswordChange = Boolean(
        session?.user?.MustChangePassword
      );

      if (shouldForcePasswordChange) {
        sessionStorage.setItem(FORCE_CHANGE_PASSWORD_KEY, "1");
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith("/login")) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error.response);
      }
    }

    if (error?.request?.status === 401) {
      NotiBase("error", "Hết hạn đăng nhập, vui lòng đăng nhập lại!");
      signOut();
    } else if (error?.response?.data?.data) {
      NotiBase("error", message);
    } else NotiBase("error", message);
    return Promise.reject(error.response);
  }
);