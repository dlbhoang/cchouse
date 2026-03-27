"use client";
import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";

import FeedFilter from "@/lib/components/admin/feed/filter";
import FeedTable from "@/lib/components/admin/feed/table";
import { baseFilter } from "@/lib/core/configs/appConst";
import type { IFeedFilter } from "@/lib/interfaces/filter/ISearchOptions";
import feedApi from "@/services/api/feed/feedApi";

const FeedWebsitePage = () => {
  const [searchOptions, setSearchOptions] = useState<IFeedFilter>({
    ...baseFilter,
    Status: 0,
  } as IFeedFilter);

  const { data, isLoading, mutate } = feedApi.useGetFeedWebsite(searchOptions);

  useEffect(() => {
    if (data !== undefined) {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOptions]);
  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    setSearchOptions({
      ...searchOptions,
      pageIndex,
      pageSize,
    });
  };

  const handleFilter = (values: IFeedFilter) => {
    console.log(values);

    setSearchOptions({
      ...values,
      pageIndex: 1,
    });
  };

  return (
    <Card>
      <Row gutter={12}>
        <Col span={24}>
          <FeedFilter model={searchOptions} onSubmit={handleFilter} isWebsite />
        </Col>
        <Col span={24}>
          <FeedTable
            loading={isLoading}
            total={data?.totalRow ?? 0}
            searchOptions={searchOptions}
            onPageIndexChange={handlePageIndexChange}
            data={data?.data ?? []}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default FeedWebsitePage;
