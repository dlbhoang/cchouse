import useSWR from "swr";

import { axiosClient } from "../api_config";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import {
  IPropTypeRequest,
  IPropTypeResponse,
} from "@/lib/interfaces/Property/IPropType";

const url = "PropType";

const propTypeApi = {
  mutateKey: url,
  useGet(params: ISearchOptions) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IPropTypeResponse>>(route, {
        params,
      });
    });
  },

  getById(id: number) {
    return axiosClient.get(`${url}/${id}`);
  },
  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<IPropTypeResponse>>(url, { params });
  },
  add(data: IPropTypeRequest) {
    return axiosClient.post<any, ISingleData<IPropTypeResponse>>(url, data);
  },
  update(data: IPropTypeRequest) {
    return axiosClient.put(`${url}/${data.Id}`, data);
  },
  toggleActive(id: number) {
    return axiosClient.put<any, ISingleData<IPropTypeResponse>>(
      `${url}/${id}/ToggleActive`
    );
  },

  upload(data: any) {
    return axiosClient.post(`${url}/upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
export default propTypeApi;
