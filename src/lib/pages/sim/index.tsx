"use client";
import { Card, Col, Input, Row, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";

import SimRequestModal from "@/lib/components/admin/sim/SimRequestModal";
import SimTable from "@/lib/components/admin/sim/table";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import type { ISimResponse } from "@/lib/interfaces/ISim";
import simApi from "@/services/api/simApi";
import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";

const { Search } = Input;

const SimPage = () => {
  const [searchOptions, setSearchOptions] =
    useState<ISearchOptions>(baseFilter);
  const [requestModal, setRequestModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ISimResponse>();

  const { data, isValidating, mutate } = simApi.useGet(searchOptions);

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    setSearchOptions({
      ...searchOptions,
      pageIndex,
      pageSize,
    });
  };
  const handleSearch = (val: string) => {
    setSearchOptions({
      ...searchOptions,
      search: val,
      pageIndex: 1,
    });
  };
  const handleRefresh = () => {
    setSearchOptions({
      ...searchOptions,
      search: null,
      pageIndex: 1,
    });
  };
  useEffect(() => {
    if (data !== undefined) mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOptions]);

  return (
    <>
      <Card>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Space.Compact direction="horizontal">
              <Search
                placeholder="Tìm số điện thoại, nhân viên"
                onSearch={handleSearch}
              />
              <Tooltip title="Reset/Đặt lại">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                >
                  <RotateCcwIcon />
                </Button>
              </Tooltip>
            </Space.Compact>
          </Col>
          <Col span={24}>
            <TitlePage title={AppRoutes.sim.name} />
            <SimTable
              loading={isValidating}
              total={data?.totalRow ?? 0}
              searchOptions={searchOptions}
              onPageIndexChange={handlePageIndexChange}
              data={data?.data ?? []}
              handleRequestModal={(item) => {
                setSelectedData(item);
                setRequestModal(true);
              }}
              handleMutate={() => mutate()}
            />
          </Col>
        </Row>
      </Card>

      <SimRequestModal
        handleMutate={() => mutate()}
        isModalOpen={requestModal}
        handleCancel={() => {
          setRequestModal(false);
          setSelectedData(undefined);
        }}
        model={selectedData}
      />

      <FloatBtn onClick={() => setRequestModal(true)} />
    </>
  );
};

export default SimPage;
