"use client";
import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";

import FeedPricingFilter from "@/lib/components/admin/feedPricing/filter";
import AddUpdateFeedPricingModal from "@/lib/components/admin/feedPricing/modal/AddUpdate";
import FeedPricingTable from "@/lib/components/admin/feedPricing/table";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { appConst, baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import type { IFeedFilter } from "@/lib/interfaces/filter/ISearchOptions";
import type { IFeedPricingResponse } from "@/services/api/feed/IFeedPricing";
import feedPricingApi from "@/services/api/feedPricingApi";

const FeedPricingPage = () => {
  const arrDays = appConst.ARR_DAYS_FEED;
  const [openAddModal, setOpenAddModal] = useState(false);
  const [updateItem, setUpdateItem] = useState<IFeedPricingResponse>();
  const [searchOptions, setSearchOptions] = useState<IFeedFilter>({
    ...baseFilter,
    Status: 0,
  } as IFeedFilter);

  const { data, isValidating, mutate } = feedPricingApi.useGet(searchOptions);

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
    <>
      <Card>
        <Row gutter={12}>
          <Col span={24}>
            <FeedPricingFilter model={searchOptions} onSubmit={handleFilter} />
          </Col>

          <Col span={24}>
            <TitlePage title={AppRoutes.feedPricing.name} />
            <FeedPricingTable
              loading={isValidating}
              total={data?.totalRow ?? 0}
              searchOptions={searchOptions}
              onPageIndexChange={handlePageIndexChange}
              data={data?.data ?? []}
              arrDays={arrDays}
              OpenModalUpdate={(item) => {
                setOpenAddModal(true);
                setUpdateItem(item);
              }}
              handleMutate={() => mutate()}
            />
          </Col>
        </Row>
      </Card>

      <AddUpdateFeedPricingModal
        arrDays={arrDays}
        handleCancel={() => {
          setOpenAddModal(false);
          setUpdateItem(undefined);
        }}
        handleMutate={() => mutate()}
        isModalOpen={openAddModal}
        model={updateItem}
      />
      <FloatBtn onClick={() => setOpenAddModal(true)} />
    </>
  );
};

export default FeedPricingPage;
