import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { IRecruitmentOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { axiosClient } from "../api_config";

import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import {
  ICandidate,
  IRecruitmentRequest,
  IRecruitmentResponse,
} from "./IRecruitment";

const url = "Recruitment";
const recruitmentApi = {
  mutateKey: url,

  useGet(params: IRecruitmentOpts) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([key, value]) => value !== undefined)
    ).toString();

    return useSWR(`${url}?${query}`, async (route) => {
      return axiosClient.get<any, IListData<IRecruitmentResponse>>(route, {
        params,
      });
    });
  },
  get(params: IRecruitmentOpts) {
    return axiosClient.get<any, IListData<IRecruitmentResponse>>(url, {
      params,
    });
  },

  countStatus(params?: IRecruitmentOpts) {
    return axiosClient.get<any, IListData<ICountItem>>(`${url}/CountStatus`, {
      params,
    });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IRecruitmentResponse>>(
      `${url}/${id}`
    );
  },
  add(data: IRecruitmentRequest) {
    return axiosClient.post<any, ISingleData<IRecruitmentResponse>>(url, data);
  },
  update(data: IRecruitmentRequest) {
    return axiosClient.put<any, ISingleData<IRecruitmentResponse>>(
      `${url}/${data.Id}`,
      data
    );
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },

  getCandidates(id: number) {
    return axiosClient.get<any, IListData<ICandidate>>(
      `${url}/${id}/GetCandidates`
    );
  },

  markAsReadCandidate(id: number, candidateId: number) {
    return axiosClient.put(`${url}/${id}/MarkAsReadCandidate`, candidateId);
  },
};
export default recruitmentApi;
