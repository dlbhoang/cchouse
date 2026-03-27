import { Col, Descriptions, Modal, Row, Tag, Typography } from "antd";
import Link from "next/link";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import RenderPhone from "@/lib/components/shared/CustomRender/RenderPhone";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import { IPropTemp } from "@/services/api/property/model";

type Props = {
  isModalOpen: boolean;
  data: { prop: IPropResponse; propTemp: IPropTemp };
  handleCancel: () => void;
  handleOk: () => void;
};

const PropTempCompareModal = ({
  isModalOpen,
  data,
  handleCancel,
  handleOk,
}: Props) => {
  const { propTemp, prop } = data;
  const { enumList } = useAdminContext();
  const { Location } = enumList;

  return (
    <Modal
      title={
        <Row justify={"space-between"}>
          <Col>
            <Typography.Text strong>Kiểm tra thông tin</Typography.Text>
          </Col>
          <Col>
            <Tag
            // style={{
            //   color: '#ffffff',
            //   backgroundColor:
            //     appConst.PROP_STATUS_COLORS[propTemp?.Status - 1],
            // }}
            >
              {propTemp?.StatusName}
            </Tag>
          </Col>
        </Row>
      }
      open={isModalOpen}
      closable={false}
      width={1000}
      onCancel={() => {
        handleCancel();
      }}
      centered
      onOk={handleOk}
      cancelText="Đóng"
      okButtonProps={{ style: { display: "none" } }}
      styles={{
        body: {
          height: 500,
          overflow: "auto",
        },
      }}
    >
      <Descriptions
        layout="vertical"
        size="default"
        column={2}
        bordered
        style={{ padding: 10 }}
      >
        <Descriptions.Item label="Mã BĐS ngoài">
          {propTemp?.Id}
        </Descriptions.Item>
        <Descriptions.Item label="Mã BĐS">
          <Link
            href={`/admin/property?TransType=1&propertyId=${prop?.Id}`}
            target="_blank"
          >
            {prop?.Id}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label="Loại giao dịch">
          {propTemp?.TransType === 1 ? "Mua bán" : "Cho thuê"}
        </Descriptions.Item>
        <Descriptions.Item label="Loại giao dịch">
          {propTemp?.TransType === 1 ? "Mua bán" : "Cho thuê"}
        </Descriptions.Item>

        <Descriptions.Item label="Vị trí">
          {Location?.find((x) => x.Value === propTemp?.Location)?.Name}
        </Descriptions.Item>
        <Descriptions.Item label="Vị trí">
          {Location?.find((x) => x.Value === prop?.PropAddress.Location)?.Name}
        </Descriptions.Item>
        <Descriptions.Item label="Loại BĐS">
          {data.propTemp?.PropTypeName}
        </Descriptions.Item>
        <Descriptions.Item label="Loại BĐS">
          {data.prop?.PropAddress.PropTypeName}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {CombineAddress({
            AddressNumber: data.propTemp?.AddressNumber,
            StreetName: data.propTemp?.StreetName,
            WardName: data.propTemp?.WardName,
            DistrictName: data.propTemp?.DistrictName,
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {CombineAddress({
            AddressNumber: data.prop?.PropAddress.AddressNumber,
            StreetName: data.prop?.PropAddress.StreetName,
            WardName: data.prop?.PropAddress.WardName,
            DistrictName: data.prop?.PropAddress.DistrictName,
          })}
        </Descriptions.Item>

        <Descriptions.Item label="SĐT">
          <RenderPhone phones={propTemp?.CustomerPhone?.split(",")} />
        </Descriptions.Item>
        <Descriptions.Item label="SĐT">
          <RenderPhone phones={prop.CustomerPhone} />
        </Descriptions.Item>

        <Descriptions.Item label="Giá">
          {propTemp?.DisplayPrice}
        </Descriptions.Item>
        <Descriptions.Item label="Giá">{prop?.DisplayPrice}</Descriptions.Item>

        <Descriptions.Item label="Diện tích">
          <RenderArea
            area={data.propTemp?.Area}
            length={data.propTemp?.Length}
            width={data.propTemp?.Width}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Diện tích">
          <RenderArea
            area={data.prop?.Area}
            length={data.prop?.Length}
            width={data.prop?.Width}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Ghi chú">{propTemp?.Note}</Descriptions.Item>
        <Descriptions.Item label="Ghi chú">{prop?.Note}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PropTempCompareModal;
