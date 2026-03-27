import { axiosClient } from '@/services/api/api_config';
import { IRegisterAdmin } from '@/services/api/userAdmin/IUserAdmin';
import type { IChangePassword } from '@/services/user-admin/models/change-password';

const url = 'AdminAuth';
const authApi = {
  resetPassword(id: number) {
    return axiosClient.put(`${url}/ResetPassword/${id}`);
  },
  changePassword(data: IChangePassword) {
    return axiosClient.post(`${url}/ChangePassword`, data);
  },
  register(data: IRegisterAdmin) {
    return axiosClient.post(`${url}/Register`, data);
  },
};
export default authApi;
