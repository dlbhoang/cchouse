import { Button, Modal, Space, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { ETransType } from "@/lib/core/enum";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { ICustomerResponse } from "@/services/api/customer/ICustomer";
import propertyApi from "@/services/api/property/propertyApi";
import PropertySubTable from "../../property/table/subTable";

type Props = {
  isModalOpen: boolean;
  handleCancel: () => void;
  model: ICustomerResponse;
  transType: ETransType;
};

const RecProps = ({ isModalOpen, handleCancel, model, transType }: Props) => {
  const [propList, setPropList] = useState<IPropResponse[]>([]);
  const [totalRow, setTotalRow] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const requirement =
    transType === ETransType.rent
      ? model.RentingRequirement
      : model.BuyingRequirement;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      const result = await propertyApi.get({
        pageIndex: 1,
        pageSize: 100,
        TransType: transType,
        PropTypeIds: requirement?.PropTypes.toString(),
        DistrictIds: requirement?.Districts.toString(),
        PriceFrm: requirement?.PriceFrm,
        PriceTo: requirement?.PriceTo,
        WidthFrm: requirement?.Width,
        LengthFrm: requirement?.Length,
        AreaFrm: requirement?.Area ? requirement.Area - 10 : undefined,
        AreaTo: requirement?.Area ? requirement.Area + 10 : undefined,
        Location: requirement?.Location,
        Direction: requirement?.Direction,
      });

      setPropList(result.data);
      setTotalRow(result.totalRow ?? 0);
      setLoading(false);
    };
    fetch();
  }, [requirement, transType]);
  return (
    <Modal
      open={isModalOpen}
      title={
        <Space>
          <Tag>{`Mã: ${model?.Id}`}</Tag>
          {`${model?.TypeName}: ${model?.Name}`}
        </Space>
      }
      width={1200}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Đóng
        </Button>,
      ]}
    >
      <Typography.Title level={5}>
        Gợi ý các bất động sản phù hợp
      </Typography.Title>
      <Typography.Text>
        Tìm được <Typography.Text strong>{totalRow}</Typography.Text> kết quả
      </Typography.Text>
      <PropertySubTable data={propList} loading={loading} />
    </Modal>
  );
};

export default RecProps;
