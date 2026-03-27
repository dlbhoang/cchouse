import { Users2 } from "lucide-react";
import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { userRoutes } from "@/constants/routes/user-routes";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import type { IUserAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { axiosClient } from "@/services/api/api_config";

const EmployeeStatistic = () => {
  const query: IUserAdminOpts = {
    Status: 1, //active
    pageSize: 1000,
    pageIndex: 1,
  };

  const { data } = useSWR(
    `${userRoutes.count}?${objToQueryString(query)}`,
    (route) => axiosClient.get<any, IApiResponse<number>>(route),
    { revalidateOnFocus: false }
  );

  return (
    <Card className="p-6 hover:shadow-md transition-shadow border-gray-200">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Users2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-lg">Nhân sự</h3>
          <p className="text-md text-muted-foreground">
            <b>{data?.data?.toString() || "0"}</b> nhân viên đang hoạt động
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeStatistic;
