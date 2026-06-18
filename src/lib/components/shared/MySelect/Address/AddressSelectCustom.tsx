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
  const [open, setOpen] = useState(false);

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

  const addressLabel = CombineAddress({
    AddressNumber: addressWatch,
    StreetName: streetName,
    WardName: wardName,
    DistrictName: districts.find(
      (x) => x.Id.toString() === districtWatch?.toString()
    )?.Name,
  });

  const hasValue = !!districtWatch;
  const floating = open || hasValue;

  return (
  <Dropdown
    trigger={["click"]}
    dropdownRender={dropdownRender}
    open={open}
    onOpenChange={setOpen}
  >
    <div
      style={{
        position: "relative",
        border: `1px solid ${open ? token.colorPrimary : "#e5e5e5"}`,
        borderRadius: 10,
        padding: "8px 12px 8px 12px",
        cursor: "pointer",
        background: "#fff",
        transition: "border-color 0.2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 10,
          top: floating ? -8 : "50%",
          transform: floating ? "none" : "translateY(-50%)",
          background: floating ? "#fff" : "transparent",
          padding: floating ? "0 4px" : 0,
          fontSize: floating ? 12 : 14,
          color: open ? token.colorPrimary : "#595959",
          lineHeight: 1,
          transition: "all 0.2s",
          pointerEvents: "none",
        }}
      >
        Khu vực <span style={{ color: "#ff4d4f" }}>*</span>
      </span>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 24,
        }}
      >
        <Typography.Text
          type={!districtWatch ? "secondary" : undefined}
          ellipsis
          style={{ opacity: floating ? 1 : 0, transition: "opacity 0.2s" }}
        >
          {addressLabel || "Chọn"}
        </Typography.Text>
        <Typography.Text type="secondary">
          <DownOutlined />
        </Typography.Text>
      </div>
    </div>
  </Dropdown>
);
};