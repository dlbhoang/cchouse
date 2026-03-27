import { IListData } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "../api_config";
import { IBaseOpts } from "../base";
import { IImageCloud } from "./model";

const url = "ImageCloud";
const imageCloudApi = {
  get(params: IBaseOpts) {
    return axiosClient.get<any, IListData<IImageCloud>>(`${url}`, {
      params,
    });
  },

  download(blobName: string) {
    return axiosClient.get(`${url}/download?blobName=${blobName}`);
  },

  downloadMultiple(blobNames: string[]) {
    return axiosClient.post(`${url}/download-multiple`, blobNames);
  },
};
export default imageCloudApi;
