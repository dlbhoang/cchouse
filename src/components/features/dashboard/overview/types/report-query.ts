import type { ETransStatus } from "@/components/features/property/types/enum";
import type { ETransType } from "@/lib/core/enum";
import type { EGroupType } from "./enum";

export interface IReportQuery {
	FromDate?: string;
	GroupType?: EGroupType;
	ToDate?: string;
}

export interface IPropReportQuery extends IReportQuery {
	Status?: ETransStatus;
	TransType?: ETransType;
}

export interface IEmployeeReportQuery extends IReportQuery {
	Roles?: number[];
	TakeValue: number;
}

export interface IFeedReportQuery extends IReportQuery {
	TopIds?: number[];
	TakeValue: number;
}
