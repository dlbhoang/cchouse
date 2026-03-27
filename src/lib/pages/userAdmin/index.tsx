"use client";
import { Card } from "antd";
import { useEffect, useState } from "react";

import UserAdminFilter from "@/lib/components/admin/userAdmin/form/filter";
import UserAdminTable from "@/lib/components/admin/userAdmin/table";
import { baseFilter } from "@/lib/core/configs/appConst";
import type { IUserAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";

const UserAdminPage = () => {
  const [searchOptions, setSearchOptions] = useState<IUserAdminOpts>({
    ...baseFilter,
    Status: 1,
  });

  const { data, isValidating, mutate } = userAdminApi.useGet(searchOptions);

  useEffect(
    () => {
      if (data !== undefined) mutate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchOptions]
  );
  const handleFilter = (values: IUserAdminOpts) => {
    console.log(values);

    setSearchOptions({
      ...values,
      pageIndex: 1,
    });
  };
  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    setSearchOptions({
      ...searchOptions,
      pageIndex,
      pageSize,
    });
  };
  return (
    <Card>
      <UserAdminFilter onSubmit={handleFilter} model={searchOptions} />

      <UserAdminTable
        loading={isValidating}
        total={data?.totalRow ?? 0}
        data={data?.data ?? []}
        searchOptions={searchOptions}
        onPageIndexChange={handlePageIndexChange}
        handleMutate={() => mutate()}
      />
    </Card>
  );
};

export default UserAdminPage;
