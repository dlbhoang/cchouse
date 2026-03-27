import axios from "axios";

import { NotiBase } from "@/lib/components/shared/NotiBase";

// eslint-disable-next-line import/prefer-default-export
export const axiosWebsite = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "origin",
  },
});

// Add a request interceptor
axiosWebsite.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error.message);
  }
);

// Add a response interceptor
axiosWebsite.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log("response axios: ", response);
    if (response.status === 200 && response.config.method !== "get") {
      NotiBase("success", response?.data?.message);
    }

    return response.data;
  },
  (error) => {
    console.log("error api: ", error);
    if (error?.request?.status === 401) {
      NotiBase("error", "Lỗi xác thực");
    } else NotiBase("error", error.response?.data?.message);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response);
  }
);
