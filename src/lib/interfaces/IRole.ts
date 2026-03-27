export interface IRoleRequest {
  Id: number;
  Code: string;
  Name: string;
  Color: string;
  Permission: number;
}

export interface IRoleResponse extends IRoleRequest {
  NumberOfUsers: number;
  CreatedBy: string;
  CreatedDate: string;
}

export interface ISysPermission {
  Value: number;
  AllowDeleteKey: number | null;
  Name: string;
  Describe: string;
}
