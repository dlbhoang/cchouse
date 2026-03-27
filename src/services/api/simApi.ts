import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { ISimRequest, ISimResponse } from "@/lib/interfaces/ISim";

import { axiosClient } from "./api_config";

const url = "Sim";
const simApi = {
  useGet(params: ISearchOptions) {
    return useSWR(url, async (route) =>
      axiosClient.get<any, IListData<ISimResponse>>(route, {
        params,
      })
    );
  },

  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<ISimResponse>>(url, {
      params,
    });
  },
  count(params: ISearchOptions) {
    return axiosClient.get(`${url}/count`, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<ISimResponse>>(`${url}/${id}`);
  },
  add(data: ISimRequest) {
    return axiosClient.post<any, ISingleData<ISimResponse>>(url, data);
  },
  update(data: ISimRequest) {
    return axiosClient.put<any, ISingleData<ISimResponse>>(
      `${url}/${data.Id}`,
      data
    );
  },
  delete(id: number) {
    return axiosClient.delete<any, ISingleData<ISimResponse>>(`${url}/${id}`);
  },
};
export default simApi;
