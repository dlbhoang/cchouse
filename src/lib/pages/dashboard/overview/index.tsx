"use client";
import { useState } from "react";
import useSWR from "swr";
import EmployeeStatistic from "@/components/features/dashboard/overview/employees/employee-statistic";
import TopInputFeed from "@/components/features/dashboard/overview/employees/top-input-feed";
import TopInputProp from "@/components/features/dashboard/overview/employees/top-input-prop";
import FeedViewTable from "@/components/features/dashboard/overview/feed-views";
import MetricsOverview from "@/components/features/dashboard/overview/metrics";
import PropChart from "@/components/features/dashboard/overview/prop-chart";
import {
  ETimeFilter,
  ETimeFilterOptions,
  getEGroupTypeByETimeFilter,
} from "@/components/features/dashboard/overview/types/enum";
import type { IReportQuery } from "@/components/features/dashboard/overview/types/report-query";
import type { IReportResponse } from "@/components/features/dashboard/overview/types/report-response";
import { getTimeFilterDateRange } from "@/components/features/dashboard/overview/types/time-filter-utils";
import { ETransStatus } from "@/components/features/property/types/enum";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reportRoutes } from "@/constants/routes/report-routes";
import ActivityTree from "@/lib/components/shared/ActivityTree";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "@/services/api/api_config";

const page = () => {
  const [timeFilter, setTimeFilter] = useState<ETimeFilter>(ETimeFilter.WEEK);
  const { fromDate, toDate } = getTimeFilterDateRange(timeFilter);

  const query: IReportQuery = {
    FromDate: fromDate,
    ToDate: toDate,
    GroupType: getEGroupTypeByETimeFilter(timeFilter),
  };

  const { data: propSummary } = useSWR(
    `${reportRoutes.getPropSummary}?${objToQueryString({
      ...query,
      Status: ETransStatus.DangBan,
    })}`,
    (route) => axiosClient.get<any, IApiResponse<IReportResponse[]>>(route),
    { revalidateOnFocus: false }
  );

  const totalProp =
    propSummary?.data?.reduce((acc, curr) => acc + curr.Value, 0) ?? 0;

  const { data: feedSummary } = useSWR(
    `${reportRoutes.getFeedSummary}?${objToQueryString(query)}`,
    (route) => axiosClient.get<any, IApiResponse<IReportResponse[]>>(route),
    { revalidateOnFocus: false }
  );

  const totalFeed =
    feedSummary?.data?.reduce((acc, curr) => acc + curr.Value, 0) ?? 0;

  const { data: customerSummary } = useSWR(
    `${reportRoutes.getCustomerSummary}?${objToQueryString(query)}`,
    (route) => axiosClient.get<any, IApiResponse<IReportResponse[]>>(route),
    { revalidateOnFocus: false }
  );

  const totalCustomer =
    customerSummary?.data?.reduce((acc, curr) => acc + curr.Value, 0) ?? 0;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 sm:col-span-9 ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{AppRoutes.dashboard.name}</h1>
            <p className="text-muted-foreground mt-1">
              Tổng quan hoạt động kinh doanh
            </p>
          </div>
          <Select
            value={timeFilter}
            onValueChange={(value) => setTimeFilter(value as ETimeFilter)}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              {ETimeFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <MetricsOverview
            fromDate={fromDate}
            toDate={toDate}
            totalProp={totalProp}
            totalFeed={totalFeed}
            totalCustomer={totalCustomer}
          />
          <PropChart query={query} timeFilter={timeFilter} />
          <Card>
            <CardHeader>
              <CardTitle>Tin đăng</CardTitle>
              <CardDescription>Lượt xem tin đăng nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <FeedViewTable query={{ ...query, TakeValue: 10 }} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Employees Overview */}
      <div className="col-span-12 sm:col-span-3">
        <div className="flex flex-col space-y-4">
          <EmployeeStatistic />

          <TopInputProp query={{ ...query, TakeValue: 10 }} />
          <TopInputFeed query={{ ...query, TakeValue: 10 }} />

          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Lịch sử hoạt động của nhân viên</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <ActivityTree tableName="tblProp" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
