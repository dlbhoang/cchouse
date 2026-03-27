/* eslint-disable no-bitwise */
const CheckPermission = (
  rolePermission: number,
  permissionId: number | null
): boolean => {
  const adminPermission = 1 << 1;
  if ((rolePermission & adminPermission) === adminPermission) {
    return true;
  }
  if (permissionId) {
    const temp = 1 << permissionId;
    return (rolePermission & temp) === temp;
  }
  return false;
};
export default CheckPermission;
