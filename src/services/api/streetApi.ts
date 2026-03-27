import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import {
  IStreetRequest,
  IStreetResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import { IConfigAddressFilter } from "@/lib/interfaces/filter/ISearchOptions";

import { axiosClient } from "./api_config";

const url = "Street";
const streetApi = {
  mutateKey: url,
  useGet(params: IConfigAddressFilter) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IStreetResponse>>(route, {
        params,
      });
    });
  },
  get(params: IConfigAddressFilter) {
    return axiosClient.get<any, IListData<IStreetResponse>>(url, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IStreetResponse>>(`${url}/${id}`);
  },
  add(data: IStreetRequest) {
    return axiosClient.post<any, ISingleData<IStreetResponse>>(url, data);
  },
  update(data: IStreetRequest) {
    return axiosClient.put<any, ISingleData<IStreetResponse>>(
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
export default streetApi;
