import useSWR from "swr";

import type { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import type {
  IListData,
  ISingleData,
} from "@/lib/interfaces/base/IResponseBase";
import type { IFeedFilter } from "@/lib/interfaces/filter/ISearchOptions";
import type { IFeedRequest, IFeedResponse } from "@/services/api/feed/IFeed";

import { axiosClient } from "../api_config";

const url = "FeedAdmin";

const feedWebsite = {
	mutateWebsiteKey: `${url}/FeedWebsite`,
	useGetFeedWebsite(params: IFeedFilter) {
		return useSWR(`${url}/FeedWebsite`, async (route) => {
			return axiosClient.get<any, IListData<IFeedResponse>>(route, { params });
		});
	},
	countStatusWebsite(params: IFeedFilter) {
		return axiosClient.get<any, IListData<ICountItem>>(
			`${url}/CountStatusWebsite`,
			{
				params: { ...params, Status: undefined },
			},
		);
	},
};

const feedApi = {
	...feedWebsite,

	mutateKey: url,
	useGet(query: string) {
		return useSWR(`${url}?${query}`, async (route) => {
			return axiosClient.get<any, IListData<IFeedResponse>>(route);
		});
	},
	get(params: IFeedFilter) {
		return axiosClient.get<any, IListData<IFeedResponse>>(url, { params });
	},
	countStatus(params: IFeedFilter) {
		return axiosClient.get<any, IListData<ICountItem>>(`${url}/CountStatus`, {
			params: { ...params, Status: undefined },
		});
	},
	toFeedResponse(data: IFeedRequest) {
		return axiosClient.post<any, ISingleData<IFeedResponse>>(
			`${url}/ToFeedResponse`,
			data,
		);
	},

	getById(id: number) {
		return axiosClient.get<any, ISingleData<IFeedResponse>>(`${url}/${id}`);
	},
	getByPropId(id: number) {
		return axiosClient.get<any, ISingleData<IFeedResponse>>(
			`${url}/GetByPropId/${id}`,
		);
	},
	getByApartmentUnit(id: number) {
		return axiosClient.get<any, ISingleData<IFeedResponse>>(
			`${url}/GetByApartmentUnit/${id}`,
		);
	},
	add(data: IFeedRequest) {
		return axiosClient.post<any, ISingleData<IFeedResponse>>(url, data);
	},
	update(data: IFeedRequest) {
		return axiosClient.put<any, ISingleData<IFeedResponse>>(
			`${url}/${data.Id}`,
			data,
		);
	},
	delete(id: number) {
		return axiosClient.delete<any, ISingleData<IFeedResponse>>(`${url}/${id}`);
	},
	changeStatus(data: { Id: number; Status: number; ReasonDeny?: string }) {
		return axiosClient.put(`${url}/${data.Id}/ChangeStatus`, data);
	},
	hidden(id: number) {
		return axiosClient.put(`${url}/${id}/Hidden`);
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
export default feedApi;
