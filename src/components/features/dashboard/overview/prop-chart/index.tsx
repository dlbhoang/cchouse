"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropNewChart from "../common/prop-new-chart";
import PropTradedChart from "../common/prop-traded-chart";
import PropTransferChart from "../common/prop-transfer-chart";
import { ETimeFilter, ETimeFilterLabel } from "../types/enum";
import { IReportQuery } from "../types/report-query";

type Props = {
  query: IReportQuery;
  timeFilter: ETimeFilter;
};

const PropChart = ({ query, timeFilter }: Props) => {
  const [tab, setTab] = useState<string>("new");

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Bất động sản</CardTitle>
            <CardDescription>
              Thống kê bất động sản theo{" "}
              {ETimeFilterLabel[timeFilter].toLowerCase()}
            </CardDescription>
          </div>
          <Tabs value={tab} onValueChange={(value) => setTab(value)}>
            <TabsList>
              <TabsTrigger value="new">Thêm mới</TabsTrigger>
              <TabsTrigger value="sold">Đã giao dịch</TabsTrigger>
              <TabsTrigger value="prop-transfer">
                Thay đổi người nhập
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {tab === "new" && <PropNewChart query={query} />}
        {tab === "prop-transfer" && <PropTransferChart query={query} />}
        {tab === "sold" && <PropTradedChart query={query} />}
      </CardContent>
    </Card>
  );
};

export default PropChart;
