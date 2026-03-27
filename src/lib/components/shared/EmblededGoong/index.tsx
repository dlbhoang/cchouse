import { AlertOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  type FormInstance,
  Input,
  List,
  Popover,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { useEffect, useState } from "react";

import { CombineAddress } from "@/lib/core/utils/myFormat";
import type { IAddressBase } from "@/lib/interfaces/base/IPropAddressBase";
import { useAdminContext } from "@/lib/stored";
import type { IGeocode } from "@/services/api/base/IGeocode";
import streetApi from "@/services/api/streetApi";
import utilsApi from "@/services/api/utilsApi";
import wardApi from "@/services/api/wardApi";

type Props = {
  form: FormInstance;
  address: IAddressBase;
  name: {
    placeId: string | string[];
    lng: string | string[];
    lat: string | string[];
  }; // fist item is PlaceId
};

const EmblededGoong = ({ form, name, address }: Props) => {
  const placeId: string | undefined = Form.useWatch(name.placeId, form);
  const lng: string | undefined = Form.useWatch(name.lng, form);
  const lat: string | undefined = Form.useWatch(name.lat, form);

  const { districts } = useAdminContext();
  const [search, setSearch] = useState<string>("");
  const [geocode, setGeocode] = useState<IGeocode>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address?.StreetId) {
      const fetch = async () => {
        const wardResult = await wardApi.getById(address.WardId);
        const streetResult = await streetApi.getById(address.StreetId);

        setSearch(
          CombineAddress({
            AddressNumber: address.AddressNumber,
            StreetName: streetResult?.data?.Name,
            WardName: wardResult?.data?.Name,
            DistrictName: districts.find(
              (x) => x.Id.toString() === address.DistrictId.toString()
            )?.Name,
          }) ?? ""
        );
      };

      fetch();
    }
  }, [address, districts]);

  const [open, setOpen] = useState(false);

  const onSearch: SearchProps["onSearch"] = async (value, _e, info) => {
    console.log(value);

    setLoading(true);
    setOpen(true);
    const result = await utilsApi.geocode(value);
    setGeocode(result.data);
    setLoading(false);
  };

  const ListGeocode = (
    <List
      itemLayout="horizontal"
      loading={loading}
      style={{ width: 400 }}
      dataSource={geocode?.results ?? []}
      renderItem={(item, index) => (
        <List.Item
          key={item.place_id}
          onClick={() => {
            setSearch(item.formatted_address);
            form.setFieldValue(name.placeId, item.place_id);
            form.setFieldValue(name.lng, item.geometry.location.lng);
            form.setFieldValue(name.lat, item.geometry.location.lat);
          }}
        >
          <List.Item.Meta title={item.formatted_address.split(",")?.[0]} />
          {`${item.compound.commune}, ${item.compound.district}, ${item.compound.province}`}
        </List.Item>
      )}
    />
  );

  return (
    <Row gutter={12}>
      <Col span={24}>
        <div style={{ position: "relative" }}>
          <Spin
            spinning={!placeId}
            tip={
              <Space direction="vertical">
                <Typography.Title level={3}>
                  CHƯA CÓ THÔNG TIN TOẠ ĐỘ
                </Typography.Title>
                <Button onClick={() => onSearch(search)}>Tìm vị trí</Button>
              </Space>
            }
            indicator={<AlertOutlined />}
          >
            <iframe
              title="my_embed_goong"
              height={700}
              width="100%"
              src={
                placeId
                  ? `https://maps.goong.io/?pid=${placeId}`
                  : "https://maps.goong.io"
              }
            />
          </Spin>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "10%",
              width: "100%",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Popover
              open={open}
              onOpenChange={setOpen}
              content={ListGeocode}
              trigger="click"
              placement="bottom"
            >
              <Input.Search
                style={{ width: 400 }}
                value={search}
                onSearch={onSearch}
                loading={loading}
              />
            </Popover>
          </div>
        </div>
      </Col>

      <Col span={24}>
        {placeId ? (
          <Tag color="success">Đã lấy được vị trí: {`${lat},${lng}`}</Tag>
        ) : (
          <Tag>Chưa có thông tin vị trí</Tag>
        )}
      </Col>
    </Row>
  );
};

export default EmblededGoong;
