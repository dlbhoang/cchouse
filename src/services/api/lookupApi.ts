import { axiosClient } from "./api_config";
import { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import { IUserAdminPublic } from "./userAdmin/IUserAdmin";

const url = "Lookup";
const lookupApi = {
  getUserAdmin() {
    return axiosClient.get<any, IApiResponse<IUserAdminPublic[]>>(
      `${url}/user-admin`
    );
  },
};
export default lookupApi;
