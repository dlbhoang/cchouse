import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import {
  IRoleRequest,
  IRoleResponse,
  ISysPermission,
} from "@/lib/interfaces/IRole";

import { axiosClient } from "./api_config";

const url = "Role";
const roleApi = {
  usePermission() {
    return useSWR(`${url}/permission`, async (route) => {
      const response = await axiosClient.get<any, IListData<ISysPermission>>(
        route
      );
      return response.data;
    });
  },

  useGet(params: ISearchOptions) {
    return useSWR(url, async (route) => {
      const response = await axiosClient.get<any, IListData<IRoleResponse>>(
        route,
        { params }
      );
      return response.data;
    });
  },

  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<IRoleResponse>>(url, { params });
  },
  count(params: ISearchOptions) {
    return axiosClient.get(`${url}/count`, { params });
  },
  getById(id: number) {
    return axiosClient.get(`${url}/${id}`);
  },
  add(data: IRoleRequest) {
    return axiosClient.post<any, ISingleData<IRoleResponse>>(url, data);
  },
  update(data: IRoleRequest) {
    return axiosClient.put<any, ISingleData<IRoleResponse>>(
      `${url}/${data.Id}`,
      data
    );
  },
  delete(id: number) {
    return axiosClient.delete<any, ISingleData<IRoleResponse>>(`${url}/${id}`);
  },
};
export default roleApi;
