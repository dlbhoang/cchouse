import { Descriptions, Modal, Typography } from "antd";
import { useEffect, useState } from "react";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import RenderPhone from "@/lib/components/shared/CustomRender/RenderPhone";
import { useAdminContext } from "@/lib/stored";
import apartmentApi from "@/services/api/apartment/apartmentApi";
import { IApartmentResponse } from "@/services/api/apartment/IApartment";
import { IApartmentUnitRequest } from "@/services/api/apartment/unit/IApartmentUnit";

const { Text } = Typography;
type Props = {
  isModalOpen: boolean;
  model: IApartmentUnitRequest;
  handleCancel: () => void;
  handleOk: () => void;
};

const PreviewModal = ({
  isModalOpen,
  model,
  handleCancel,
  handleOk,
}: Props) => {
  console.log("model preview", model);

  const { propType, enumList } = useAdminContext();
  const { PaymentMethod, ApartmentUnitType } = enumList;
  const [apartment, setApartment] = useState<IApartmentResponse>();

  useEffect(() => {
    const fetch = async () => {
      const res = await apartmentApi.getById(model.ApartmentId ?? 0);
      setApartment(res.data);
    };
    fetch();
  }, [model.ApartmentId]);

  return (
    <Modal
      title="Kiểm tra thông tin"
      open={isModalOpen}
      width={1000}
      onCancel={() => {
        handleCancel();
      }}
      centered
      onOk={handleOk}
    >
      <Text italic strong type="danger">
        *Vui lòng kiểm tra kỹ trước khi thêm mới!!!
      </Text>
      <Descriptions
        layout="horizontal"
        size="small"
        column={{ xs: 1, md: 1, lg: 2, xl: 2 }}
        bordered
        style={{ padding: 10 }}
      >
        <Descriptions.Item label="Loại giao dịch">
          {model?.TransType === 1 ? "Mua bán" : "Cho thuê"}
        </Descriptions.Item>
        <Descriptions.Item label="Loại hình căn hộ">
          {
            ApartmentUnitType.find(
              (x) => x.Value.toString() === model?.ApartmentUnitType?.toString()
            )?.Name
          }
        </Descriptions.Item>
        {apartment && (
          <Descriptions.Item label="Chung cư">
            {`${apartment.Name} (${apartment.DistrictName})`}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Mã căn">{model.Code}</Descriptions.Item>
        <Descriptions.Item label="Khu vực">{model.Zone}</Descriptions.Item>
        <Descriptions.Item label="Block">{model.Block}</Descriptions.Item>

        <Descriptions.Item label="Giá">
          {`${model.Contact.Price} ${
            PaymentMethod.find(
              (x) => x.Value === Number(model.Contact.PaymentMethod)
            )?.Name
          }`}
        </Descriptions.Item>
        <Descriptions.Item label="Diện tích sử dụng">
          <RenderArea area={model.Area ?? 0} />
        </Descriptions.Item>
        <Descriptions.Item label="Tên liên hệ">
          {model.Contact.Name}
        </Descriptions.Item>
        <Descriptions.Item label="Điện thoại">
          {model?.Contact.Phone ? (
            <RenderPhone phones={model?.Contact.Phone.toString().split(",")} />
          ) : (
            ""
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PreviewModal;
