import useSWR from "swr";

import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { axiosClient } from "../api_config";
import { IConsignmentResponse } from "./IConsignment";

const url = "Consignment";
const consignmentApi = {
  mutateKey: url,
  useGet(params: ISearchOptions) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IConsignmentResponse>>(route, {
        params,
      });
    });
  },
  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<IConsignmentResponse>>(url, {
      params,
    });
  },
  countStatus(params?: ISearchOptions) {
    return axiosClient.get<any, IListData<ICountItem>>(`${url}/CountStatus`, {
      params,
    });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IConsignmentResponse>>(
      `${url}/${id}`
    );
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },
};
export default consignmentApi;
