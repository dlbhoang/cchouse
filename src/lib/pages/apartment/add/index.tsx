"use client";
import { Card, Col, Row } from "antd";

import ApartmentForm from "@/lib/components/admin/apartment/form";
import TitlePage from "@/lib/core/layout/components/TitlePage";

const AddApartmentPage = () => {
  return (
    <Row justify="center">
      <Col xs={24} lg={18}>
        <Card>
          <TitlePage title="Thêm chung cư / căn hộ" />
          <ApartmentForm mode="step" />
        </Card>
      </Col>
    </Row>
  );
};

export default AddApartmentPage;
