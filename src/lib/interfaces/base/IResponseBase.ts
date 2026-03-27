interface IResponseBase {
  totalRow: number | undefined;
  message: string | undefined;
}

export interface ISingleData<T> extends IResponseBase {
  data: T;
}

export interface IListData<T> extends IResponseBase {
  data: T[];
}

export interface IMetaDto {
  Title: string | null;
}

export interface IApiResponse<T> {
  data: T;
  message: string;
  status: number;
  totalRow: number | null;
}
