import useSWR from "swr";

import { axiosClient } from "../api_config";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";

import { IApartmentRequest, IApartmentResponse } from "./IApartment";

const url = "Apartment";

const apartmentApi = {
  mutateKey: url,
  useGet(params: ISearchOptions) {
    return useSWR([url, params], async ([route, p]) => {
      return axiosClient.get<any, IListData<IApartmentResponse>>(route, {
        params: p,
      });
    });
  },

  getById(id: number) {
    return axiosClient.get<any, ISingleData<IApartmentResponse>>(
      `${url}/${id}`
    );
  },
  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<IApartmentResponse>>(url, { params });
  },
  add(data: IApartmentRequest) {
    return axiosClient.post<any, ISingleData<IApartmentResponse>>(url, data);
  },
  update(data: IApartmentRequest) {
    return axiosClient.put(`${url}/${data.Id}`, data);
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },
};
export default apartmentApi;
