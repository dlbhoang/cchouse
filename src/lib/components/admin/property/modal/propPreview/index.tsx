import { Descriptions, Modal, Typography } from "antd";
import { useEffect, useState } from "react";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import RenderPhone from "@/lib/components/shared/CustomRender/RenderPhone";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import {
  IStreetResponse,
  IWardResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import { IPropRequest } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";

const { Text } = Typography;
type Props = {
  isModalOpen: boolean;
  model: IPropRequest;
  handleCancel: () => void;
  handleOk: () => void;
};

const PropPreviewModal = ({
  isModalOpen,
  model,
  handleCancel,
  handleOk,
}: Props) => {
  console.log("model preview", model);

  const { districts, propType, enumList } = useAdminContext();
  const { PaymentMethod, Location, StatusUsage } = enumList;
  const [ward, setWard] = useState<IWardResponse>();
  const [street, setStreet] = useState<IStreetResponse>();

  useEffect(() => {
    const fetch = async () => {
      const wardResult = await wardApi.getById(model.PropAddress.WardId);
      const streetResult = await streetApi.getById(model.PropAddress.StreetId);
      setWard(wardResult.data);
      setStreet(streetResult.data);
    };
    fetch();
  }, [model.PropAddress]);

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
        size="default"
        column={{ xs: 1, lg: 1, xl: 2 }}
        bordered
        style={{ padding: 10 }}
      >
        <Descriptions.Item label="Loại giao dịch">
          {model?.TransType === 1 ? "Mua bán" : "Cho thuê"}
        </Descriptions.Item>
        <Descriptions.Item label="Loại bất động sản">
          {
            propType.find(
              (x) => x.Id.toString() === model.PropAddress.PropTypeId.toString()
            )?.Name
          }
        </Descriptions.Item>
        <Descriptions.Item label="Vị trí">
          {
            Location.find((x) => x.Value === Number(model.PropAddress.Location))
              ?.Name
          }
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {CombineAddress({
            AddressNumber: model.PropAddress.AddressNumber,
            StreetName: street?.Name,
            WardName: ward?.Name,
            DistrictName: districts.find(
              (x) => x.Id.toString() === model.PropAddress.DistrictId.toString()
            )?.Name,
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Giá">
          {`${model?.Price} ${
            PaymentMethod.find((x) => x.Value === Number(model.PaymentMethod))
              ?.Name
          }`}
        </Descriptions.Item>
        <Descriptions.Item label="Chủ nhà">
          {model.CustomerName}
        </Descriptions.Item>
        <Descriptions.Item label="Điện thoại">
          {model?.CustomerPhone ? (
            <RenderPhone phones={model?.CustomerPhone.toString().split(",")} />
          ) : (
            "--"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Tình trạng nhà">
          {
            StatusUsage.find(
              (x) => x.Value === Number(model.PropAddress.StatusUsage)
            )?.Name
          }
        </Descriptions.Item>
        <Descriptions.Item label="Diện tích TT">
          <RenderArea
            area={model.Area}
            length={model.Length}
            width={model.Width}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Diện tích sàn">
          <RenderArea area={model.FloorArea} />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PropPreviewModal;
