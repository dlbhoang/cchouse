import {
  Button,
  Checkbox,
  Flex,
  Form,
  FormInstance,
  Input,
  Modal,
  Select,
  Typography,
} from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import {
  AdvPropSearch,
  AreaFilter,
  AuctionCheckbox,
  CountRangeFilter,
  DateFilter,
  FloatingField,
  PriceFilter,
} from "@/lib/components/shared/MyFormItem";
import {
  AddressSelectCustom,
  CustomerTypeSelect,
  DirectionSelect,
  FurnitureSelect,
  LawSelect,
  LocationSelectCustom,
  PropTypeSelect,
  TransStatusSelect,
  UserAdminSelect,
} from "@/lib/components/shared/MySelect";
import { ETransType } from "@/lib/core/enum";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { HIDDEN_FIELDS } from "./config";
import "./property-filter.css";

const { Text } = Typography;

type DesktopViewProps = {
  form: FormInstance<IPropAdminOpts>;
  model: IPropAdminOpts;
  handleRefresh: () => void;
  mapMode?: boolean;
};

export const DesktopView = ({
  form,
  model,
  handleRefresh,
  mapMode = false,
}: DesktopViewProps) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const transTypeValue = Form.useWatch("TransType", form) ?? ETransType.sell;

  return (
    <Flex vertical gap={16} className="property-filter-card">
      {HIDDEN_FIELDS.filter((e) => e !== "TransType").map((e) => (
        <Form.Item key={e} name={e} hidden>
          <Input />
        </Form.Item>
      ))}

      {/* Hàng 1: tìm kiếm + khu vực + trạng thái + actions */}
      <div className="property-filter-search-row">
        <Form.Item name="TransType" className="property-trans-type-form-item">
          <Select
            className="property-trans-type-select"
            popupClassName="property-trans-type-dropdown"
            options={[
              { label: "Mua bán", value: ETransType.sell },
              { label: "Cho thuê", value: ETransType.rent },
            ]}
            onChange={() => form.submit()}
          />
        </Form.Item>

        <div className="property-search-combo">
          <div className="property-search-input-wrap">
            <AdvPropSearch
              form={form}
              placeholder={mapMode ? "Tìm kiếm bất động sản" : "Tìm kiếm bất động sản..."}
              handleRefresh={handleRefresh}
              showVoice={!mapMode}
            />
          </div>
        </div>

        <div className="property-region-field">
          <AddressSelectCustom
            form={form}
            nameProvince="ProvinceId"
            nameDistrict="DistrictId"
            nameWard="WardId"
            nameStreet="StreetId"
            nameAddressNumber="AddressNumber"
            mapMode={mapMode}
          />
        </div>

        <FloatingField label="Trạng thái" required>
          <Form.Item name="Status" className="property-status-form-item">
            <TransStatusSelect
              mode="multiple"
              transType={model?.TransType || ETransType.sell}
              placeholder="Trạng thái"
              allowClear
            />
          </Form.Item>
        </FloatingField>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SearchOutlined />}
          className="property-filter-search-btn"
          style={{ backgroundColor: "#0588f0", borderColor: "#0588f0", color: "#fff" }}
        >
          Tìm kiếm
        </Button>

        <Button
          htmlType="button"
          icon={<ReloadOutlined />}
          className="property-filter-reset-btn"
          style={{ backgroundColor: "#fff", borderColor: "#0588f0", color: "#0588f0" }}
          onClick={handleRefresh}
          aria-label="Làm mới bộ lọc"
        />
      </div>

      {/* Hàng 2 */}
      <div className="property-filter-row">
        <Form.Item className="property-field-item property-location-item">
          <LocationSelectCustom
            form={form}
            locationName="Location"
            locationFeatureName="LocationFeature"
            mapMode={mapMode}
          />
        </Form.Item>

        <Form.Item className="property-field-item property-price-item">
  <PriceFilter form={form} />
</Form.Item>

        <Form.Item className="property-field-item property-area-item">
          {mapMode ? (
            <AreaFilter form={form} mapMode />
          ) : (
          <FloatingField label="Diện tích">
              <AreaFilter form={form} adminMode />
          </FloatingField>
          )}
        </Form.Item>

        {!mapMode && (
          <Form.Item name="Direction" className="property-field-item property-direction-item">
            <DirectionSelect mode="multiple" placeholder="Hướng" />
          </Form.Item>
        )}

        <Form.Item name="PropTypeIds" className="property-field-item property-proptype-item">
          <FloatingField label="Loại BĐS">
            <PropTypeSelect mode="multiple" placeholder="Loại BĐS" />
          </FloatingField>
        </Form.Item>

        <Button
          htmlType="button"
          icon={<FilterOutlined />}
          className="property-filter-more-btn"
          style={{ backgroundColor: "#fff", borderColor: "#0588f0", color: "#0588f0" }}
          onClick={() => setMoreOpen(true)}
        >
          Lọc thêm
        </Button>
      </div>

      <Modal
        title="Bộ lọc"
        open={moreOpen}
        onCancel={() => setMoreOpen(false)}
        centered
        width={384}
        className="property-filter-more-modal"
        closeIcon={<span style={{ color: "#0B172A", fontSize: 20, lineHeight: 1 }}>×</span>}
        footer={
          <div className="property-filter-drawer-footer">
            <Button
              type="default"
              htmlType="button"
              className="property-filter-drawer-clear-btn"
              onClick={() => {
                form.resetFields();
                setMoreOpen(false);
              }}
            >
              <span className="property-drawer-reset-icon">↺</span>
              Đặt lại
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="property-filter-drawer-apply-btn"
              onClick={() => {
                form.submit();
                setMoreOpen(false);
              }}
            >
              <span className="property-drawer-check-icon">✓</span>
              Áp dụng
            </Button>
          </div>
        }
        styles={{
          header: { borderBottom: "1px solid #EEF2F6", padding: "18px 20px 14px", background: "#fff" },
          body: { background: "#fff", padding: "12px 16px" },
          footer: { borderTop: "1px solid #EEF2F6", padding: "12px 16px 16px", background: "#fff" },
          content: { borderRadius: "16px", overflow: "hidden" },
        }}
      >
        <Flex vertical gap={16} className="property-filter-more-body">
          <div className="property-filter-drawer-toggle">
            <button
              type="button"
              className={transTypeValue === ETransType.sell ? "active" : ""}
              onClick={() => form.setFieldValue("TransType", ETransType.sell)}
            >
              Tìm mua
            </button>
            <button
              type="button"
              className={transTypeValue === ETransType.rent ? "active" : ""}
              onClick={() => form.setFieldValue("TransType", ETransType.rent)}
            >
              Tìm thuê
            </button>
          </div>

          <div className="property-filter-drawer-section">
            <CountRangeFilter
              form={form}
              label="Số tầng"
              nameFrm="FloorFrm"
              nameTo="FloorTo"
            />
            <CountRangeFilter
              form={form}
              label="Số phòng ngủ"
              nameFrm="BedroomFrm"
              nameTo="BedroomTo"
            />
            <CountRangeFilter
              form={form}
              label="Số phòng tắm, vệ sinh"
              nameFrm="BathroomFrm"
              nameTo="BathroomTo"
            />
          </div>

          <div className="property-filter-drawer-section">
            <Form.Item name="Direction" className="property-drawer-form-item">
              <FloatingField label="Hướng nhà" required>
                <DirectionSelect mode="multiple" placeholder="Chọn" />
              </FloatingField>
            </Form.Item>

            <Form.Item name="Legal" className="property-drawer-form-item">
              <FloatingField label="Pháp lý">
                <LawSelect placeholder="Chọn" allowClear />
              </FloatingField>
            </Form.Item>

            <Form.Item name="FurnitureIds" className="property-drawer-form-item">
              <FloatingField label="Nội thất">
                <FurnitureSelect mode="multiple" placeholder="Chọn" />
              </FloatingField>
            </Form.Item>

            <Form.Item name="CustomerType" className="property-drawer-form-item">
              <FloatingField label="Nhận diện khách hàng" required>
                <CustomerTypeSelect placeholder="Chọn" />
              </FloatingField>
            </Form.Item>

            <div className="property-drawer-inline-row">
              <Form.Item name="UserAdminId" className="property-drawer-form-item">
                <FloatingField label="Nhân viên" required>
                  <UserAdminSelect placeholder="Chọn" />
                </FloatingField>
              </Form.Item>

              <div className="property-filter-more-date">
                <span className="property-filter-more-date-label">Thời gian <i>*</i></span>
                <DateFilter form={form} placeholderText="Chọn" />
              </div>
            </div>
          </div>

          <div className="property-filter-drawer-section property-filter-drawer-checklist">
            <AuctionCheckbox form={form} />
            <Form.Item name="IsMonopoly" valuePropName="checked" className="property-drawer-form-item property-drawer-checkbox-item">
              <Checkbox>Độc quyền</Checkbox>
            </Form.Item>
          </div>
        </Flex>
      </Modal>
    </Flex>
  );
};
