import { IListData, ISingleData } from "@/lib/interfaces/base/IResponseBase";
import { IEnumList } from "@/lib/interfaces/base/ISelectListBase";

import { axiosClient } from "./api_config";
import { IGeocode } from "./base/IGeocode";
import { ILogItem, ILogOpts } from "./base/ILogitem";
import { IConfig, ISuggestAddressDto } from "@/lib/interfaces/base/IBase";

const url = "Utils";
const utilsApi = {
  suggestAddress(input: string, type: "ward" | "street") {
    return axiosClient.get<any, IListData<ISuggestAddressDto>>(
      `${url}/suggest?search=${input}&type=${type}`
    );
  },

  getConfig() {
    return axiosClient.get<any, ISingleData<IConfig>>(`${url}/Config`);
  },
  putConfig(data: IConfig) {
    return axiosClient.put(`${url}`, data);
  },

  getLogs(params: ILogOpts) {
    return axiosClient.get<any, IListData<ILogItem>>(`${url}/Logs`, { params });
  },

  enumList() {
    return axiosClient.get<any, ISingleData<IEnumList>>(`${url}/EnumList`);
  },
  upload(data: FormData) {
    return axiosClient.post<any, IListData<string>>(`${url}/upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadNoAuth(data: FormData) {
    return axiosClient.post<any, IListData<string>>(
      `${url}/UploadNoAuth`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  video(data: FormData) {
    return axiosClient.post<any, IListData<string>>(`${url}/Video`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  geocode(address: string) {
    return axiosClient.get<any, ISingleData<IGeocode>>(`${url}/Geocode`, {
      params: { address },
    });
  },
};
export default utilsApi;
