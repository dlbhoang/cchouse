import {
  Button,
  Checkbox,
  Drawer,
  Flex,
  Form,
  FormInstance,
  Input,
  Select,
  Typography,
} from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState, type ReactNode } from "react";
import {
  AdvPropSearch,
  AreaFilter,
  DateFilter,
  PriceFilter,
} from "@/lib/components/shared/MyFormItem";
import {
  AddressSelectCustom,
  CustomerTypeSelect,
  DirectionSelect,
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
};

const FloatingField = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) => (
  <div className="property-floating-field">
    {children}
    <div className="property-floating-label">
      <Text className="property-floating-label-text">{label}</Text>
      {required && <Text className="property-floating-label-required">*</Text>}
    </div>
  </div>
);

export const DesktopView = ({
  form,
  model,
  handleRefresh,
}: DesktopViewProps) => {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <Flex vertical gap={16} className="property-filter-card">
      {HIDDEN_FIELDS.filter((e) => e !== "TransType").map((e) => (
        <Form.Item key={e} name={e} hidden>
          <Input />
        </Form.Item>
      ))}

      {/* Hàng 1: tìm kiếm + khu vực + trạng thái + actions */}
      <div className="property-filter-search-row">
        <div className="property-search-combo">
          <Form.Item name="TransType" className="property-trans-type-form-item">
            <Select
              className="property-trans-type-select"
              options={[
                { label: "Mua bán", value: ETransType.sell },
                { label: "Cho thuê", value: ETransType.rent },
              ]}
              onChange={() => form.submit()}
            />
          </Form.Item>

          <div className="property-search-input-wrap">
            <AdvPropSearch
              form={form}
              placeholder="Tìm kiếm bất động sản..."
              handleRefresh={handleRefresh}
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
        >
          Tìm kiếm
        </Button>

        <Button
          htmlType="button"
          icon={<ReloadOutlined />}
          className="property-filter-reset-btn"
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
          />
        </Form.Item>

        <Form.Item className="property-field-item property-price-item">
          <FloatingField label="Khoảng giá" required>
            <PriceFilter form={form} />
          </FloatingField>
        </Form.Item>

        <Form.Item className="property-field-item property-area-item">
          <FloatingField label="Diện tích" required>
            <AreaFilter form={form} />
          </FloatingField>
        </Form.Item>

        <Form.Item name="Direction" className="property-field-item">
          <FloatingField label="Hướng">
            <DirectionSelect mode="multiple" placeholder="Hướng" />
          </FloatingField>
        </Form.Item>

        <Form.Item name="PropTypeIds" className="property-field-item">
          <FloatingField label="Loại BĐS" required>
            <PropTypeSelect mode="multiple" placeholder="Loại BĐS" />
          </FloatingField>
        </Form.Item>

        <Button
          htmlType="button"
          icon={<FilterOutlined />}
          className="property-filter-more-btn"
          onClick={() => setMoreOpen(true)}
        >
          Lọc thêm
        </Button>
      </div>

      <Drawer
        title="Lọc thêm"
        placement="right"
        width={420}
        onClose={() => setMoreOpen(false)}
        open={moreOpen}
      >
        <Flex vertical gap={16}>
          <Form.Item name="CustomerType" label="Loại khách">
            <CustomerTypeSelect />
          </Form.Item>
          <Form.Item name="UserAdminId" label="Nhân viên">
            <UserAdminSelect />
          </Form.Item>
          <DateFilter form={form} />
          <Form.Item name="IsMonopoly" valuePropName="checked">
            <Checkbox>Độc quyền</Checkbox>
          </Form.Item>
          <Checkbox
            checked={Number(model?.CustomerType) === 6}
            onChange={(e) => {
              form.setFieldValue("CustomerType", e.target.checked ? 6 : undefined);
            }}
          >
            Đấu giá
          </Checkbox>
          <Button type="primary" htmlType="submit" onClick={() => setMoreOpen(false)}>
            Áp dụng
          </Button>
        </Flex>
      </Drawer>
    </Flex>
  );
};
