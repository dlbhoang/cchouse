'use client';
import { Card } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useRef } from 'react';

import CustomerFilter from '@/lib/components/admin/customer/filter';
import { CustomerTable, type CustomerTableHandle } from '@/lib/components/admin/customer/table';
import { ETransType } from '@/lib/core/enum';
import { AppRoutes } from '@/lib/core/configs/appRoutes';
import { objToQueryString } from '@/lib/core/utils/app-func';
import { ICustomerOpts } from '@/lib/interfaces/filter/ISearchOptions';
import { useAdminContext } from '@/lib/stored';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const CustomerPage = ({ searchParams }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const customerTableRef = useRef<CustomerTableHandle>(null);
  const { smallScreen } = useAdminContext();
  const TransType = Number(searchParams?.TransType) || ETransType.sell;
  const opts = useMemo(
    () => ({ ...searchParams, TransType }) as any as ICustomerOpts,
    [searchParams, TransType]
  );

  const handleFilter = (values: ICustomerOpts) => {
    console.log('filter ', values);
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
      <CustomerFilter
        model={opts}
        onSubmit={handleFilter}
        onCreateCustomer={() => customerTableRef.current?.createCustomer()}
        onOpenListings={() => router.push(AppRoutes.feed.url)}
        showDesktopCreateButton={!smallScreen}
      />

      <CustomerTable
        ref={customerTableRef}
        searchOptions={opts}
        onPageIndexChange={handlePageIndexChange}
      />
    </Card>
  );
};

export default CustomerPage;
