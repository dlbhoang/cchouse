import { IBaseDto } from '../base';

export interface IDocumentRequest {
  Id?: number;
  DocumentTypeId: number;
  Name: string;
  Note: string;
  PdfFile?: string | any[];
  DocFile?: string | any[];
}
export interface IDocumentResponse extends IDocumentRequest, IBaseDto {}

export interface IDocumentTypeRequest {
  Id?: number;
  Name: string;
}

export interface IDocumentTypeResponse extends IDocumentTypeRequest, IBaseDto {
  Slug: string;
}
