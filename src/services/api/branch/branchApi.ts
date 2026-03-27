import useSWR from "swr";

import { axiosClient } from "../api_config";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";

import { IBranchRequest, IBranchResponse } from "./IBranch";

const url = "Branch";
const branchApi = {
  mutateKey: url,
  useGet(params: ISearchOptions) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IBranchResponse>>(route, {
        params,
      });
    });
  },
  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<IBranchResponse>>(url, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IBranchResponse>>(`${url}/${id}`);
  },
  add(data: IBranchRequest) {
    return axiosClient.post<any, ISingleData<IBranchResponse>>(url, data);
  },
  update(data: IBranchRequest) {
    return axiosClient.put<any, ISingleData<IBranchResponse>>(
      `${url}/${data.Id}`,
      data
    );
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },
  upload(data: FormData) {
    return axiosClient.post(`${url}/upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
export default branchApi;
