"use client";
import { BookUser, Edit, Home } from "lucide-react";
import StatisticCard from "../common/statistic-card";
import { AppRoutes } from "@/lib/core/configs/appRoutes";

type Props = {
  totalProp: number;
  totalFeed: number;
  totalCustomer: number;
  fromDate: string;
  toDate: string;
};

const MetricsOverview = ({
  totalProp,
  totalFeed,
  totalCustomer,
  fromDate,
  toDate,
}: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatisticCard
        icon={Home}
        trend="up"
        change="0%"
        value={totalProp.toString()}
        label="Bất động sản mới"
        href={`${AppRoutes.property.url}?FromDate=${fromDate}&ToDate=${toDate}`}
      />
      <StatisticCard
        icon={Edit}
        trend="up"
        change="0%"
        value={totalFeed.toString()}
        label="Tổng tin đăng mới"
        href={`${AppRoutes.feed.url}?FromDate=${fromDate}&ToDate=${toDate}`}
      />

      <StatisticCard
        icon={BookUser}
        trend="up"
        change="0%"
        value={totalCustomer.toString()}
        label="Khách hàng đăng ký mới"
        href={`${AppRoutes.userWebsite.url}?FromDate=${fromDate}&ToDate=${toDate}`}
      />
    </div>
  );
};

export default MetricsOverview;
