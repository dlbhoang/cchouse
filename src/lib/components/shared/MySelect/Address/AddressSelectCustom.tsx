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
import { ChevronDown, X } from "lucide-react";
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
  mapMode?: boolean;
  /** Keep the address mode toggle while hiding fields irrelevant to region-only filters. */
  hideParcelFields?: boolean;
  triggerClassName?: string;
  triggerPlaceholder?: string;
  agencyManagerMode?: boolean;
  inline?: boolean;
  onApply?: () => void;
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
  mapMode = false,
  hideParcelFields = false,
  triggerClassName,
  triggerPlaceholder,
  agencyManagerMode = false,
  inline = false,
  onApply,
}: Props) => {
  const { districts, propType } = useAdminContext();
  const provinceWatch = Form.useWatch(nameProvince, form);
  const districtWatch = Form.useWatch(nameDistrict, form);
  const wardWatch = Form.useWatch(nameWard, form);
  const streetWatch = Form.useWatch(nameStreet, form);
  const addressWatch = Form.useWatch(nameAddressNumber, form);
  const parcelWatch = Form.useWatch(nameLandParcel, form);
  const mapSheetWatch = Form.useWatch(nameMapSheet, form);
  const isNewAddressWatch = Form.useWatch(nameIsNewAddress, form);
  const selectedPropTypeIds = Form.useWatch("PropTypeIds", form);
  const selectedPropTypeIdList = Array.isArray(selectedPropTypeIds)
    ? selectedPropTypeIds
    : typeof selectedPropTypeIds === "string"
      ? selectedPropTypeIds.split(",").filter(Boolean)
      : selectedPropTypeIds == null
      ? []
      : [selectedPropTypeIds];
  const isLandSelected = selectedPropTypeIdList.some((id) =>
    propType
      .find((item) => item.Id === Number(id))
      ?.Name?.toLowerCase()
      .includes("đất")
  );
  const [wardName, setWardName] = useState<string>();
  const [streetName, setStreetName] = useState<string>();
  const [open, setOpen] = useState(false);

  // Địa chỉ mới sau sáp nhập: bỏ cấp Quận/Huyện, Phường/Xã & Đường/Phố tra theo Tỉnh/Thành.
  const wardParentVal = isNewAddressWatch ? provinceWatch : districtWatch;
  const streetParentVal = isNewAddressWatch ? provinceWatch : districtWatch;

  const handleApply = () => {
    form.submit();
    setOpen(false);
    onApply?.();
  };

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
    <div
      className={`property-address-dropdown-panel ${
        mapMode ? "map-address-dropdown-panel" : ""
      } ${agencyManagerMode ? "agency-manager-address-dropdown-panel" : ""}`}
    >
      {agencyManagerMode && (
        <div className="agency-manager-address-dropdown-header">
          <span>Khu vực</span>
          <button
            type="button"
            aria-label="Đóng khu vực"
            onClick={() => setOpen(false)}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
      )}
      <div className={mapMode ? "map-address-dropdown-body" : "property-address-dropdown-body"}>
        {!mapMode && (
          <div className="property-address-dropdown-toggle">
            <span className="property-address-dropdown-toggle-label">
              Tìm theo địa chỉ mới sau sáp nhập
            </span>
            <Form.Item name={nameIsNewAddress} valuePropName="checked" noStyle>
              <Switch
                size="small"
                checked={isNewAddressWatch}
                onChange={(value) => {
                  form.setFieldsValue({ [nameIsNewAddress]: value, [nameDistrict]: undefined, [nameWard]: undefined, [nameStreet]: undefined });
                }}
              />
            </Form.Item>
          </div>
        )}

        <AddressField label="Tỉnh/Thành phố">
          <Form.Item name={nameProvince} className="property-address-field-item" noStyle>
            <ProvinceSelect
              value={provinceWatch}
              className="property-address-field-select"
              popupClassName="property-address-options"
              getPopupContainer={inline ? (trigger) => trigger.parentElement! : undefined}
              allowClear={false}
              suffixIcon={<ChevronDown size={16} strokeWidth={1.8} />}
              placeholder={mapMode ? "" : "Chọn"}
              onChange={(value) => { form.setFieldsValue({ [nameProvince]: value, [nameDistrict]: undefined, [nameWard]: undefined, [nameStreet]: undefined }); }}
            />
          </Form.Item>
        </AddressField>

        {!isNewAddressWatch && (
          <AddressField label="Quận/Huyện">
            <Form.Item name={nameDistrict} className="property-address-field-item" noStyle>
              <DistrictSelect
                value={districtWatch}
                className="property-address-field-select"
              popupClassName="property-address-options"
              getPopupContainer={inline ? (trigger) => trigger.parentElement! : undefined}
                allowClear={false}
                suffixIcon={<ChevronDown size={16} strokeWidth={1.8} />}
                placeholder={mapMode ? "" : "Chọn"}
                parentVal={provinceWatch}
                onChange={(value) => { form.setFieldsValue({ [nameDistrict]: value, [nameWard]: undefined, [nameStreet]: undefined }); }}
              />
            </Form.Item>
          </AddressField>
        )}

        <AddressField label="Phường/Xã">
          <Form.Item name={nameWard} className="property-address-field-item" noStyle>
            <WardSelect
              value={wardWatch}
              className="property-address-field-select"
              popupClassName="property-address-options"
              getPopupContainer={inline ? (trigger) => trigger.parentElement! : undefined}
              allowClear={false}
              suffixIcon={<ChevronDown size={16} strokeWidth={1.8} />}
              placeholder={mapMode ? "" : "Chọn"}
              parentVal={wardParentVal}
              isNew={isNewAddressWatch}
              onChange={(value) => { form.setFieldsValue({ [nameWard]: value, [nameStreet]: undefined }); }}
            />
          </Form.Item>
        </AddressField>

        <AddressField label="Đường/Phố">
          <Form.Item name={nameStreet} className="property-address-field-item" noStyle>
            <StreetSelect
              value={streetWatch}
              onChange={(value) => form.setFieldValue(nameStreet, value)}
              className="property-address-field-select"
              popupClassName="property-address-options"
              getPopupContainer={inline ? (trigger) => trigger.parentElement! : undefined}
              allowClear={false}
              suffixIcon={<ChevronDown size={16} strokeWidth={1.8} />}
              placeholder={mapMode ? "" : "Chọn"}
              parentVal={streetParentVal}
              isNew={isNewAddressWatch}
            />
          </Form.Item>
        </AddressField>

        {(!isHiddenField || agencyManagerMode) && !isLandSelected && (
          <AddressField label="Số nhà">
            <Form.Item name={nameAddressNumber} className="property-address-field-item" noStyle>
              <Input value={addressWatch} onChange={(event) => form.setFieldValue(nameAddressNumber, event.target.value)} className="property-address-field-input" placeholder={mapMode ? "" : "Nhập"} />
            </Form.Item>
          </AddressField>
        )}

        {!mapMode && !hideParcelFields && (
          <Row gutter={12}>
            <Col span={12}>
              <AddressField label="Thửa đất">
                <Form.Item name={nameLandParcel} className="property-address-field-item" noStyle>
                  <Input value={parcelWatch} onChange={(event) => form.setFieldValue(nameLandParcel, event.target.value)} className="property-address-field-input" placeholder="Nhập" />
                </Form.Item>
              </AddressField>
            </Col>
            <Col span={12}>
              <AddressField label="Tờ bản đồ">
                <Form.Item name={nameMapSheet} className="property-address-field-item" noStyle>
                  <Input value={mapSheetWatch} onChange={(event) => form.setFieldValue(nameMapSheet, event.target.value)} className="property-address-field-input" placeholder="Nhập" />
                </Form.Item>
              </AddressField>
            </Col>
          </Row>
        )}
      </div>

      <div
        className="property-address-dropdown-footer"
        style={
          mapMode || agencyManagerMode
            ? undefined
            : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }
        }
      >
        <Button
          block
          htmlType="button"
          className="property-filter-drawer-clear-btn"
          style={!mapMode ? { width: "100%", minWidth: 0 } : undefined}
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
          <img src="/assets/admin/filter-reset.svg" alt="" aria-hidden="true" className="property-address-action-icon" />
          Đặt lại
        </Button>
        {mapMode || agencyManagerMode ? (
          <Button
            block
            type="primary"
            htmlType="button"
            className={`property-filter-drawer-apply-btn ${
              mapMode ? "map-address-apply" : "agency-manager-address-apply"
            }`}
            onClick={handleApply}
          >
            <img src="/assets/admin/filter-apply.svg" alt="" aria-hidden="true" className="property-address-action-icon" />
            Áp dụng
          </Button>
        ) : (
          <button
            type="button"
            className="property-admin-address-apply-btn"
            style={{
              width: "100%",
              minWidth: 0,
              background: "#0588f0",
              backgroundColor: "#0588f0",
              borderColor: "#0588f0",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={handleApply}
          >
            <img src="/assets/admin/filter-apply.svg" alt="" aria-hidden="true" className="property-address-action-icon" />
            Áp dụng
          </button>
        )}
      </div>
    </div>
  );

  if (inline) return dropdownRender();

  return (
    <Dropdown
      trigger={["click"]}
      transitionName={mapMode ? "map-filter-popup" : undefined}
      dropdownRender={dropdownRender}
      overlayClassName={
        mapMode
          ? "map-address-dropdown"
          : agencyManagerMode
            ? "agency-manager-address-dropdown"
            : "property-admin-address-dropdown"
      }
      open={open}
      onOpenChange={setOpen}
    >
      <button
        type="button"
        style={{ textAlign: "left" }}
        aria-label="Khu vực"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`property-custom-dropdown-trigger ${mapMode ? "property-map-region-trigger" : ""} ${triggerClassName ?? ""} ${open ? "is-open" : ""} ${
          addressLabel ? "has-value" : ""
        }`}
      >
        <span className="property-custom-dropdown-label">Khu vực</span>
        <Typography.Text ellipsis className="property-custom-dropdown-value">
          {addressLabel || triggerPlaceholder || (mapMode ? "Chọn khu vực" : "")}
        </Typography.Text>
        <ChevronDown
          className="property-custom-dropdown-arrow"
          size={16}
          strokeWidth={1.8}
        />
      </button>
    </Dropdown>
  );
};
