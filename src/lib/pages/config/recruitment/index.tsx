"use client";
import { Card, Col, Row } from "antd";
import { RecruitmentTable } from "@/lib/components/admin/recruitment/table";

const RecruitmentPage = () => {
  return (
    <Row gutter={[12, 12]}>
      <Col md={24}>
        <Card>
          <RecruitmentTable />
        </Card>
      </Col>
    </Row>
  );
};

export default RecruitmentPage;
