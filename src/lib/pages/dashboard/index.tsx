"use client";
import { WarningOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import Link from "next/link";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import consignmentApi from "@/services/api/consignment/consignmentApi";
import reportSpamApi from "@/services/api/reportSpam/reportSpamApi";

const DashboardPage = () => {
  const { data: consignments } = consignmentApi.useGet(baseFilter);
  const { data: reports } = reportSpamApi.useGet(baseFilter);
  return (
    <Row gutter={12}>
      <Col span={24}>
        <TitlePage title={AppRoutes.dashboard.name} />
      </Col>
      <Col xs={24} md={6}>
        <Card bordered={false}>
          <Row justify={"space-between"}>
            <Statistic
              title="Ký gửi bất động sản"
              value={consignments?.totalRow ?? 0}
              valueStyle={{ color: "#3f8600" }}
            />
            <Link href={AppRoutes.consignment.url}>Chi tiết</Link>
          </Row>
        </Card>
      </Col>
      <Col xs={24} md={6}>
        <Card bordered={false}>
          <Row justify={"space-between"}>
            <Statistic
              title="Báo xấu tin đăng"
              value={reports?.totalRow ?? 0}
              valueStyle={{ color: "#c00" }}
              prefix={<WarningOutlined />}
            />
            <Link href={AppRoutes.reportSpam.url}>Chi tiết</Link>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardPage;
