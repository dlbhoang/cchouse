import useSWR from "swr";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import type {
  IPropTransferOpts,
  IPropTransferRequest,
  IPropTransferResponse,
} from "@/services/property/models/prop-transfer";
import type { IChangePassword } from "@/services/user-admin/models/change-password";
import type { IApartmentUnitResponse } from "./apartment/unit/IApartmentUnit";
import { axiosClient } from "./api_config";
import type { ICustomerResponse } from "./customer/ICustomer";

const url = "Me";

const saveApartmentUnitApi = {
	toggleSaveApartmentUnit(id: number) {
		return axiosClient.put(`${url}/ToggleSaveApartmentUnit/${id}`);
	},
	mutateSaveApartmentUnitKey: `${url}/GetSaveApartmentUnits`,

	useGetSaveApartmentUnits() {
		return useSWR(`${url}/GetSaveApartmentUnits`, async () =>
			axiosClient.get<any, IApiResponse<IApartmentUnitResponse[]>>(
				`${url}/GetSaveApartmentUnits`,
			),
		);
	},
};

const saveCustomerApi = {
	toggleSaveCustomer(id: number) {
		return axiosClient.put(`${url}/ToggleSaveCustomer/${id}`);
	},

	mutateSaveCustomersKey: `${url}/SaveCustomers`,

	useGetSaveCustomers() {
		return useSWR(`${url}/SaveCustomers`, async () =>
			axiosClient.get<any, IApiResponse<ICustomerResponse[]>>(
				`${url}/SaveCustomers`,
			),
		);
	},
};

const propTransferApi = {
	useGetPropTransfer(params: IPropTransferOpts) {
		const key = params
			? `${url}/PropTransfer?${objToQueryString(params)}`
			: `${url}/PropTransfer`;

		return useSWR(key, async (route) => {
			return axiosClient.get<any, IApiResponse<IPropTransferResponse[]>>(route);
		});
	},

	useCountPropTransfer(params: IPropTransferOpts) {
		const key = params
			? `${url}/PropTransfer/Count?${objToQueryString(params)}`
			: `${url}/PropTransfer/Count`;
		return useSWR(key, async (route) => {
			return axiosClient.get<any, IApiResponse<number>>(route);
		});
	},

	addPropTransfer(data: IPropTransferRequest) {
		return axiosClient.post(`${url}/PropTransfer`, data);
	},
};

const meApi = {
	changePassword(data: IChangePassword) {
		return axiosClient.put(`${url}/ChangePassword`, data);
	},

	...saveApartmentUnitApi,
	...saveCustomerApi,
	...propTransferApi,
};
export default meApi;
