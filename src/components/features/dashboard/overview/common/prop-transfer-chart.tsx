"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import useSWR from "swr";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { reportRoutes } from "@/constants/routes/report-routes";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "@/services/api/api_config";
import { EGroupType } from "../types/enum";
import type { IReportQuery } from "../types/report-query";
import type { IReportResponse } from "../types/report-response";

const chartConfig = {
  transferSuccess: {
    label: "Thành công",
    color: "var(--chart-1)",
  },
  transferFailed: {
    label: "Thất bại",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type Props = {
  query: IReportQuery;
};
const PropTransferChart = React.memo(({ query }: Props) => {
  const { data } = useSWR(
    `${reportRoutes.getPropTransferSummary}?${objToQueryString(query)}`,
    (route) => axiosClient.get<any, IApiResponse<IReportResponse[]>>(route),
    { revalidateOnFocus: false }
  );

  const chartData = data?.data?.map((item) => ({
    month:
      query.GroupType === EGroupType.MONTH
        ? `Tháng ${item.GroupKey}`
        : `Ngày ${item.GroupKey}`,
    transferSuccess: item.Value,
    transferFailed: 0,
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

        <Bar
          dataKey="transferSuccess"
          fill="var(--color-transferSuccess)"
          radius={4}
        />
        <Bar
          dataKey="transferFailed"
          fill="var(--color-transferFailed)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
});

export default PropTransferChart;
