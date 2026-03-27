"use client";
/* eslint-disable no-self-compare */
// import type { DatePickerProps } from 'antd';
import { Card } from "antd";
import { usePathname, useRouter } from "next/navigation";

import ApartmentUnitFilter from "@/lib/components/admin/apartment-unit/filter";
import { ApartmentUnitTable } from "@/lib/components/admin/apartment-unit/table";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IApartmentUnitOpts } from "@/services/api/apartment/unit/IApartmentUnit";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const ApartmentUnitPage = ({ searchParams }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const TransType = Number(searchParams?.TransType) || ETransType.sell;
  const opts = {
    ...searchParams,
    TransType,
    ProvinceId: 1,
  } as any as IApartmentUnitOpts;

  const handleFilter = (values: IApartmentUnitOpts) => {
    router.push(`${pathname}?${objToQueryString(values)}`);
  };

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({
        ...opts,
        pageIndex,
        pageSize,
      })}`
    );
  };

  return (
    opts && (
      <Card>
        <ApartmentUnitFilter onSubmit={handleFilter} model={opts} />
        <TitlePage
          title={
            Number(TransType) === ETransType.sell
              ? `${AppRoutes.apartmentUnit.name} bán`
              : `${AppRoutes.apartmentUnit.name} thuê`
          }
        />
        <ApartmentUnitTable
          opts={opts}
          onPageIndexChange={handlePageIndexChange}
        />
      </Card>
    )
  );
};

export default ApartmentUnitPage;
