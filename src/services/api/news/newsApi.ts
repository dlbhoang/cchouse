import useSWR, { mutate } from "swr";

import { axiosClient } from "../api_config";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";

import { INewsRequest, INewsResponse } from "./INews";

const url = "News";
const newsApi = {
  mutateKey: url,

  revalidate() {
    return mutate((key) => Array.isArray(key) && key[0] === url, undefined, {
      revalidate: true,
    });
  },

  useGet(params: INewsOpts) {
    return useSWR([url, params], async ([route, query]) => {
      return axiosClient.get<any, IListData<INewsResponse>>(route, {
        params: query,
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

  hidden(id: number) {
    return axiosClient.put(`${url}/${id}/Hidden`);
  },

  show(id: number) {
    return axiosClient.put(`${url}/${id}/Show`);
  },

  approve(id: number) {
    return axiosClient.put(`${url}/${id}/Approve`);
  },
};
export default newsApi;