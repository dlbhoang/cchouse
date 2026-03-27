import useSWR from "swr";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "../api_config";
import { IPropTemp, IPropTempOpts } from "./model";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";

const url = "PropTemp";

const propTempApi = {
  useGet(params: IPropTempOpts) {
    const queryString = objToQueryString(params);

    return useSWR(`${url}?${queryString}`, async (route) => {
      return axiosClient.get<any, IListData<IPropTemp>>(route);
    });
  },

  getById(id: number) {
    return axiosClient.get(`${url}/${id}`);
  },

  statisticKey: `${url}/statistics`,
  useStatistics() {
    return useSWR(`${url}/statistics`, async (route) => {
      return axiosClient.get<any, IListData<ICountItem>>(route);
    });
  },

  syncToProp(data?: IPropTempOpts) {
    return axiosClient.post(`${url}/SyncToProp`, data);
  },

  syncToPropById(id: number) {
    return axiosClient.put(`${url}/${id}/SyncToProp`);
  },

  getRelatedProp(id: number) {
    return axiosClient.get<
      any,
      ISingleData<{ propTemp: IPropTemp; prop: IPropResponse }>
    >(`${url}/${id}/relatedProp`);
  },
};
export default propTempApi;
