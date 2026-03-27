export enum EPremission {
  admin = 'Toàn quyền',
  manage_user = 'Quản lý nhân viên',
  manage_role = 'Quản lý vai trò',
  manage_address = 'Quản lý đường xá',
}

export enum ETransType {
  sell = 1,
  rent,
}

export enum EUserAdminStatus {
  active = 'Hoạt động',
  block = 'Khoá',
}

export enum ETableName {
  Property,
  Customer,
  User,
  ParcelLand,
  Feed,
  ApartmentUnit,
  UserWebsiteAcc,
  Apartment,
  News,
  Address,
  Document,
  Notification,
}
