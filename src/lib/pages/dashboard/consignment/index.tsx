"use client";
import { Card, Input } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IBaseOpts } from "@/services/api/base";
import consignmentApi from "@/services/api/consignment/consignmentApi";
import ConsignmentTable from "./table";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const ConsignmentPage = ({ searchParams }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const opts = {
    ...baseFilter,
    ...searchParams,
  } as IBaseOpts;

  const { data, isLoading, mutate } = consignmentApi.useGet(opts);

  const onSearchChange = (values: IBaseOpts) => {
    console.log("filter ", values);
    router.push(`${pathname}?${objToQueryString(values)}`);
  };

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
      <TitlePage title={AppRoutes.consignment.name} />
      <span>
        Tìm được <b>{data?.totalRow ?? 0}</b> kết quả
      </span>
      <ConsignmentTable
        data={data?.data ?? []}
        totalRow={data?.totalRow ?? 0}
        opts={opts}
      />
    </Card>
  );
};

export default ConsignmentPage;
