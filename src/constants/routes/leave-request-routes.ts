const base = 'LeaveRequest';

export const leaveRequestRoutes = {
  base,
  count: `${base}/Count`,
  countStatus: `${base}/CountStatus`,
  approve: (id: number) => `${base}/${id}/Approve`,
} as const;
