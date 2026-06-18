import {
  Flex,
  Form,
  FormInstance,
  Input,
  Button,
  Select,
  Typography,
} from "antd";
import {
  AdvPropSearch,
  AreaFilter,
  PriceFilter,
} from "@/lib/components/shared/MyFormItem";
import {
  AddressSelectCustom,
  LocationSelectCustom,
  PropTypeSelect,
  TransStatusSelect,
} from "@/lib/components/shared/MySelect";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { ETransType } from "@/lib/core/enum";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { HIDDEN_FIELDS } from "./config";
import type { ReactNode } from "react";

const { Text } = Typography;

type DesktopViewProps = {
  form: FormInstance<IPropAdminOpts>;
  model: IPropAdminOpts;
  handleRefresh: () => void;
};

/** Wrapper tạo floating label giống Figma */
const FloatingField = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) => (
  <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
    {children}
    <div
      style={{
        position: "absolute",
        top: -8,
        left: 12,
        background: "#fff",
        paddingInline: 4,
        display: "flex",
        alignItems: "center",
        gap: 2,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <Text style={{ fontSize: 11, color: "#a1a1aa", lineHeight: 1 }}>
        {label}
      </Text>
      {required && (
        <Text style={{ fontSize: 10, color: "#ef4444", lineHeight: 1 }}>
          *
        </Text>
      )}
    </div>
  </div>
);

export const DesktopView = ({
  form,
  model,
  handleRefresh,
}: DesktopViewProps) => {
  return (
    <Flex vertical gap={16}>
      {HIDDEN_FIELDS.map((e) => (
        <Form.Item key={e} name={e} hidden>
          <Input />
        </Form.Item>
      ))}

      {/* Row 1 - search-top */}
      <Flex
        align="center"
        gap={16}
        style={{
          padding: "16px 8px 10px",
          borderRadius: 10,
          border: "1px solid #e5e5e5",
        }}
      >
        {/* Trái: Mua bán + Search input */}
        <Flex align="center" gap={16} style={{ flex: 1 }}>
  <div style={{ width: 120 }}>
  <div
    style={{
      position: "relative",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "0 12px",
      background: "#fff",
      height: 40,
      display: "flex",
      alignItems: "center",
    }}
  >
    <Form.Item name="TransType" style={{ marginBottom: 0, width: "100%" }}>
      <Select
        className="trans-type-select"
        options={[
          { label: "Mua bán", value: ETransType.sell },
          { label: "Cho thuê", value: ETransType.rent },
        ]}
        variant="borderless"
      />
    </Form.Item>
  </div>

  <style jsx global>{`
    .trans-type-select {
      width: 100%;
    }
    .trans-type-select .ant-select-selector {
      height: 38px !important;
      border-radius: 0 !important;
      border: none !important;
      background: transparent !important;
      padding: 0 !important;
      box-shadow: none !important;
      display: flex;
      align-items: center;
    }
    .trans-type-select.ant-select-single .ant-select-selector {
      display: flex;
      align-items: center;
    }
    .trans-type-select .ant-select-selection-item {
      line-height: 38px !important;
      font-size: 14px;
      font-weight: 400 !important;
      color: #262626;
    }
    .trans-type-select .ant-select-arrow {
      color: #6b7280;
      font-size: 11px;
    }
    .trans-type-select.ant-select-focused .ant-select-selector {
      box-shadow: none !important;
    }
  `}</style>
</div>

          <div style={{ flex: 1 }}>
            <AdvPropSearch
              form={form}
              placeholder="Tìm kiếm bất động sản..."
              handleRefresh={handleRefresh}
            />
          </div>
        </Flex>

        {/* Phải: Khu vực + Trạng thái + Tìm kiếm (không dùng FloatingField, giống HTML) */}
        <Flex align="center" gap={8}>
          <div style={{ width: 192 }}>
            <Form.Item style={{ marginBottom: 0 }}>
              <AddressSelectCustom
                form={form}
                nameProvince="ProvinceId"
                nameDistrict="DistrictId"
                nameWard="WardId"
                nameStreet="StreetId"
                nameAddressNumber="AddressNumber"
              />
            </Form.Item>
          </div>

          <div style={{ width: 192 }}>
            <Form.Item name="Status" style={{ marginBottom: 0 }}>
              <TransStatusSelect
                mode="multiple"
                transType={model?.TransType || ETransType.sell}
              />
            </Form.Item>
          </div>

          <Button
            type="primary"
            icon={<SearchOutlined />}
            style={{
              borderRadius: 10,
              fontWeight: 500,
              height: 40,
              paddingInline: 16,
              flexShrink: 0,
            }}
            onClick={handleRefresh}
          >
            Tìm kiếm
          </Button>
        </Flex>
      </Flex>

      {/* Row 2 - filters (giữ nguyên FloatingField) */}
      <Flex align="center" gap={8}>
        <Flex align="center" gap={8} style={{ flex: 1 }}>
          <div style={{ flex: 1 }}>
            <FloatingField label="Vị trí" required>
              <Form.Item style={{ marginBottom: 0 }}>
                <LocationSelectCustom
                  form={form}
                  locationName="Location"
                  locationFeatureName="LocationFeature"
                />
              </Form.Item>
            </FloatingField>
          </div>

          <div style={{ flex: 1 }}>
            <FloatingField label="Khoảng giá" required>
              <Form.Item style={{ marginBottom: 0 }}>
                <PriceFilter form={form} />
              </Form.Item>
            </FloatingField>
          </div>

          <div style={{ flex: 1 }}>
            <FloatingField label="Diện tích" required>
              <Form.Item style={{ marginBottom: 0 }}>
                <AreaFilter form={form} />
              </Form.Item>
            </FloatingField>
          </div>

          <div style={{ flex: 1 }}>
            <FloatingField label="Loại BĐS" required>
              <Form.Item name="PropTypeIds" style={{ marginBottom: 0 }}>
                <PropTypeSelect mode="multiple" />
              </Form.Item>
            </FloatingField>
          </div>
        </Flex>

        <Button
          icon={<FilterOutlined style={{ color: "#3b82f6" }} />}
          style={{
            borderColor: "#3b82f6",
            color: "#3b82f6",
            borderRadius: 10,
            fontWeight: 500,
            height: 40,
            paddingInline: 16,
            flexShrink: 0,
          }}
        >
          Lọc thêm
        </Button>
      </Flex>
    </Flex>
  );
};