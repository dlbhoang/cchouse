"use client";
import { Card, Col, Row, Space, Spin, Statistic, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import UseWebsiteDetail from "@/lib/components/admin/userWebsite/detail";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import type { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { useAdminContext } from "@/lib/stored";
import feedApi from "@/services/api/feed/feedApi";
import type { IUserWebsiteResponse } from "@/services/api/userWebsite/model";
import userWebsiteApi from "@/services/api/userWebsite/userWebsiteApi";

type Props = {
  id: string;
};

const UserWebsiteDetailPage = ({ id }: Props) => {
  const { smallScreen } = useAdminContext();
  const [status, setStatus] = useState<ICountItem[]>([]);
  const [data, setData] = useState<IUserWebsiteResponse>();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const [feedResult, userResult] = await Promise.all([
          feedApi.countStatusWebsite({
            ...baseFilter,
            UserId: Number(id),
          }),
          userWebsiteApi.getById(Number(id)),
        ]);
        setStatus(feedResult.data);
        setData(userResult.data);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Row gutter={[12, 12]}>
      <Col lg={18}>{data ? <UseWebsiteDetail data={data} /> : <Spin />}</Col>
      <Col xs={24} lg={6}>
        <Typography.Title level={4} style={{ marginBottom: 10, marginTop: 0 }}>
          Thông tin tin đăng
        </Typography.Title>
        <Space
          direction={smallScreen ? "horizontal" : "vertical"}
          style={{ width: "100%", overflow: "auto" }}
        >
          {status.map((e) => (
            <Card bordered={false} style={{ minWidth: 200 }} size="small">
              <Statistic title={e.Name} value={e.Count} />
              <Link
                href={`${AppRoutes.feedWebsite.url}?status=${e.Id}&userId=${id}`}
              >
                Chi tiết
              </Link>
            </Card>
          ))}
        </Space>
      </Col>
    </Row>
  );
};

export default UserWebsiteDetailPage;
