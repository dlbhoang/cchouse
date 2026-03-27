import { Col, Descriptions, Modal, Row } from "antd";
import { useEffect, useState } from "react";

import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import { FormatDate } from "@/lib/core/utils/myFormat";
import { IDuplicateAddress } from "@/lib/interfaces/Property/IDuplicateAddress";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";

const renderItem = (
  item: IPropResponse,
  handleChoose: (propAddressId: number) => void
) => {
  return (
    <Descriptions bordered size="middle" column={{ xl: 1 }}>
      <Descriptions.Item label="Mã BĐS">{item.Id}</Descriptions.Item>
      <Descriptions.Item label="Giá">{item.DisplayPrice}</Descriptions.Item>
      <Descriptions.Item label="Loại giao dịch">
        {item.TransType === 1 ? "Mua bán" : "Cho thuê"}
      </Descriptions.Item>
      <Descriptions.Item label="Người tạo">{item.CreatedBy}</Descriptions.Item>
      <Descriptions.Item label="Ngày tạo">
        {FormatDate(item.CreatedDate)}
      </Descriptions.Item>
      <Descriptions.Item label="Vị trí">
        {item.PropAddress.Location === 1 ? "Mặt tiền" : "Hẻm"}
      </Descriptions.Item>
      <Descriptions.Item label="Địa chỉ">
        {`${item.PropAddress.AddressNumber} ${item.PropAddress.StreetName}, ${item.PropAddress.WardName}, ${item.PropAddress.DistrictName}`}
      </Descriptions.Item>
      <Descriptions.Item label="Chi tiết Số nhà">
        {item.PropAddress.SubAddressName ?? "--"}
      </Descriptions.Item>
      <Descriptions.Item label="Nhận diện KH">
        {item.CustomerTypeName}
      </Descriptions.Item>
      <Descriptions.Item label="Khách hàng">
        {`${item.CustomerName}`}
      </Descriptions.Item>
      <Descriptions.Item label="SĐT Khách hàng">
        {`${item.CustomerPhone}`}
      </Descriptions.Item>
      <Descriptions.Item label="Tổng DTTT">
        <RenderArea area={item.Area} length={item.Length} width={item.Width} />
      </Descriptions.Item>
      <Descriptions.Item label="Tổng DTCN">
        <RenderArea
          area={item.PropAddress.AreaLegal}
          length={item.PropAddress.LengthLegal}
          width={item.PropAddress.WidthLegal}
        />
      </Descriptions.Item>
      <Descriptions.Item label="Tình trạng nhà">
        {item.PropAddress.StatusUsageName}
      </Descriptions.Item>
      <Descriptions.Item label="Thao tác">
        <BtnConfirm
          onOkClick={() => handleChoose(item.PropAddress.Id)}
          type="text"
          btnText="Chọn"
          title="Xác nhận chọn địa chỉ này?"
          description="Thông tin các địa chỉ còn lại được xem là sai dữ liệu và sẽ xoá khỏi hệ thống!!!"
        />
      </Descriptions.Item>
    </Descriptions>
  );
};

type Props = {
  isModalOpen: boolean;
  model: IDuplicateAddress;
  handleCancel: () => void;
  handleMutate: () => void;
};

// const titles = [
//   'Pháp lý',
//   'Phòng ngủ',
//   'toilet',
//   'Số lầu',
//   'Số hầm',
//   'Cấu trúc',
//   'Trang thiết bị',
//   'Tiện ích',
// ];

export const CheckAddressModal = ({
  isModalOpen,
  model,
  handleCancel,
  handleMutate,
}: Props) => {
  // const status = Object.entries(EUserAdminStatus);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [data, setData] = useState<IPropResponse[]>();

  useEffect(() => {
    if (model.PropRefs) {
      const result: IPropResponse[] = [];
      const fetch = async () => {
        const ids: string[] = model.PropRefs.split(",");
        for (let index = 0; index < ids.length; index += 1) {
          const element = Number(ids[index]);
          // eslint-disable-next-line no-await-in-loop
          const temp = await propertyApi.getById(element);
          result.push(temp.data);
        }
        setData(result);
      };
      fetch();
    }
  }, [model]);

  const onFinish = async (id: number) => {
    console.log("Success:", id);
    try {
      setConfirmLoading(true);
      await propertyApi.chooseAddress(id);
      handleMutate();
    } finally {
      setConfirmLoading(false);
      handleCancel();
    }
  };

  console.log(data);

  return (
    <Modal
      title="Kiểm tra thông tin"
      maskClosable={false}
      open={isModalOpen}
      confirmLoading={confirmLoading}
      width={1200}
      onCancel={() => {
        handleCancel();
      }}
      onOk={() => {}}
      okText="Lưu"
      cancelText="Đóng"
    >
      {data && (
        <Row gutter={[12, 12]}>
          {data.map((e) => (
            <Col span={12}> {renderItem(e, onFinish)}</Col>
          ))}
        </Row>
      )}
    </Modal>
  );
};
