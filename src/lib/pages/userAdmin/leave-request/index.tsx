"use client";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";
import LeaveRequestCreate from "@/components/features/leave-request/create";
import FilterForm from "@/components/features/leave-request/filter";
import LeaveRequestTable from "@/components/features/leave-request/table";
import {
  type ILeaveQuery,
  leaveQuerySchema,
} from "@/components/features/leave-request/types/leave-query";
import type { ILeaveResponse } from "@/components/features/leave-request/types/leave-response";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { leaveRequestRoutes } from "@/constants/routes/leave-request-routes";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { parseQueryParams } from "@/lib/core/utils/query-parser";
import type { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "@/services/api/api_config";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const LeaveRequestPage = ({ searchParams }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Parse query params directly without maintaining separate state
  const options = useMemo(() => {
    const defaultOptions: ILeaveQuery = {
      pageIndex: 1,
      pageSize: 20,
    };

    return parseQueryParams(searchParams, leaveQuerySchema, defaultOptions);
  }, [searchParams]);

  const { data, isLoading } = useSWR(
    [leaveRequestRoutes.base, options],
    async ([route, params]) => {
      const queryString = objToQueryString(params);
      return axiosClient.get<any, IApiResponse<ILeaveResponse[]>>(
        `${route}?${queryString}`
      );
    },
    {
      revalidateOnFocus: false,
    }
  );

  const { data: totalCount } = useSWR(
    [leaveRequestRoutes.count, options],
    async ([route, params]) => {
      const queryString = objToQueryString(params);
      return axiosClient.get<any, IApiResponse<number>>(
        `${route}?${queryString}`
      );
    },
    {
      revalidateOnFocus: false,
    }
  );

  const handleFilter = (values: ILeaveQuery) => {
    console.log("🚀 ~ handleFilter ~ values:", values);

    router.push(`${pathname}?${objToQueryString({ ...values })}`);
  };

  return (
    <Card className="rounded-sm shadow-none gap-4">
      <CardHeader>
        <FilterForm onSubmit={handleFilter} opts={options} />
        <CardTitle>
          <h2 className="uppercase text-lg">Đơn xin nghỉ phép</h2>
        </CardTitle>
        <CardDescription>Tìm được {totalCount?.data} kết quả</CardDescription>
      </CardHeader>
      <CardContent>
        <LeaveRequestTable
          data={data?.data ?? []}
          isLoading={isLoading}
          totalCount={totalCount?.data ?? 0}
          opts={options}
          onPageIndexChange={(pageIndex, pageSize) => {
            handleFilter({ ...options, pageIndex, pageSize });
          }}
        />
      </CardContent>

      <LeaveRequestCreate isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <FloatBtn onClick={() => setIsOpen(true)} />
    </Card>
  );
};

export default LeaveRequestPage;
