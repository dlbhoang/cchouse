import { UploadFile } from 'antd/es/upload';

export interface IMyUploadFile extends UploadFile {
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
  blobName?: string;
}
