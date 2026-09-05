import axios, {
  AxiosInstance,
  AxiosResponse,
} from "axios";
import { signOut } from "next-auth/react";

import { NotiBase } from "@/lib/components/shared/NotiBase";

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
  (error) => {
    if (error?.request?.status === 401) {
      NotiBase("error", "Hết hạn đăng nhập, vui lòng đăng nhập lại!");
      signOut();
    } else if (error?.response?.data?.data) {
      NotiBase("error", error.response?.data?.message ?? error?.message);
    } else NotiBase("error", error.response?.data?.message ?? error?.message);
    return Promise.reject(error.response);
  }
);