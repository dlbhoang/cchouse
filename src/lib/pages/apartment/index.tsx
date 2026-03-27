"use client";
import { Card, Col, Input, Row, Typography } from "antd";
import { useEffect, useState } from "react";

// import ParcelLandFilterResponsive from '@/lib/components/admin/parcelLand/filterDrawer';
import { ApartmentTable } from "@/lib/components/admin/apartment/table";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import apartmentApi from "@/services/api/apartment/apartmentApi";

import ApartmentDetail from "./detail";

const { Search } = Input;
const ApartmentPage = () => {
  const [selected, setSelected] = useState<number>();
  const [searchOptions, setSearchOptions] = useState<ISearchOptions>({
    ...baseFilter,
  });

  const { data, isLoading, mutate } = apartmentApi.useGet(searchOptions);

  useEffect(() => {
    if ((data?.data?.length ?? 0) > 0) {
      setSelected(data?.data[0].Id);
    }
  }, [data]);

  useEffect(() => {
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOptions]);

  return (
    <Row gutter={[12, 12]}>
      <Col md={6}>
        <Card title={AppRoutes.apartment.name.toUpperCase()}>
          <Row justify="space-between" gutter={[12, 12]}>
            <Col span={24}>
              <Search
                placeholder="Tìm tên chung cư / căn hộ"
                onSearch={(val) => {
                  setSearchOptions({ ...searchOptions, search: val });
                }}
              />
            </Col>

            <Col span={24}>
              <span>
                TÌM ĐƯỢC{" "}
                <Typography.Text strong>{data?.totalRow ?? 0}</Typography.Text>{" "}
                KẾT QUẢ
              </span>
              <ApartmentTable
                loading={isLoading}
                data={data?.data ?? []}
                defaultSelectRow={[selected ?? 0]}
                onSelect={setSelected}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col md={18}>
        <Card
          title="THÔNG TIN CHI TIẾT"
          extra={
            <BtnConfirm
              type="text"
              btnText="Xoá"
              danger
              onOkClick={async () => {
                if (selected) await apartmentApi.delete(selected);
                mutate();
              }}
            />
          }
        >
          {selected && <ApartmentDetail id={selected} />}
        </Card>
      </Col>
    </Row>
  );
};

export default ApartmentPage;
