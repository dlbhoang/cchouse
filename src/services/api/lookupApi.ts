import { axiosClient } from "./api_config";
import { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import { IUserAdminPublic } from "./userAdmin/IUserAdmin";
import type { WardAgencyData } from "@/data/ward-agencies";

const url = "Lookup";
const lookupApi = {
  getUserAdmin() {
    return axiosClient.get<any, IApiResponse<IUserAdminPublic[]>>(
      `${url}/user-admin`
    );
  },
  getWardAgencies() {
    return axiosClient.get<any, IApiResponse<WardAgencyData[]>>(
      `${url}/ward-agencies`
    );
  },
  saveWardAgencies(wardId: number, data: WardAgencyData) {
    return axiosClient.put(`${url}/ward-agencies/${wardId}`, data);
  },
  resetWardAgencies(wardId: number) {
    return axiosClient.delete(`${url}/ward-agencies/${wardId}`);
  },
};
export default lookupApi;
