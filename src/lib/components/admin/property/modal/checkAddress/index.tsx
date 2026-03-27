import {
  Button,
  Card,
  Form,
  FormInstance,
  Modal,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

import { ETransType } from "@/lib/core/enum";
import {
  IPropCheckAddress,
  IPropResponse,
} from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";
import LimitAccessPropTable from "../../table/limit-access-table";

type Props = {
  form: FormInstance;
  model?: IPropResponse;
  transType: ETransType;
};

const PropertyCheckAddress = ({ form, model, transType }: Props) => {
  const [existData, setExistData] = useState<IPropCheckAddress[]>([]);
  const [oppositeData, setOppositeData] = useState<IPropCheckAddress[]>([]);
  const [openModalExist, setOpenModalExist] = useState(false);

  const districtValue = Form.useWatch(["PropAddress", "DistrictId"], form);
  const wardValue = Form.useWatch(["PropAddress", "WardId"], form);
  const streetValue = Form.useWatch(["PropAddress", "StreetId"], form);
  const addressNumberValue = Form.useWatch(
    ["PropAddress", "AddressNumber"],
    form
  );
  const subAddressValue = Form.useWatch(["PropAddress", "SubAddress"], form);

  useEffect(() => {
    if (districtValue && wardValue && streetValue && addressNumberValue) {
      const fetch = async () => {
        const result = await propertyApi.checkAddress({
          pageIndex: 1,
          pageSize: 100,
          TransType: transType,
          PropertyId: model?.Id,
          DistrictId: districtValue,
          WardId: wardValue,
          StreetId: streetValue,
          AddressNumber: addressNumberValue,
          SubAddress: subAddressValue,
        });
        setExistData(result.data.Duplicate);
        setOppositeData(result.data.OppositeTransType);
        if (
          result.data.Duplicate.length > 0 ||
          result.data.OppositeTransType.length > 0
        )
          setOpenModalExist(true);
        else setOpenModalExist(false);
      };
      fetch();
    }
  }, [
    wardValue,
    streetValue,
    addressNumberValue,
    districtValue,
    model?.Id,
    transType,
    subAddressValue,
  ]);

  const onCopy = async (id: number) => {
    const res = await propertyApi.getById(id);
    console.log(res.data);
    if (res.data) {
      form.setFieldsValue({
        ...res.data,
        Id: model?.Id,
        TransType: transType,
        Images: [],
        Video: [],
        CustomerLogo: undefined,
        CustomerPhone: [],
        Price: model?.Price,
        PaymentMethod: model?.PaymentMethod,
        CustomerName: model?.CustomerName,
        PropAddress: {
          ...res.data.PropAddress,
          EndTimeRent: res.data.PropAddress?.EndTimeRent?.replace(
            "Năm",
            ""
          ).replace("Tháng", ""),
          EndTimeRentUnit: res.data.PropAddress?.EndTimeRent?.includes("Năm")
            ? "Năm"
            : "Tháng",
        },
      });
      setOpenModalExist(false);
    }
  };

  return (
    <Modal
      title="Kiểm tra địa chỉ"
      centered
      open={openModalExist}
      width={1000}
      onCancel={() => setOpenModalExist(false)}
      footer={<Button onClick={() => setOpenModalExist(false)}>Đóng</Button>}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card type="inner" title="Địa chỉ trùng">
          <Typography.Text italic type="danger">
            *Địa chỉ bạn nhập có thể đã tồn tại, vui lòng kiểm tra kỹ trước khi
            tiếp tục
          </Typography.Text>
          <LimitAccessPropTable data={existData} loading={false} />
        </Card>
        <Card
          type="inner"
          title={`Bất động sản ${
            transType === ETransType.sell ? "Thuê" : "Bán"
          } tương tự`}
        >
          <LimitAccessPropTable
            data={oppositeData}
            loading={false}
            onCopy={onCopy}
          />
        </Card>
      </Space>
    </Modal>
  );
};

export default PropertyCheckAddress;
