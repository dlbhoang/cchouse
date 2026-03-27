import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";

import { NotiBase } from "@/lib/components/shared/NotiBase";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "origin",
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();
    if (session) {
      config.headers.Authorization = `Bearer ${session.user.token}`;
    }
    // Do something before request is sent
    return config;
  },
  (error) => {
    console.log("error in request", error);
    // LogBot.sendMessage(JSON.stringify(error));
    // Do something with request error
    return Promise.reject(error.message);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
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
    // LogBot.sendMessage(JSON.stringify(error));
    if (error?.request?.status === 401) {
      NotiBase("error", "Hết hạn đăng nhập, vui lòng đăng nhập lại!");
      signOut();
    } else if (error?.response?.data?.data) {
      NotiBase("error", error.response?.data?.message ?? error?.message);
    } else NotiBase("error", error.response?.data?.message ?? error?.message);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response);
  }
);
