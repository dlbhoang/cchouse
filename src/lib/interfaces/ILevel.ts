export interface ILevelRequest {
  id: number;
  code: string;
  name: string;
  commission: number;
  baseSalary: number;
  insurrance: string[];
}

export interface ILevelResponse extends ILevelRequest {
  createdBy: string;
  createdDate: string;
}
