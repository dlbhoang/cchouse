import { DownOutlined } from "@ant-design/icons";
import "./address-select-custom.css";
import {
  Button,
  Col,
  Dropdown,
  Form,
  type FormInstance,
  Input,
  Row,
  Switch,
  Typography,
} from "antd";
import { type ReactNode, useEffect, useState } from "react";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";
import { DistrictSelect } from "./DistrictSelect";
import { ProvinceSelect } from "./ProvinceSelect";
import { StreetSelect } from "./StreetSelect";
import { WardSelect } from "./WardSelect";

type AddressFieldProps = {
  label: string;
  children: ReactNode;
};

/** Khối label-trên / ô-dưới dùng riêng cho panel Khu vực (không phụ thuộc FloatingField). */
const AddressField = ({ label, children }: AddressFieldProps) => (
  <div className="property-address-field">
    <div className="property-address-field-label">
      {label} <span className="property-address-field-required">*</span>
    </div>
    {children}
  </div>
);

type Props = {
  form: FormInstance;
  nameProvince: string;
  nameDistrict: string;
  nameWard: string;
  nameStreet: string;
  nameAddressNumber: string;
  isHiddenField?: boolean;
  /** Tên field (Form) cho toggle "Tìm theo địa chỉ mới sau sáp nhập". */
  nameIsNewAddress?: string;
  /** Tên field (Form) cho ô "Thửa đất". */
  nameLandParcel?: string;
  /** Tên field (Form) cho ô "Tờ bản đồ". */
  nameMapSheet?: string;
};

export const AddressSelectCustom = ({
  form,
  nameProvince,
  nameDistrict,
  nameWard,
  nameStreet,
  nameAddressNumber,
  isHiddenField,
  nameIsNewAddress = "IsNewAddress",
  nameLandParcel = "LandParcelNumber",
  nameMapSheet = "MapSheetNo",
}: Props) => {
  const { districts } = useAdminContext();
  const provinceWatch = Form.useWatch(nameProvince, form);
  const districtWatch = Form.useWatch(nameDistrict, form);
  const wardWatch = Form.useWatch(nameWard, form);
  const streetWatch = Form.useWatch(nameStreet, form);
  const addressWatch = Form.useWatch(nameAddressNumber, form);
  const isNewAddressWatch = Form.useWatch(nameIsNewAddress, form);
  const [wardName, setWardName] = useState<string>();
  const [streetName, setStreetName] = useState<string>();
  const [open, setOpen] = useState(false);

  // Địa chỉ mới sau sáp nhập: bỏ cấp Quận/Huyện, Phường/Xã & Đường/Phố tra theo Tỉnh/Thành.
  const wardParentVal = isNewAddressWatch ? provinceWatch : districtWatch;
  const streetParentVal = isNewAddressWatch ? provinceWatch : districtWatch;

  const handleApply = () => form.submit();

  useEffect(() => {
    if (!wardWatch) return setWardName(undefined);
    wardApi.getById(wardWatch).then((result) => setWardName(result.data.Name));
  }, [wardWatch]);

  useEffect(() => {
    if (!streetWatch) return setStreetName(undefined);
    streetApi.getById(streetWatch).then((result) => setStreetName(result.data.Name));
  }, [streetWatch]);

  useEffect(() => {
    if (!wardParentVal) {
      setWardName(undefined);
      setStreetName(undefined);
    }
  }, [wardParentVal]);

  const addressLabel = CombineAddress({
    AddressNumber: addressWatch,
    StreetName: streetName,
    WardName: wardName,
    DistrictName: districts.find(
      (x) => x.Id.toString() === districtWatch?.toString()
    )?.Name,
  });

  const dropdownRender = () => (
    <div className="property-address-dropdown-panel">
      <div className="property-address-dropdown-toggle">
        <span className="property-address-dropdown-toggle-label">
          Tìm theo địa chỉ mới sau sáp nhập
        </span>
        <Form.Item name={nameIsNewAddress} valuePropName="checked" noStyle>
          <Switch
            size="small"
            onChange={() =>
              form.resetFields([nameDistrict, nameWard, nameStreet])
            }
          />
        </Form.Item>
      </div>

      <AddressField label="Tỉnh/Thành phố">
        <Form.Item name={nameProvince} className="property-address-field-item" noStyle>
          <ProvinceSelect
            className="property-address-field-select"
            allowClear={false}
            suffixIcon={<DownOutlined />}
            placeholder="Chọn"
            onChange={() => form.resetFields([nameDistrict, nameWard, nameStreet])}
          />
        </Form.Item>
      </AddressField>

      {!isNewAddressWatch && (
        <AddressField label="Quận/Huyện">
          <Form.Item name={nameDistrict} className="property-address-field-item" noStyle>
            <DistrictSelect
              className="property-address-field-select"
              allowClear={false}
              suffixIcon={<DownOutlined />}
              placeholder="Chọn"
              parentVal={provinceWatch}
              onChange={() => form.resetFields([nameWard, nameStreet])}
            />
          </Form.Item>
        </AddressField>
      )}

      <AddressField label="Phường/Xã">
        <Form.Item name={nameWard} className="property-address-field-item" noStyle>
          <WardSelect
            className="property-address-field-select"
            allowClear={false}
            suffixIcon={<DownOutlined />}
            placeholder="Chọn"
            parentVal={wardParentVal}
            isNew={isNewAddressWatch}
            onChange={() => form.resetFields([nameStreet])}
          />
        </Form.Item>
      </AddressField>

      <AddressField label="Đường/Phố">
        <Form.Item name={nameStreet} className="property-address-field-item" noStyle>
          <StreetSelect
            className="property-address-field-select"
            allowClear={false}
            suffixIcon={<DownOutlined />}
            placeholder="Chọn"
            parentVal={streetParentVal}
            isNew={isNewAddressWatch}
          />
        </Form.Item>
      </AddressField>

      {!isHiddenField && (
        <AddressField label="Số nhà">
          <Form.Item name={nameAddressNumber} className="property-address-field-item" noStyle>
            <Input className="property-address-field-input" placeholder="Nhập" />
          </Form.Item>
        </AddressField>
      )}

      <Row gutter={12}>
        <Col span={12}>
          <AddressField label="Thửa đất">
            <Form.Item name={nameLandParcel} className="property-address-field-item" noStyle>
              <Input className="property-address-field-input" placeholder="Nhập" />
            </Form.Item>
          </AddressField>
        </Col>
        <Col span={12}>
          <AddressField label="Tờ bản đồ">
            <Form.Item name={nameMapSheet} className="property-address-field-item" noStyle>
              <Input className="property-address-field-input" placeholder="Nhập" />
            </Form.Item>
          </AddressField>
        </Col>
      </Row>

      <div className="property-address-dropdown-footer">
        <Button
          block
          htmlType="button"
          className="property-filter-drawer-clear-btn"
          onClick={() => {
            form.resetFields([
              nameProvince,
              nameDistrict,
              nameWard,
              nameStreet,
              nameAddressNumber,
              nameLandParcel,
              nameMapSheet,
            ]);
            setStreetName(undefined);
            setWardName(undefined);
            handleApply();
          }}
        >
          <span className="property-drawer-reset-icon">↺</span>
          Đặt lại
        </Button>
        <Button
          block
          type="primary"
          htmlType="button"
          className="property-filter-drawer-apply-btn"
          onClick={handleApply}
        >
          <span className="property-drawer-check-icon">✓</span>
          Áp dụng
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown trigger={["click"]} dropdownRender={dropdownRender} open={open} onOpenChange={setOpen}>
      <div
        className={`property-custom-dropdown-trigger ${open ? "is-open" : ""} ${
          addressLabel ? "has-value" : ""
        }`}
      >
        <span className="property-custom-dropdown-label">
          Khu vực <span>*</span>
        </span>
        <Typography.Text ellipsis className="property-custom-dropdown-value">
          {addressLabel || ""}
        </Typography.Text>
        <DownOutlined className="property-custom-dropdown-arrow" />
      </div>
    </Dropdown>
  );
};