import { axiosWebsite } from "../../api_website";
import { IListData } from "@/lib/interfaces/base/IResponseBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";

import { IStaff } from "./IStaff";

const url = "PublicInfo";

const publicInfoApi = {
  getStaff(params: ISearchOptions) {
    return axiosWebsite.get<any, IListData<IStaff>>(`${url}/Staff`, { params });
  },
};
export default publicInfoApi;
