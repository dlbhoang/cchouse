"use client";
import { Card, Col, Row } from "antd";
import { usePathname, useRouter } from "next/navigation";
import PropTempFilter from "@/lib/components/admin/propTemp/filter";

import { PropTempTable } from "@/lib/components/admin/propTemp/table";
import { ETransType } from "@/lib/core/enum";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { objToQueryString, queryStringToObj } from "@/lib/core/utils/app-func";
import type { IPropTempOpts } from "@/services/api/property/model";
import PropTempStatistics from "./statistics";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const PropTempPage = ({ searchParams }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const searchOptions: IPropTempOpts = {
    ...queryStringToObj<IPropTempOpts>(searchParams),
    TransType: Number(searchParams?.TransType) || ETransType.sell,
    ProvinceId: 1,
  };

  const handleFilter = (values: IPropTempOpts) => {
    router.push(`${pathname}?${objToQueryString(values)}`);
  };

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <PropTempStatistics />
      </Col>

      {searchOptions && (
        <Col span={24}>
          <Card>
            <PropTempFilter onSubmit={handleFilter} model={searchOptions} />

            <Row>
              <Col xs={11} lg={9}>
                <TitlePage title={"Danh sách BĐS ngoài"} />
              </Col>
            </Row>
            <PropTempTable opts={searchOptions} />
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default PropTempPage;
