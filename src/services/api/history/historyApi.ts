// import { IActivityOpts } from '../../lib/interfaces/filter/ISearchOptions';
// import { IListData } from '@/lib/interfaces/base/IResponseBase';
// import { IHistory } from '@/lib/interfaces/History/IHistory';

// import { axiosClient } from './api_config';

// const url = 'HistoryAdmin';
// const historyApi = {
//   get(params: {
//     instanceId: number;
//     TableName: string;
//     pageIndex: number;
//     noteOnly?: boolean;
//   }) {
//     return axiosClient.get<any, IListData<IHistory>>(`${url}`, { params });
//   },

//   getActivities(params: IActivityOpts) {
//     return axiosClient.get<any, IListData<IHistory>>(`${url}/GetActivity`, {
//       params,
//     });
//   },
// };
// export default historyApi;

import type { IListData } from "@/lib/interfaces/base/IResponseBase";
import type { IHistory, IHistoryOpts } from "@/services/api/history/IHistory";
import { axiosClient } from "../api_config";

const url = "History";
const historyApi = {
	get(params: IHistoryOpts) {
		return axiosClient.get<any, IListData<IHistory>>(`${url}`, { params });
	},

	// getOld(params: IHistoryOpts) {
	//     return axiosClient.get<any, IListData<IHistoryOld>>(`${url}/HistoryOld`, { params });
	// },
};
export default historyApi;
