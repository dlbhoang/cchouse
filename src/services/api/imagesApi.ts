import { ETableName } from "@/lib/core/enum";
import { IListData } from "@/lib/interfaces/base/IResponseBase";

import { axiosClient } from "./api_config";

export interface IFileUploadResponse {
  Id: number;
  TableName: number;
  ContentId: number;
  FileName: string;
  Folder: string;
  IsPublished: boolean;
  IsDeleted: boolean;
  Path: string;
  BlobName?: string;
  CreatedBy: string;
  CreatedDate: string;
  UpdatedBy: string;
  UpdatedDate: string;
}

const url = "Images";
const imagesApi = {
  uploadUrl: `${axiosClient.defaults.baseURL}/${url}/Upload`,
  uploadVideoUrl: `${axiosClient.defaults.baseURL}/${url}/Video`,

  get(params: {
    ContentId: number;
    TableName: ETableName;
    IsDeleted?: boolean;
    IsPublished?: boolean;
  }) {
    return axiosClient.get<any, IListData<IFileUploadResponse>>(`${url}`, {
      params,
    });
  },

  download(data: string[]) {
    return axiosClient.post(`${url}/Download`, data, {
      responseType: "blob", // important
    });
  },

  upload(data: FormData) {
    return axiosClient.post(`${url}/Upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
export default imagesApi;
