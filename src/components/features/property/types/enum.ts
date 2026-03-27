export enum ETransStatus {
  DangBan = 1,
  DaGiaoDich,
  TamNgung,
  ChoXoa = 7,
}

// mapping enum to label
export const ETransStatusLabel = {
  [ETransStatus.DangBan]: 'Đang bán',
  [ETransStatus.DaGiaoDich]: 'Đã giao dịch',
  [ETransStatus.TamNgung]: 'Tạm ngưng',
  [ETransStatus.ChoXoa]: 'Chờ xoá',
};
