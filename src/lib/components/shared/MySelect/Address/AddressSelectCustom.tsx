import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Form,
  type FormInstance,
  Input,
  Row,
  Typography,
  theme,
} from "antd";
import { useEffect, useState } from "react";

import { CombineAddress } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";
import { DistrictSelect } from "./DistrictSelect";
import { ProvinceSelect } from "./ProvinceSelect";
import { StreetSelect } from "./StreetSelect";
import { WardSelect } from "./WardSelect";

const { useToken } = theme;

type Props = {
  form: FormInstance;
  nameProvince: string;
  nameDistrict: string;
  nameWard: string;
  nameStreet: string;
  nameAddressNumber: string;
  isHiddenField?: boolean;
};
const colStyle = {
  xs: 24,
  lg: 12,
};

export const AddressSelectCustom = ({
  form,
  nameProvince,
  nameDistrict,
  nameWard,
  nameStreet,
  nameAddressNumber,
  isHiddenField,
}: Props) => {
  const { token } = useToken();

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    padding: 10,
  };
  const { districts } = useAdminContext();

  const provinceWatch = Form.useWatch(nameProvince, form);
  const districtWatch = Form.useWatch(nameDistrict, form);
  const wardWatch = Form.useWatch(nameWard, form);
  const streetWatch = Form.useWatch(nameStreet, form);
  const addressWatch = Form.useWatch(nameAddressNumber, form);
  const [wardName, setWardName] = useState<string>();
  const [streetName, setStreetName] = useState<string>();
  const handleApply = () => {
    form.submit();
  };

  useEffect(() => {
    if (wardWatch) {
      const fetch = async () => {
        const result = await wardApi.getById(wardWatch);
        setWardName(result.data.Name);
      };
      fetch();
    } else {
      setWardName(undefined);
    }
  }, [wardWatch]);

  useEffect(() => {
    if (streetWatch) {
      const fetch = async () => {
        const result = await streetApi.getById(streetWatch);
        setStreetName(result.data.Name);
      };
      fetch();
    } else {
      setStreetName(undefined);
    }
  }, [streetWatch]);

  const dropdownRender = () => (
    <div style={contentStyle}>
      <Form.Item name={nameProvince}>
        <ProvinceSelect
          onChange={(val) => {
            form.resetFields([nameDistrict, nameWard, nameStreet]);
          }}
        />
      </Form.Item>
      <Form.Item name={nameDistrict}>
        <DistrictSelect
          parentVal={provinceWatch}
          onChange={(val) => {
            form.resetFields([nameWard, nameStreet]);
          }}
        />
      </Form.Item>
      <Form.Item name={nameWard}>
        <WardSelect parentVal={districtWatch} />
      </Form.Item>
      <Form.Item name={nameStreet}>
        <StreetSelect parentVal={districtWatch} />
      </Form.Item>
      {!isHiddenField && (
        <Form.Item name={nameAddressNumber}>
          <Input placeholder="Số nhà" />
        </Form.Item>
      )}

      <Row gutter={[12, 12]}>
        <Col {...colStyle}>
          <Button
            block
            htmlType="button"
            onClick={() => {
              form.resetFields([
                nameProvince,
                nameDistrict,
                nameWard,
                nameStreet,
                nameAddressNumber,
              ]);
              setStreetName(undefined);
              setWardName(undefined);
              handleApply();
            }}
          >
            Đặt lại
          </Button>
        </Col>
        <Col {...colStyle}>
          <Button block type="primary" htmlType="button" onClick={handleApply}>
            Áp dụng
          </Button>
        </Col>
      </Row>
    </div>
  );

  useEffect(() => {
    if (!districtWatch) {
      setWardName(undefined);
      setStreetName(undefined);
    }
  }, [districtWatch]);

  return (
    <Dropdown trigger={["click"]} dropdownRender={dropdownRender}>
      <Button
        block
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Text
          type={!districtWatch ? "secondary" : undefined}
          ellipsis
        >
          {CombineAddress({
            AddressNumber: addressWatch,
            StreetName: streetName,
            WardName: wardName,
            DistrictName: districts.find(
              (x) => x.Id.toString() === districtWatch?.toString()
            )?.Name,
          }) ?? "Chọn khu vực"}
        </Typography.Text>
        <Typography.Text type="secondary">
          <DownOutlined />
        </Typography.Text>
      </Button>
    </Dropdown>
  );
};
