"use client";
import { Card } from "antd";
import { usePathname, useRouter } from "next/navigation";

import CustomerFilter from "@/lib/components/admin/customer/filter";
import { CustomerTable } from "@/lib/components/admin/customer/table";
import { ETransType } from "@/lib/core/enum";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { ICustomerOpts } from "@/lib/interfaces/filter/ISearchOptions";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const CustomerPage = ({ searchParams }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const TransType = Number(searchParams?.TransType) || ETransType.sell;
  const opts = { ...searchParams, TransType } as any as ICustomerOpts;

  const handleFilter = (values: ICustomerOpts) => {
    console.log("filter ", values);
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
    <Card>
      <CustomerFilter model={opts} onSubmit={handleFilter} />

      <CustomerTable
        searchOptions={opts}
        onPageIndexChange={handlePageIndexChange}
      />
    </Card>
  );
};

export default CustomerPage;
