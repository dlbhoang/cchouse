"use client";
import { Card, Input } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatusTabs from "@/lib/components/shared/status-tabs";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { useAdminContext } from "@/lib/stored";
import type { IStatusOpts } from "@/services/api/base";
import reportSpamApi from "@/services/api/reportSpam/reportSpamApi";
import ReportSpamList from "./list";
import ReportSpamTable from "./table";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const ReportSpamPage = ({ searchParams }: Props) => {
  const { smallScreen } = useAdminContext();
  const router = useRouter();
  const pathname = usePathname();
  const [countStatus, setCountStatus] = useState<ICountItem[]>([]);

  const opts = {
    ...baseFilter,
    ...searchParams,
  } as IStatusOpts;

  const { data, isLoading, mutate } = reportSpamApi.useGet(opts);

  const onSearchChange = (values: IStatusOpts) => {
    console.log("filter ", values);
    router.push(`${pathname}?${objToQueryString(values)}`);
  };

  useEffect(() => {
    const fetch = async () => {
      const result = await reportSpamApi.countStatus(opts);
      setCountStatus(result.data);
    };
    fetch();
  }, []);

  useEffect(() => {
    mutate();
  }, [opts]);

  return (
    <Card loading={isLoading}>
      <Input.Search
        style={{ width: 300, paddingBottom: 10 }}
        placeholder="Tìm theo mã tin, sdt, tên người báo xấu"
        onSearch={(value, _e, info) => {
          onSearchChange({ ...opts, search: value });
        }}
        allowClear
      />
      <TitlePage title={AppRoutes.reportSpam.name} />
      <StatusTabs
        counts={countStatus}
        onChange={(key) => {
          onSearchChange({ ...opts, Status: Number(key), pageIndex: 1 });
        }}
      />
      <span>
        Tìm được <b>{data?.totalRow ?? 0}</b> kết quả
      </span>
      {smallScreen ? (
        <ReportSpamList
          data={data?.data ?? []}
          totalRow={data?.totalRow ?? 0}
        />
      ) : (
        <ReportSpamTable
          data={data?.data ?? []}
          totalRow={data?.totalRow ?? 0}
          opts={opts}
        />
      )}
    </Card>
  );
};

export default ReportSpamPage;
