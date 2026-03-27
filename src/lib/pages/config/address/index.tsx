"use client";
import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  CollapseProps,
  Empty,
  Row,
  Space,
  Tabs,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

import {
  IDistrictResponse,
  IProvinceResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import StreetTab from "@/lib/pages/config/address/street/streetTab";
import WardTab from "@/lib/pages/config/address/ward/wardTab";
import { useAdminContext } from "@/lib/stored";

import { DistrictTable } from "./district/districtTable";
import EditDistrict from "./district/editDistrict";
import EditProvince from "./province/editProvince";
import { ProvinceTable } from "./province/provinceTable";

const AddressPage = () => {
  const [selectedProvince, setSelectedProvince] = useState<IProvinceResponse>();
  const [selectedDistrict, setSelectedDistrict] = useState<IDistrictResponse>();
  const { provinces, districts } = useAdminContext();

  const [openProvince, setOpenProvince] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <Space direction="vertical" size="small">
          <Typography.Text strong>
            {`${selectedProvince?.Type} ${selectedProvince?.Name}`}
          </Typography.Text>
          <Typography.Text type="secondary">Tỉnh / Thành</Typography.Text>
        </Space>
      ),
      children: (
        <ProvinceTable
          data={provinces}
          defaultSelectRow={
            selectedProvince?.Id ? [selectedProvince.Id] : undefined
          }
          onSelect={(id) => {
            const item = provinces.find((x) => x.Id === id);
            setSelectedProvince(item);
            setSelectedDistrict(undefined);
          }}
        />
      ),
      extra: selectedProvince && (
        <Button icon={<EditOutlined />} onClick={() => setOpenProvince(true)} />
      ),
    },
    {
      key: "2",
      label: (
        <Space direction="vertical" size="small">
          {selectedDistrict && (
            <Typography.Text strong>
              {`${selectedDistrict.Name}`}
            </Typography.Text>
          )}
          <Typography.Text type="secondary">Quận / Huyện</Typography.Text>
        </Space>
      ),
      children: (
        <DistrictTable
          data={
            selectedProvince
              ? districts.filter((x) => x.ProvinceId === selectedProvince.Id)
              : []
          }
          defaultSelectRow={
            selectedDistrict?.Id ? [selectedDistrict.Id] : undefined
          }
          onSelect={(id) => {
            const item = districts.find((x) => x.Id === id);
            setSelectedDistrict(item);
          }}
        />
      ),
      extra: selectedDistrict && (
        <Button icon={<EditOutlined />} onClick={() => setOpenDistrict(true)} />
      ),
    },
  ];

  useEffect(() => {
    setSelectedProvince(provinces[0]);
  }, [provinces]);

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={24} lg={12} xl={10}>
          <Collapse items={items} defaultActiveKey="2" />
        </Col>
        <Col xs={24} md={24} lg={12} xl={14}>
          <Card>
            {selectedDistrict ? (
              <Tabs>
                <Tabs.TabPane key="1" tab="PHƯỜNG">
                  <WardTab districtId={selectedDistrict.Id} />
                </Tabs.TabPane>
                <Tabs.TabPane key="2" tab="ĐƯỜNG">
                  <StreetTab
                    districtId={selectedDistrict.Id}
                    provinceId={selectedProvince?.Id ?? 1}
                  />
                </Tabs.TabPane>
              </Tabs>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Click chọn Quận / Huyện để hiển thị thông tin"
              />
            )}
          </Card>
        </Col>
      </Row>
      {selectedProvince && (
        <EditProvince
          model={selectedProvince}
          isModalOpen={openProvince}
          handleCancel={() => setOpenProvince(false)}
        />
      )}

      {selectedDistrict && (
        <EditDistrict
          model={selectedDistrict}
          isModalOpen={openDistrict}
          handleCancel={() => setOpenDistrict(false)}
        />
      )}
      {/* <AddUpdateDistrictModal
        isModalOpen={isModalOpenAddUpdateDistrict}
        model={districtItem}
        handleCancel={handleCancelAddUpdateDistrict}
        handleMutate={() => {}}
      /> */}
    </>
  );
};

export default AddressPage;
