import {
  Button,
  Checkbox,
  Flex,
  Form,
  FormInstance,
  Input,
  Modal,
  Segmented,
  Select,
} from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ListFilterPlus, RotateCcw, X } from "lucide-react";
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
import { hasAdvancedFilters } from "./activeFilters";
import { HIDDEN_FIELDS } from "./config";
import "./property-filter.css";

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
          {mapMode ? (
            <Segmented
              className="property-trans-type-map-segmented"
              value={transTypeValue}
              options={[
                { label: "Mua bán", value: ETransType.sell },
                { label: "Cho thuê", value: ETransType.rent },
              ]}
              onChange={(value) => {
                form.setFieldValue("TransType", value);
                form.submit();
              }}
            />
          ) : (
            <Select
              className="property-trans-type-select"
              popupClassName="property-trans-type-dropdown"
              options={[
                { label: "Mua bán", value: ETransType.sell },
                { label: "Cho thuê", value: ETransType.rent },
              ]}
              onChange={() => form.submit()}
            />
          )}
        </Form.Item>

        <div className="property-search-combo">
          <div className="property-search-input-wrap">
            <AdvPropSearch
              form={form}
              placeholder={
                mapMode ? "Tìm kiếm bất động sản" : "Tìm kiếm bất động sản..."
              }
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
          style={{
            backgroundColor: "#0588f0",
            borderColor: "#0588f0",
            color: "#fff",
          }}
        >
          Tìm kiếm
        </Button>

        <Button
          htmlType="button"
          icon={mapMode ? <RotateCcw size={16} /> : <ReloadOutlined />}
          className="property-filter-reset-btn"
          style={{
            backgroundColor: "#fff",
            borderColor: "#0588f0",
            color: "#0588f0",
          }}
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

        {!mapMode && (
          <>
            <Form.Item className="property-field-item property-price-item">
              <PriceFilter form={form} />
            </Form.Item>

            <Form.Item className="property-field-item property-area-item">
              <FloatingField label="Diện tích">
                <AreaFilter form={form} adminMode />
              </FloatingField>
            </Form.Item>

            <Form.Item
              name="Direction"
              className="property-field-item property-direction-item"
            >
              <DirectionSelect mode="multiple" placeholder="Hướng" />
            </Form.Item>

            <div className="property-field-item property-proptype-item">
              <FloatingField label="Loại BĐS">
                <Form.Item name="PropTypeIds" noStyle>
                  <PropTypeSelect mode="multiple" placeholder="Loại BĐS" />
                </Form.Item>
              </FloatingField>
            </div>
          </>
        )}

        <Button
          htmlType="button"
          icon={mapMode ? <ListFilterPlus size={16} /> : <FilterOutlined />}
          className={`property-filter-more-btn ${mapMode && hasAdvancedFilters(model) ? "is-active" : ""} ${moreOpen ? "is-open" : ""}`}
          aria-expanded={moreOpen}
          aria-haspopup="dialog"
          style={{
            backgroundColor: "#fff",
            borderColor: "#0588f0",
            color: "#0588f0",
          }}
          onClick={() => setMoreOpen(true)}
        >
          Lọc thêm
        </Button>
      </div>

      <Modal
        title="Bộ lọc"
        forceRender={mapMode}
        open={moreOpen}
        onCancel={() => setMoreOpen(false)}
        centered
        width={384}
        className={`property-filter-more-modal ${mapMode ? "map-filter-more-modal" : ""}`}
        transitionName={mapMode ? "map-filter-modal" : undefined}
        closeIcon={
          <span style={{ color: "#0B172A", display: "flex", lineHeight: 1 }}>
            <X size={20} strokeWidth={2} />
          </span>
        }
        footer={
          <div className="property-filter-drawer-footer">
            <Button
              type="default"
              htmlType="button"
              className="property-filter-drawer-clear-btn"
              onClick={() => {
                handleRefresh();
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
          header: {
            borderBottom: "1px solid #EEF2F6",
            padding: "18px 20px 14px",
            background: "#fff",
          },
          body: { background: "#fff", padding: "12px 16px" },
          footer: {
            borderTop: "1px solid #EEF2F6",
            padding: "12px 16px 16px",
            background: "#fff",
          },
          content: {
            borderRadius: "16px",
            overflow: "hidden",
            padding: mapMode ? 0 : undefined,
          },
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
            <div className="property-drawer-form-item">
              <FloatingField label="Hướng nhà" required>
                <Form.Item name="Direction" noStyle>
                  <DirectionSelect mode="multiple" placeholder="Chọn" />
                </Form.Item>
              </FloatingField>
            </div>

            <div className="property-drawer-form-item">
              <FloatingField label="Pháp lý">
                <Form.Item name="Legal" noStyle>
                  <LawSelect placeholder="Chọn" allowClear />
                </Form.Item>
              </FloatingField>
            </div>

            <div className="property-drawer-form-item">
              <FloatingField label="Nội thất">
                <Form.Item name="FurnitureIds" noStyle>
                  <FurnitureSelect mode="multiple" placeholder="Chọn" />
                </Form.Item>
              </FloatingField>
            </div>

            <div className="property-drawer-form-item">
              <FloatingField label="Nhận diện khách hàng" required>
                <Form.Item name="CustomerType" noStyle>
                  <CustomerTypeSelect placeholder="Chọn" />
                </Form.Item>
              </FloatingField>
            </div>

            <div className="property-drawer-inline-row">
              <div className="property-drawer-form-item">
                <FloatingField label="Nhân viên" required>
                  <Form.Item name="UserAdminId" noStyle>
                    <UserAdminSelect placeholder="Chọn" />
                  </Form.Item>
                </FloatingField>
              </div>

              <div className="property-filter-more-date">
                <span className="property-filter-more-date-label">
                  Thời gian <i>*</i>
                </span>
                <DateFilter form={form} placeholderText="Chọn" />
              </div>
            </div>
          </div>

          <div className="property-filter-drawer-section property-filter-drawer-checklist">
            <AuctionCheckbox form={form} />
            <Form.Item
              name="IsMonopoly"
              valuePropName="checked"
              className="property-drawer-form-item property-drawer-checkbox-item"
            >
              <Checkbox>Độc quyền</Checkbox>
            </Form.Item>
          </div>
        </Flex>
      </Modal>
    </Flex>
  );
};
