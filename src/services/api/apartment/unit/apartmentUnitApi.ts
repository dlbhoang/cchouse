import useSWR from "swr";

import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "../../api_config";

import { IQuickUpdate } from "../../base";
import { IFileUploadResponse } from "../../imagesApi";
import {
  IApartmentUnitOpts,
  IApartmentUnitRequest,
  IApartmentUnitResponse,
} from "./IApartmentUnit";

const url = "ApartmentUnit";

const apartmentUnitApi = {
  mutateKey: url,
  useGet(params: IApartmentUnitOpts) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IApartmentUnitResponse>>(route, {
        params: { ...params, Status: params.Status?.toString() ?? 1 },
      });
    });
  },

  getById(id: number) {
    return axiosClient.get<any, ISingleData<IApartmentUnitResponse>>(
      `${url}/${id}`
    );
  },
  get(params: IApartmentUnitOpts) {
    return axiosClient.get<any, IListData<IApartmentUnitResponse>>(url, {
      params,
    });
  },
  add(data: IApartmentUnitRequest) {
    return axiosClient.post<any, ISingleData<IApartmentUnitResponse>>(url, {
      ...data,
      UserAdminId: 1,
    });
  },
  update(data: IApartmentUnitRequest) {
    return axiosClient.put(`${url}/${data.Id}`, data);
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },

  checkExists(
    transType: number,
    apartmentId: number,
    code: string,
    id?: number
  ) {
    return axiosClient.post<any, ISingleData<IApartmentUnitResponse>>(
      `${url}/CheckExists`,
      {
        Id: id,
        TransType: transType,
        Code: code,
        ApartmentId: apartmentId,
      }
    );
  },

  images(
    unitId: number,
    params: {
      IsDeleted?: boolean;
      IsPublished?: boolean;
    }
  ) {
    return axiosClient.get<any, IListData<IFileUploadResponse>>(
      `${url}/${unitId}/images`,
      {
        params,
      }
    );
  },

  quickUpdate(data: IQuickUpdate) {
    return axiosClient.put(`${url}/${data.Id}/QuickUpdate`, data);
  },
};
export default apartmentUnitApi;
