"use client";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Statistic } from "antd";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";
import { objToQueryString } from "@/lib/core/utils/app-func";
import propTempApi from "@/services/api/property/propTempApi";

enum EStatus {
  total = 1,
  notSync = 2,
  synced = 3,
  error = 4,
  duplicate = 5,
}

const PropTempStatistics = () => {
  const { data, mutate: _mutate } = propTempApi.useStatistics();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const queryString = objToQueryString(
    Object.fromEntries(searchParams?.entries() ?? [])
  );

  const handleSync = async () => {
    try {
      setLoading(true);
      await propTempApi.syncToProp();
      _mutate();
      mutate(`propTemp?${queryString}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={[12, 12]}>
      {data?.data?.map((e) => (
        <Col xs={12} lg={6} key={e.Id}>
          <Card>
            <Statistic
              title={
                <Row justify={"space-between"} align={"middle"}>
                  <Col>{e.Name}</Col>
                  {e.Id === EStatus.notSync && (
                    <Col>
                      <Button
                        type="primary"
                        icon={<SyncOutlined />}
                        onClick={handleSync}
                        loading={loading}
                      >
                        Đồng bộ
                      </Button>
                    </Col>
                  )}
                </Row>
              }
              value={e.Count}
              valueStyle={e.Id === EStatus.error ? { color: "#cf1322" } : {}}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PropTempStatistics;
