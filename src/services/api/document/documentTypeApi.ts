import useSWR from "swr";

import { axiosClient } from "../api_config";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";

import { IDocumentTypeRequest, IDocumentTypeResponse } from "./IDocument";

const url = "DocumentType";

const documentTypeApi = {
  mutateKey: url,
  useGet(params: ISearchOptions) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IDocumentTypeResponse>>(route, {
        params,
      });
    });
  },

  getById(id: number) {
    return axiosClient.get<any, ISingleData<IDocumentTypeResponse>>(
      `${url}/${id}`
    );
  },
  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<IDocumentTypeResponse>>(url, {
      params,
    });
  },
  add(data: IDocumentTypeRequest) {
    return axiosClient.post<any, ISingleData<IDocumentTypeResponse>>(url, data);
  },
  update(data: IDocumentTypeRequest) {
    return axiosClient.put(`${url}/${data.Id}`, data);
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },
};
export default documentTypeApi;
