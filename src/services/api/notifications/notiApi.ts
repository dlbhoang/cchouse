import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "../../../lib/interfaces/filter/ISearchOptions";
import { axiosClient } from "../api_config";

import { INotiRequest, INotiResponse } from "./INoti";

const url = "Noti";
const notiApi = {
  mutateKey: url,
  useGet(params: ISearchOptions) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<INotiResponse>>(route, {
        params,
      });
    });
  },
  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<INotiResponse>>(url, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<INotiResponse>>(`${url}/${id}`);
  },
  add(data: INotiRequest) {
    return axiosClient.post<any, ISingleData<INotiResponse>>(url, data);
  },

  put(data: INotiRequest) {
    return axiosClient.put<any, ISingleData<INotiResponse>>(
      `${url}/${data.Id}`,
      data
    );
  },
  markAllAsRead() {
    return axiosClient.post(`${url}/MarkAllAsRead`);
  },
};
export default notiApi;
