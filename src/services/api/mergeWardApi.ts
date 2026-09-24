import { IListData } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "./api_config";

export type IMergeWard = {
  Id: number;
  OldWardId: number;
  OldWardName: string;
  OldDistrictId: number;
  OldDistrictName: string;
  NewWardId: number;
  NewWardName: string;
  NewDistrictId: number;
  NewDistrictName: string;
  Description: string;
};

export type IMergeWardRequest = { OldWardId: number; NewWardId: number; Description: string };
const url = "MergeWard";

const mergeWardApi = {
  get() {
    return axiosClient.get<any, IListData<IMergeWard>>(url, { params: { pageIndex: 1, pageSize: 10000 } });
  },
  add(data: IMergeWardRequest) {
    return axiosClient.post(url, data);
  },
  update(id: number, data: Pick<IMergeWardRequest, "NewWardId" | "Description">) {
    return axiosClient.put(`${url}/${id}`, { Id: id, ...data });
  },
  delete(id: number) {
    return axiosClient.delete(`${url}/${id}`);
  },
};

export default mergeWardApi;
