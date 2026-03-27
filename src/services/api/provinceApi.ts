import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import {
  IProvinceRequest,
  IProvinceResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import {
  IConfigAddressFilter,
  ISearchOptions,
} from "@/lib/interfaces/filter/ISearchOptions";

import { axiosClient } from "./api_config";

const url = "Province";
const provinceApi = {
  useGet(params: IConfigAddressFilter) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IProvinceResponse>>(route, {
        params,
      });
    });
  },
  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<IProvinceResponse>>(url, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IProvinceResponse>>(`${url}/${id}`);
  },
  add(data: IProvinceRequest) {
    return axiosClient.post<any, ISingleData<IProvinceResponse>>(url, data);
  },
  update(data: IProvinceRequest) {
    return axiosClient.put<any, ISingleData<IProvinceResponse>>(
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
};
export default provinceApi;
