import useSWR from "swr";

import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "../api_config";
import { IStatusOpts } from "../base";
import { IReportSpamResponse } from "./IReportSpam";

const url = "ReportSpam";
const reportSpamApi = {
  mutateKey: url,
  useGet(params: IStatusOpts) {
    return useSWR(url, async (route) => {
      return axiosClient.get<any, IListData<IReportSpamResponse>>(route, {
        params,
      });
    });
  },
  get(params: IStatusOpts) {
    return axiosClient.get<any, IListData<IReportSpamResponse>>(url, {
      params,
    });
  },

  countStatus(params?: IStatusOpts) {
    return axiosClient.get<any, IListData<ICountItem>>(`${url}/CountStatus`, {
      params,
    });
  },
  getById(id: number) {
    return axiosClient.get<any, ISingleData<IReportSpamResponse>>(
      `${url}/${id}`
    );
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },
};
export default reportSpamApi;
