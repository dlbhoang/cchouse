import { IFileUploadResponse } from '../imagesApi';

export interface IImageCloud {
  Name: string;
  Thumbnail: string;
  ContentLength: number;
  ContentType: string;
  CreatedOn: string;
  FileRef: IFileUploadResponse | null;
}
