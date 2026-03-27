export enum ELeaveRequestStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export const LeaveRequestStatusOptions = [
  { label: 'Chờ duyệt', value: ELeaveRequestStatus.Pending },
  { label: 'Đã duyệt', value: ELeaveRequestStatus.Approved },
  { label: 'Từ chối', value: ELeaveRequestStatus.Rejected },
];
