import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";

import { objToQueryString } from "@/lib/core/utils/app-func";
import { axiosClient } from "../api_config";
import { IUserWebsiteOpts, IUserWebsiteResponse } from "./model";

const url = "UserWebsiteAdmin";

const userWebsiteApi = {
  useGet(opts: IUserWebsiteOpts) {
    const params = objToQueryString(opts);

    console.log(params);
    return useSWR(`${url}?${params}`, async (route) => {
      return axiosClient.get<any, IListData<IUserWebsiteResponse>>(route);
    });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IUserWebsiteResponse>>(
      `${url}/${id}`
    );
  },
  block(id: number) {
    return axiosClient.put(`${url}/${id}/Block`);
  },

  approve(id: number, data: { IsApproved: boolean; Note: string }) {
    return axiosClient.put(`${url}/${id}/ApproveUserWebsite`, data);
  },
};
export default userWebsiteApi;
