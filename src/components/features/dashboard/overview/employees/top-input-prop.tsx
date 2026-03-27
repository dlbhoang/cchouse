import { Empty, Radio, Spin } from "antd";
import { useState } from "react";
import useSWR from "swr";
import type { IEmployeeReportQuery } from "@/components/features/dashboard/overview/types/report-query";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { reportRoutes } from "@/constants/routes/report-routes";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "@/services/api/api_config";
import type { IReportResponse } from "../types/report-response";

const TopInputProp = ({ query }: { query: IEmployeeReportQuery }) => {
  const [roleFilter, setRoleFilter] = useState<number>(3);
  const { data: top10InputProp, isLoading } = useSWR(
    `${reportRoutes.getTopUserInputProps}?${objToQueryString({
      ...query,
      Roles: roleFilter === 1 ? undefined : [roleFilter],
    })}`,
    (route) => axiosClient.get<any, IApiResponse<IReportResponse[]>>(route),
    { revalidateOnFocus: false }
  );

  const maxValue =
    top10InputProp?.data?.reduce((max, item) => Math.max(max, item.Value), 0) ??
    0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiệu suất Nhân viên</CardTitle>
        <CardDescription>
          Nhân viên nhập bất động sản nhiều nhất
        </CardDescription>
        <Radio.Group
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={[
            { value: 1, label: "Tất cả" },
            { value: 3, label: "Nhân viên kinh doanh" },
          ]}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Spin />
            </div>
          ) : (top10InputProp?.data?.length ?? 0) > 0 ? (
            top10InputProp?.data?.map((staff, index) => (
              <div
                key={`${staff.GroupKey}-${index}`}
                className="flex items-center gap-3"
              >
                <Badge
                  variant="secondary"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                >
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">
                      {staff.GroupKey}
                    </span>
                    <span className="text-sm text-gray-600">{staff.Value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(staff.Value / maxValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <Empty description="Không có dữ liệu" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopInputProp;
