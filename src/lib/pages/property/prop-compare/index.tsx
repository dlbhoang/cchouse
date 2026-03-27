"use client";

import { Card, Col, Row, Typography } from "antd";
import Image from "next/image";
import { type CSSProperties, useEffect, useState } from "react";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { usePropStore } from "@/lib/stored/PropStored";
import propertyApi from "@/services/api/property/propertyApi";

const { Text } = Typography;

const divStyle: CSSProperties = {
  minWidth: 250,
  // maxWidth: 300,
  backgroundColor: "white",
  border: "1px solid rgba(0,0,0,.08)",
};
const colStyle: CSSProperties = {
  height: 50,
  display: "flex",
  justifyContent: "left",
  paddingLeft: 10,
  alignItems: "center",
  textAlign: "left",
};
const colColorStyle: CSSProperties = {
  height: 50,
  display: "flex",
  justifyContent: "left",
  paddingLeft: 10,
  alignItems: "center",
  textAlign: "left",
  backgroundColor: "#f4f4f4",
};

const PropComparePage = () => {
  const { listCompare } = usePropStore();
  const [data, setData] = useState<IPropResponse[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const promises = listCompare.map((item) => propertyApi.getById(item.Id));
      const results = await Promise.all(promises);

      setData(results.map((e) => e.data));
    };
    fetch();
  }, [listCompare]);

  return (
    <Card title={`CÓ ${listCompare.length} BĐS ĐƯỢC CHỌN ĐỂ SO SÁNH`}>
      <Row>
        <Col span={4}>
          <div style={{ ...divStyle, fontWeight: 600 }}>
            <span style={{ ...colStyle, height: 150 }} />
            <span style={colColorStyle}>Bất động sản</span>
            <span style={colStyle}>Địa chỉ</span>
            <span style={colColorStyle}>Giá bán</span>
            <span style={colStyle}>Loại BĐS</span>
            <span style={colColorStyle}>Vị trí</span>
            <span style={colStyle}>Diện tích</span>
            <span style={colColorStyle}>Quận / Huyện</span>
            <span style={colStyle}>Phường / Xã</span>
            <span style={colColorStyle}>Đường</span>
            <span style={colStyle}>Kết cấu</span>
            {/* <span style={colColorStyle}>
              Video
            </Col> */}
          </div>
        </Col>
        <Col span={20} style={{ overflow: "auto", display: "flex" }}>
          {data.map((e, idx) => (
            <div style={divStyle}>
              <Col
                span={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Image
                  src={e.MainImage ? e.MainImage.Path : "/home.jpg"}
                  alt="default_image"
                  width={150}
                  height={150}
                />
              </Col>
              <Col span={24} style={colColorStyle}>
                <Text>Mã: {e.Id}</Text>
              </Col>
              <Col span={24} style={colStyle}>
                {e.PropAddress.DisplayAddress}
              </Col>
              <Col span={24} style={colColorStyle}>
                <Text>{e.DisplayPrice}</Text>
              </Col>
              <Col span={24} style={colStyle}>
                <Text>{e.PropAddress.PropTypeName}</Text>
              </Col>
              <Col span={24} style={colColorStyle}>
                <Text>{e.PropAddress.LocationName}</Text>
              </Col>
              <Col span={24} style={colStyle}>
                <RenderArea area={e.Area} width={e.Width} length={e.Length} />
              </Col>
              <Col span={24} style={colColorStyle}>
                <Text>{e.PropAddress.DistrictName}</Text>
              </Col>
              <Col span={24} style={colStyle}>
                <Text>{e.PropAddress.WardName}</Text>
              </Col>
              <Col span={24} style={colColorStyle}>
                <Text>{e.PropAddress.StreetName}</Text>
              </Col>
              <Col span={24} style={colStyle}>
                <Text>{e.CustomDisplayStructures}</Text>
              </Col>
            </div>
          ))}
        </Col>
      </Row>
    </Card>
  );
};

export default PropComparePage;
