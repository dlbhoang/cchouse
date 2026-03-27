import useSWR from "swr";

import { axiosClient } from "../api_config";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";

import { IDocumentRequest, IDocumentResponse } from "./IDocument";

const url = "Document";

const documentApi = {
  mutateKey: url,
  useGet(params: ISearchOptions) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IDocumentResponse>>(route, {
        params,
      });
    });
  },

  getById(id: number) {
    return axiosClient.get<any, ISingleData<IDocumentResponse>>(`${url}/${id}`);
  },
  get(params: ISearchOptions) {
    return axiosClient.get<any, IListData<IDocumentResponse>>(url, {
      params,
    });
  },
  add(data: IDocumentRequest) {
    return axiosClient.post<any, ISingleData<IDocumentResponse>>(url, data);
  },
  update(data: IDocumentRequest) {
    return axiosClient.put(`${url}/${data.Id}`, data);
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
export default documentApi;
