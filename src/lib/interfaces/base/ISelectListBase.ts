export interface ISelectListBase {
  text: string;
  value: number;
}

export interface IEnumItem {
  Value: number;
  Name: string;
}
export interface IEnumList {
  ApartmentUnitType: IEnumItem[];
  UserStatus: IEnumItem[];
  MobileNetwork: IEnumItem[];
  Structures: IEnumItem[];
  Errors: IEnumItem[];
  Root: IEnumItem[];
  StatusUsage: IEnumItem[];
  TransStatus: IEnumItem[];
  Law: IEnumItem[];
  StatusBase: IEnumItem[];
  CustomerType: IEnumItem[];
  PaymentMethod: IEnumItem[];
  Utilities: IEnumItem[];
  Equipments: IEnumItem[];
  Purpose: IEnumItem[];
  LocationFeature: IEnumItem[];
  Location: IEnumItem[];
  Literacy: IEnumItem[];
  Sex: IEnumItem[];
  Direction: IEnumItem[];
  SubAddresses: IEnumItem[];
  RequimentStatus: IEnumItem[];
  UsageLaw: IEnumItem[];

  UserWebsiteStatus: IEnumItem[];
  UserWebsiteType: IEnumItem[];
}
