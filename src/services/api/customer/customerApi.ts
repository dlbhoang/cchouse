import useSWR from "swr";

import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ICustomerOpts } from "../../../lib/interfaces/filter/ISearchOptions";
import { axiosClient } from "../api_config";

import { ICustomerRequest, ICustomerResponse } from "./ICustomer";

const url = "Customer";

const customerApi = {
  mutateKey: url,
  useGet(params: ICustomerOpts) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<ICustomerResponse>>(route, {
        params,
      });
    });
  },
  getById(id: number) {
    return axiosClient.get(`${url}/${id}`);
  },
  get(params: ICustomerOpts) {
    return axiosClient.get<any, IListData<ICustomerResponse>>(url, { params });
  },
  add(data: ICustomerRequest) {
    return axiosClient.post<any, ISingleData<ICustomerResponse>>(url, data);
  },
  update(data: ICustomerRequest) {
    return axiosClient.put(`${url}/${data.Id}`, data);
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },

  toggleShare(id: number) {
    return axiosClient.put(`${url}/${id}/ToggleShare`);
  },

  countStatus(params?: ICustomerOpts) {
    return axiosClient.get<any, IListData<ICountItem>>(`${url}/CountStatus`, {
      params,
    });
  },

  updateRequirement(customerId: number, data: { Id: number; Note: string }) {
    return axiosClient.put(`${url}/${customerId}/UpdateRequirement`, data);
  },
};
export default customerApi;
