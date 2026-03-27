"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import useSWR from "swr";
import { ETransStatus } from "@/components/features/property/types/enum";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { reportRoutes } from "@/constants/routes/report-routes";
import { ETransType } from "@/lib/core/enum";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "@/services/api/api_config";
import { EGroupType } from "../types/enum";
import type { IReportQuery } from "../types/report-query";
import type { IReportResponse } from "../types/report-response";

const chartConfig = {
  sell: {
    label: "Mua bán",
    color: "var(--chart-1)",
  },
  rent: {
    label: "Cho thuê",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type Props = {
  query: IReportQuery;
};
const PropNewChart = React.memo(({ query }: Props) => {
  const { data: propSellSummary } = useSWR(
    `${reportRoutes.getPropSummary}?${objToQueryString({
      ...query,
      Status: ETransStatus.DangBan,
      TransType: ETransType.sell,
    })}`,
    (route) => axiosClient.get<any, IApiResponse<IReportResponse[]>>(route),
    { revalidateOnFocus: false }
  );

  const { data: propRentSummary } = useSWR(
    `${reportRoutes.getPropSummary}?${objToQueryString({
      ...query,
      Status: ETransStatus.DangBan,
      TransType: ETransType.rent,
    })}`,
    (route) => axiosClient.get<any, IApiResponse<IReportResponse[]>>(route),
    { revalidateOnFocus: false }
  );

  const chartData = propSellSummary?.data?.map((item) => ({
    month:
      query.GroupType === EGroupType.MONTH
        ? `Tháng ${item.GroupKey}`
        : `Ngày ${item.GroupKey}`,
    sell: item.Value,
    rent: propRentSummary?.data?.find((i) => i.GroupKey === item.GroupKey)
      ?.Value,
  }));

  return (
    <ChartContainer config={chartConfig} className="max-h-[350px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        {/* <YAxis tickLine={false} axisLine={false} /> */}
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />

        <Bar dataKey="sell" fill="var(--color-sell)" radius={4} />
        <Bar dataKey="rent" fill="var(--color-rent)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
});

export default PropNewChart;
