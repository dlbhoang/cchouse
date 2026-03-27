const base = 'Me';

export const meRoutes = {
  base,
  changePassword: `${base}/ChangePassword`,
  managedUsers: `${base}/managed-users`,
} as const;
