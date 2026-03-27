import useSWR from "swr";
import type { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import type {
  IListData,
  IMetaDto,
  ISingleData,
} from "@/lib/interfaces/base/IResponseBase";
import type {
  IPropAdminOpts,
  ISearchOptions,
} from "@/lib/interfaces/filter/ISearchOptions";
import type { IDuplicateAddress } from "@/lib/interfaces/Property/IDuplicateAddress";
import type { IPropAccess } from "@/services/property";
import type {
  IPropAdminMap,
  IPropCheckAddress,
  IPropQU,
  IPropRequest,
  IPropResponse,
} from "../../../lib/interfaces/Property/IProp";
import { axiosClient } from "../api_config";

const url = "Property";

const crud = {
	countOldProp(transType: number) {
		return axiosClient.get<any, IListData<IPropResponse>>(
			`${url}/CountOldProp/${transType}`,
		);
	},

	useGetCoordinates(params: IPropAdminOpts) {
		return useSWR(`${url}/GetCoordinates`, async (route) => {
			return axiosClient.get<any, IListData<IPropAdminMap>>(route, {
				params: { ...params, Status: params.Status?.toString() ?? 1 },
			});
		});
	},

	mutateKey: url,
	useGet(params: IPropAdminOpts) {
		return useSWR(url, async () => {
			return axiosClient.get<any, IListData<IPropResponse>>(url, {
				params: { ...params, Status: params.Status?.toString() ?? 1 },
			});
		});
	},

	useGetMeta(query: string) {
		return useSWR(`${url}/Meta?${query}`, async (route) => {
			return axiosClient.get<any, ISingleData<IMetaDto>>(route);
		});
	},

	getById(id: number) {
		return axiosClient.get<any, ISingleData<IPropResponse>>(`${url}/${id}`);
	},
	get(params: IPropAdminOpts) {
		return axiosClient.get<any, IListData<IPropResponse>>(url, {
			params: { ...params, Status: params.Status?.toString() ?? 1 },
		});
	},
	add(data: IPropRequest) {
		return axiosClient.post<any, ISingleData<IPropResponse>>(url, data);
	},
	update(data: IPropRequest) {
		return axiosClient.put(`${url}/${data.Id}`, data);
	},
	delete(id: number) {
		return axiosClient.delete(`${url}/${id}`);
	},
	upload(data: FormData) {
		return axiosClient.post(`${url}/upload`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},
	video(data: FormData) {
		return axiosClient.post(`${url}/video`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},
};

const propertyApi = {
	...crud,

	getCustomerLogo() {
		return axiosClient.get<any, IListData<string>>(`${url}/CustomerLogo`);
	},

	togglePublic(id: number) {
		return axiosClient.put(`${url}/${id}/TogglePublic`);
	},
	countStatus(params?: IPropAdminOpts) {
		return axiosClient.get<any, IListData<ICountItem>>(`${url}/CountStatus`, {
			params,
		});
	},

	chooseAddress(id: number) {
		return axiosClient.put(`${url}/ChooseAddress/${id}`);
	},

	useGetDuplicateAddress(params: ISearchOptions) {
		return useSWR(`${url}/DuplicateAddress`, async (route) => {
			return axiosClient.get<any, IListData<IDuplicateAddress>>(route, {
				params,
			});
		});
	},

	checkAddress(params: IPropAdminOpts) {
		return axiosClient.get<
			any,
			ISingleData<{
				Duplicate: IPropCheckAddress[];
				OppositeTransType: IPropCheckAddress[];
			}>
		>(`${url}/CheckAddress`, { params });
	},

	quickUpdate(data: IPropQU) {
		return axiosClient.put(`${url}/${data.Id}/QuickUpdate`, data);
	},

	// changeOwner(data: { id: number; userAdminId: number | string }) {
	//   return axiosClient.put(`${url}/${data.id}/ChangeOwner/${data.userAdminId}`);
	// },
	// changeStatus(data: { id: number; status: number; note?: string }) {
	//   return axiosClient.put(`${url}/${data.id}/ChangeStatus`, data);
	// },
	// changeNote(data: { Id: number; Note: string }) {
	//   return axiosClient.put(`${url}/${data.Id}/ChangeNote`, data);
	// },

	checkPropAccess(id: number) {
		return axiosClient.get<any, ISingleData<IPropAccess>>(
			`${url}/${id}/access-info`,
		);
	},
};
export default propertyApi;
