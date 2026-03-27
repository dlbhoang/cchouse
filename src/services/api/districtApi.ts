import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import {
  IDistrictRequest,
  IDistrictResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import { IConfigAddressFilter } from "@/lib/interfaces/filter/ISearchOptions";

import { axiosClient } from "./api_config";

const url = "District";
const districtApi = {
  useGet(params: IConfigAddressFilter) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IDistrictResponse>>(route, {
        params,
      });
    });
  },
  get(params: IConfigAddressFilter) {
    return axiosClient.get<any, IListData<IDistrictResponse>>(url, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IDistrictResponse>>(`${url}/${id}`);
  },
  add(data: IDistrictRequest) {
    return axiosClient.post<any, ISingleData<IDistrictResponse>>(url, data);
  },
  update(data: IDistrictRequest) {
    return axiosClient.put<any, ISingleData<IDistrictResponse>>(
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
export default districtApi;
