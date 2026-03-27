export interface IRETypeRequest {
  id: number;
  code: string;
  name: string;
  transTypes: string[];
  disabled: boolean;
}

export interface IRETypeResponse extends IRETypeRequest {
  createdBy: string;
  createdDate: string;
}
