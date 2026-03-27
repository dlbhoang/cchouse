"use client";
import { Card } from "antd";
import { useState } from "react";

import ActivityFilter from "@/lib/components/admin/activity/filter";
import { ActivityTable } from "@/lib/components/admin/activity/table";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import type { IHistoryOpts } from "@/services/api/history/IHistory";

const ActivityPage = () => {
  const [searchOptions, setSearchOptions] = useState<IHistoryOpts>({
    ...baseFilter,
    TableName: "tblProp",
  });

  const handleFilter = (values: IHistoryOpts) => {
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
      <ActivityFilter onSubmit={handleFilter} model={searchOptions} />
      <TitlePage title={AppRoutes.activity.name} />
      <ActivityTable
        searchOptions={searchOptions}
        onPageIndexChange={handlePageIndexChange}
      />
    </Card>
  );
};

export default ActivityPage;
