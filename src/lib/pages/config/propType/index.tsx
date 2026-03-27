"use client";
import { Card, Col, Input, Row, Space } from "antd";
import { useEffect, useState } from "react";

import PropTypeRequestModal from "@/lib/components/admin/property/propType/PropTypeRequestModal";
import PropTypeTable from "@/lib/components/admin/property/propType/table";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import type { IPropTypeResponse } from "@/lib/interfaces/Property/IPropType";
import propTypeApi from "@/services/api/property/propTypeApi";

const { Search } = Input;

const PropTypePage = () => {
  const [searchOptions, setSearchOptions] = useState<ISearchOptions>({
    pageIndex: 1,
    pageSize: 100,
  } as ISearchOptions);
  const [requestModal, setRequestModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<IPropTypeResponse>();

  const { data, isValidating, mutate } = propTypeApi.useGet(searchOptions);

  const handleSearch = (val: string) => {
    setSearchOptions({
      ...searchOptions,
      search: val,
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
                placeholder="Tìm tên loại"
                allowClear
                onSearch={handleSearch}
              />
            </Space.Compact>
          </Col>
          <Col span={24}>
            <TitlePage title={AppRoutes.propType.name} />
            <PropTypeTable
              loading={isValidating}
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

      <PropTypeRequestModal
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

export default PropTypePage;
