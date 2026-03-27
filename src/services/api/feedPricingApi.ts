import useSWR from "swr";

import type {
  IListData,
  ISingleData,
} from "@/lib/interfaces/base/IResponseBase";
import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import type {
  IFeedPricingRequest,
  IFeedPricingResponse,
} from "@/services/api/feed/IFeedPricing";

import { axiosClient } from "./api_config";

const url = "FeedPricing";
const feedPricingApi = {
	useGet(params: ISearchOptions) {
		return useSWR(url, async (route) => {
			return axiosClient.get<any, IListData<IFeedPricingResponse>>(route, {
				params,
			});
		});
	},

	getById(id: number) {
		return axiosClient.get<any, ISingleData<IFeedPricingResponse>>(
			`${url}/${id}`,
		);
	},
	add(data: IFeedPricingRequest) {
		return axiosClient.post<any, ISingleData<IFeedPricingResponse>>(url, data);
	},
	update(data: IFeedPricingRequest) {
		return axiosClient.put<any, ISingleData<IFeedPricingResponse>>(
			`${url}/${data.Id}`,
			data,
		);
	},
	delete(id: number) {
		return axiosClient.delete<any, ISingleData<IFeedPricingResponse>>(
			`${url}/${id}`,
		);
	},
	toggleActive(id: number) {
		return axiosClient.put<any, ISingleData<IFeedPricingResponse>>(
			`${url}/${id}/ToggleActive`,
		);
	},
};
export default feedPricingApi;
