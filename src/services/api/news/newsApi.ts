import useSWR from "swr";

import { axiosClient } from "../api_config";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";

import { INewsRequest, INewsResponse } from "./INews";

const url = "News";
const newsApi = {
  mutateKey: url,

  useGet(params: INewsOpts) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<INewsResponse>>(route, {
        params,
      });
    });
  },
  get(params: INewsOpts) {
    return axiosClient.get<any, IListData<INewsResponse>>(url, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<INewsResponse>>(`${url}/${id}`);
  },
  add(data: INewsRequest) {
    return axiosClient.post<any, ISingleData<INewsResponse>>(url, data);
  },
  update(data: INewsRequest) {
    return axiosClient.put<any, ISingleData<INewsResponse>>(
      `${url}/${data.Id}`,
      data
    );
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },

  updateStatus(id: number, status: "Hidden" | "Show") {
    return axiosClient.put(`${url}/${id}/UpdateStatus/${status}`);
  },
};
export default newsApi;
