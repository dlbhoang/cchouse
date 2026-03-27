import useSWR from "swr";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type {
  IListData,
  ISingleData,
} from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "@/services/api/api_config";
import type {
  IApproveTransferRequest,
  IPropTransferOpts,
  IPropTransferRequest,
  IPropTransferResponse,
} from "./models/prop-transfer";

const url = "PropTransfer";

const propTransferApi = {
	mutateKey: url,
	useGet(params: IPropTransferOpts) {
		console.log("useGet", params);
		const key = params ? `${url}?${objToQueryString(params)}` : url;

		return useSWR(key, async (route) => {
			return axiosClient.get<any, IListData<IPropTransferResponse>>(route);
		});
	},

	useCount(params: IPropTransferOpts) {
		const key = params ? `${url}/Count?${objToQueryString(params)}` : url;

		return useSWR(key, async (route) => {
			return axiosClient.get<any, ISingleData<number>>(route);
		});
	},

	getById(id: number) {
		return axiosClient.get(`${url}/${id}`);
	},
	get(params: IPropTransferOpts) {
		return axiosClient.get<any, IListData<IPropTransferResponse>>(url, {
			params,
		});
	},
	add(data: IPropTransferRequest) {
		return axiosClient.post<any, ISingleData<IPropTransferResponse>>(url, data);
	},
	update(data: IPropTransferRequest) {
		return axiosClient.put(`${url}/${data.Id}`, data);
	},

	approve(model: IApproveTransferRequest) {
		return axiosClient.put(`${url}/${model.Id}/ApproveTransfer`, model);
	},
};
export default propTransferApi;
