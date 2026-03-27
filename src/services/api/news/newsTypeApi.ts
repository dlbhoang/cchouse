import useSWR from "swr";

import { axiosClient } from "../api_config";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";

import { INewsType } from "./INews";

const url = "NewsType";
const newsTypeApi = {
  mutateKey: url,
  useGet(params: ISearchOptions) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<INewsType>>(route, {
        params,
      });
    });
  },
  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<INewsType>>(url, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<INewsType>>(`${url}/${id}`);
  },
  add(data: INewsType) {
    return axiosClient.post<any, ISingleData<INewsType>>(url, data);
  },
  update(data: INewsType) {
    return axiosClient.put<any, ISingleData<INewsType>>(
      `${url}/${data.Id}`,
      data
    );
  },

  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },
};
export default newsTypeApi;
