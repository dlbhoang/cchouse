import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import {
  ISearchWardDto,
  IWardRequest,
  IWardResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import { IConfigAddressFilter } from "@/lib/interfaces/filter/ISearchOptions";

import { axiosClient } from "./api_config";

const url = "Ward";
const wardApi = {
  useGet(params: IConfigAddressFilter) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IWardResponse>>(route, {
        params,
      });
    });
  },
  get(params: IConfigAddressFilter) {
    return axiosClient.get<any, IListData<IWardResponse>>(url, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IWardResponse>>(`${url}/${id}`);
  },
  add(data: IWardRequest) {
    return axiosClient.post<any, ISingleData<IWardResponse>>(url, data);
  },
  update(data: IWardRequest) {
    return axiosClient.put<any, ISingleData<IWardResponse>>(
      `${url}/${data.Id}`,
      data
    );
  },
  upload(data: FormData) {
    return axiosClient.post(`${url}/upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getMergedTo(oldWardId: number) {
    return axiosClient.get<any, IListData<ISearchWardDto>>(
      `${url}/${oldWardId}/MergedTo`
    );
  },
};
export default wardApi;
