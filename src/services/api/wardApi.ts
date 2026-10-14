import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import {
  ISearchWardDto,
  IWardRequest,
  IWardResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import { IConfigAddressFilter } from "@/lib/interfaces/filter/ISearchOptions";

import { axiosClient } from "./api_config";

const url = "Ward";
export type IConvertOldAddressRequest = {
  OldWardId: number;
  OldDistrictId?: number;
  OldStreetId?: number;
  StreetName?: string;
  AddressNumber?: string;
};

export type IConvertOldAddressResponse = {
  AddressNumber: string;
  StreetName: string;
  OldWardId: number;
  OldWardName: string;
  OldDistrictId: number;
  OldDistrictName: string;
  NewWardId: number;
  NewWardName: string;
  NewDistrictId: number;
  NewDistrictName: string;
  ProvinceId: number;
  ProvinceName: string;
  IsMerged: boolean;
  IsAmbiguous: boolean;
  Candidates: Array<{
    WardId: number;
    WardName: string;
    DistrictId: number;
    DistrictName: string;
    Description: string;
  }>;
  OldFullAddress: string;
  NewFullAddress: string | null;
};

const wardApi = {
  useGet(params: IConfigAddressFilter) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IWardResponse>>(route, {
        params,
      });
    });
  },
  get(params: IConfigAddressFilter) {
    return axiosClient.get<any, IListData<IWardResponse>>(url, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IWardResponse>>(`${url}/${id}`);
  },
  add(data: IWardRequest) {
    return axiosClient.post<any, ISingleData<number>>(url, data);
  },
  update(data: IWardRequest) {
    return axiosClient.put<any, ISingleData<number>>(
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

  getMergedTo(oldWardId: number) {
    return axiosClient.get<any, ISingleData<ISearchWardDto>>(
      `${url}/${oldWardId}/MergedTo`
    );
  },

  convertOldAddress(params: IConvertOldAddressRequest) {
    return axiosClient.get<any, ISingleData<IConvertOldAddressResponse>>(
      `${url}/ConvertOldAddress`,
      { params }
    );
  },

};
export default wardApi;
