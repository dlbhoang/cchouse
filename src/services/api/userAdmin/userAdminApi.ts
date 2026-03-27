import useSWR from "swr";

import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import {
  ISearchOptions,
  IUserAdminOpts,
} from "@/lib/interfaces/filter/ISearchOptions";
import { FormatDateSubmit } from "../../../lib/core/utils/myFormat";
import { axiosClient } from "../api_config";

import { INotiUserResponse } from "../notifications/INoti";
import {
  IUserAdminPublic,
  IUserAdminQU,
  IUserAdminRequest,
  IUserAdminResponse,
} from "./IUserAdmin";

const url = "UserAdmin";

const notiRoutes = {
  useGetNotifications(params: ISearchOptions) {
    const key = params
      ? `${url}/Notifications?${new URLSearchParams(
          params as unknown as Record<string, string>
        ).toString()}`
      : `${url}/Notifications`;
    return useSWR(key, async (route) => {
      return axiosClient.get<any, IListData<INotiUserResponse>>(
        `${url}/Notifications`,
        {
          params,
        }
      );
    });
  },

  countUnReadKey: `${url}/CountUnReadNoti`,
  useCountUnReadNoti() {
    return useSWR(`${url}/CountUnReadNoti`, async (route) => {
      return axiosClient.get<any, ISingleData<number>>(route);
    });
  },
};

const userAdminApi = {
  ...notiRoutes,
  active(data: IUserAdminRequest) {
    return axiosClient.put<any, ISingleData<IUserAdminResponse>>(
      `${url}/${data.Id}/Active`,
      data
    );
  },

  mutateKey: url,
  useGet(params: IUserAdminOpts) {
    return useSWR(url, async (route) =>
      axiosClient.get<any, IListData<IUserAdminResponse>>(route, {
        params,
      })
    );
  },

  getUserAdminPublic(managerOnly: boolean) {
    return axiosClient.get<any, IListData<IUserAdminPublic>>(
      `${url}/GetUserAdminPublic`,
      { params: { managerOnly } }
    );
  },
  countStatus(params?: IUserAdminOpts) {
    return axiosClient.get<any, IListData<ICountItem>>(`${url}/CountStatus`, {
      params: { ...params, Status: undefined },
    });
  },

  get(params: IUserAdminOpts) {
    return axiosClient.get<any, IListData<IUserAdminResponse>>(url, {
      params,
    });
  },
  count(params: ISearchOptions) {
    return axiosClient.get(`${url}/count`, { params });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IUserAdminResponse>>(
      `${url}/${id}`
    );
  },
  add(data: IUserAdminRequest) {
    return axiosClient.post<any, ISingleData<IUserAdminResponse>>(url, {
      ...data,
      DateOfBirth: FormatDateSubmit(data.DateOfBirth?.toString()),
      UserAccess: {
        ...data.UserAccess,
        DateStart: FormatDateSubmit(data.UserAccess?.DateStart?.toString()),
      },
    } as IUserAdminRequest);
  },
  update(data: IUserAdminRequest) {
    return axiosClient.put<any, ISingleData<IUserAdminResponse>>(
      `${url}/${data.Id}`,
      {
        ...data,
        DateOfBirth: FormatDateSubmit(data.DateOfBirth?.toString()),
        UserAccess: {
          ...data.UserAccess,
          DateStart: FormatDateSubmit(data.UserAccess?.DateStart?.toString()),
        },
      } as IUserAdminRequest
    );
  },

  // fullUpdate(data: {
  //   UserAdminRequest: IUserAdminRequest;
  //   UserAccessRequest: IUserAccessRequest;
  // }) {
  //   return axiosClient.put<any, ISingleData<IUserAdminResponse>>(
  //     `${url}/${data.UserAdminRequest.Id}/FullUpdate`,
  //     data
  //   );
  // },
  quickUpdate(data: IUserAdminQU) {
    return axiosClient.put<any, ISingleData<IUserAdminResponse>>(
      `${url}/${data.Id}/QuickUpdate`,
      data
    );
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },

  toggleSaveProp(id: number) {
    return axiosClient.put(`${url}/ToggleSaveProp/${id}`);
  },

  mutateSavePropsKey: `${url}/SaveProps`,

  useGetSaveProps(id: number) {
    return useSWR(`${url}/SaveProps`, async () =>
      axiosClient.get<any, IListData<IPropResponse>>(`${url}/${id}/SaveProps`)
    );
  },
};
export default userAdminApi;
