import {
  Col,
  Divider,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const { Text } = Typography;
const { Option } = Select;

const areaData = [
  {
    id: 1,
    text: `Dưới 100`,
    areaFrom: 0,
    areaTo: 100,
  },
  {
    id: 2,
    text: "Từ 100 - 200",
    areaFrom: 100,
    areaTo: 200,
  },
  {
    id: 3,
    text: "Từ 200 - 300",
    areaFrom: 200,
    areaTo: 300,
  },
  {
    id: 4,
    text: "Từ 300 - 400",
    areaFrom: 300,
    areaTo: 400,
  },
];
// Admin property-list presets follow Figma's 50/100/200/300/500 m² bands.
const adminAreaData = [
  { id: 1, text: "Dưới 50", areaFrom: 0, areaTo: 50 },
  { id: 2, text: "Từ 50 - 100", areaFrom: 50, areaTo: 100 },
  { id: 3, text: "Từ 100 - 200", areaFrom: 100, areaTo: 200 },
  { id: 4, text: "Từ 200 - 300", areaFrom: 200, areaTo: 300 },
  { id: 5, text: "Từ 300 - 500", areaFrom: 300, areaTo: 500 },
  { id: 6, text: "Trên 500", areaFrom: 500, areaTo: undefined },
];
type Props = {
  form: FormInstance;
  mapMode?: boolean;
  adminMode?: boolean;
  placeholder?: string;
};
const colStyle = {
  xs: 24,
  lg: 12,
};
export const AreaFilter = ({ form, mapMode = false, adminMode = false, placeholder = "Diện tích" }: Props) => {
  const presetData = adminMode ? adminAreaData : areaData;
  const areaFrm = Form.useWatch("AreaFrm", form);
  const areaTo = Form.useWatch("AreaTo", form);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string>();

  const handleDropdownChange = (value: string) => {
    const item = presetData.find((x) => x.id.toString() === value.toString());
    form.setFieldValue("AreaFrm", item?.areaFrom);
    form.setFieldValue("AreaTo", item?.areaTo);
    // Ant Select closes after choosing an option; reopen after its internal
    // close event so the admin Figma panel keeps the manual fields and Apply
    // action visible with the selected preset.
    if (adminMode) window.requestAnimationFrame(() => setIsDropdownOpen(true));
  };

  useEffect(() => {
    // Update the displayed value
    let result;
    if (areaFrm && areaTo) {
      result = `Diện tích: ${areaFrm}-${areaTo} m2`;
    } else if (areaFrm) {
      result = `Diện tích: trên ${areaFrm} m2`;
    } else if (areaTo) {
      result = `Diện tích: dưới ${areaTo} m2`;
    }
    setSelectValue(result);
  }, [areaFrm, areaTo]);

  return (
    <Select
      style={{ width: "100%" }}
      open={isDropdownOpen}
      dropdownMatchSelectWidth={false}
      onChange={handleDropdownChange}
      onDropdownVisibleChange={setIsDropdownOpen}
      placeholder={placeholder}
      value={selectValue}
      // eslint-disable-next-line react/no-unstable-nested-components
      popupClassName={
        mapMode
          ? "admin-map-area-dropdown"
          : adminMode
            ? "property-admin-area-dropdown"
            : undefined
      }
      className={mapMode ? "admin-map-area-select" : undefined}
      dropdownRender={(menu) => mapMode ? (
        <div className="admin-map-area-content">
          <div className="admin-map-area-options">{menu}</div>
          <div className="admin-map-area-section">
            <strong>Diện tích</strong>
            <div className="admin-map-area-inputs">
              <label><span>Từ <i>*</i></span><Form.Item name="AreaFrm" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
              <label><span>Đến <i>*</i></span><Form.Item name="AreaTo" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
            </div>
          </div>
          <div className="admin-map-area-section">
            <strong>Diện tích sàn</strong>
            <div className="admin-map-area-inputs">
              <label><span>Từ <i>*</i></span><Form.Item name="FloorAreaFrm" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
              <label><span>Đến <i>*</i></span><Form.Item name="FloorAreaTo" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
            </div>
          </div>
          <div className="admin-map-area-section">
            <strong>Ngang (m) - Dài (m)</strong>
            <div className="admin-map-area-inputs">
              <label><span>Từ <i>*</i></span><Form.Item name="WidthFrm" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
              <label><span>Đến <i>*</i></span><Form.Item name="LengthFrm" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
            </div>
          </div>
          <div className="admin-map-area-footer">
            <Button type="button" variant="outline" onClick={() => form.resetFields(["AreaFrm", "AreaTo", "FloorAreaFrm", "FloorAreaTo", "WidthFrm", "LengthFrm"])}>
              <span className="property-drawer-reset-icon">↻</span>Đặt lại
            </Button>
            <Button type="button" onClick={() => { form.submit(); setIsDropdownOpen(false); }}>
              <span className="property-drawer-check-icon">✓</span>Áp dụng
            </Button>
          </div>
        </div>
      ) : adminMode ? (
        <div className="property-admin-area-content">
          <div className="property-admin-area-options">{menu}</div>
          <section className="property-admin-area-section">
            <strong>Diện tích</strong>
            <div className="property-admin-area-inputs">
              <label><span>Từ <i>*</i></span><Form.Item name="AreaFrm" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
              <label><span>Đến <i>*</i></span><Form.Item name="AreaTo" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
            </div>
          </section>
          <section className="property-admin-area-section">
            <strong>Diện tích sàn</strong>
            <div className="property-admin-area-inputs">
              <label><span>Từ <i>*</i></span><Form.Item name="FloorAreaFrm" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
              <label><span>Đến <i>*</i></span><Form.Item name="FloorAreaTo" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
            </div>
          </section>
          <section className="property-admin-area-section">
            <strong>Ngang (m) - Dài (m)</strong>
            <div className="property-admin-area-inputs">
              <label><span>Từ <i>*</i></span><Form.Item name="WidthFrm" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
              <label><span>Đến <i>*</i></span><Form.Item name="LengthFrm" noStyle><Input placeholder="Nhập" inputMode="numeric" /></Form.Item></label>
            </div>
          </section>
          <div className="property-admin-area-footer">
            <button
              type="button"
              className="property-admin-area-reset-btn"
              onClick={() => form.resetFields(["AreaFrm", "AreaTo", "FloorAreaFrm", "FloorAreaTo", "WidthFrm", "LengthFrm"])}
            >
              <span aria-hidden="true">↻</span>Đặt lại
            </button>
            <button
              type="button"
              className="property-admin-area-apply-btn"
              onClick={() => { form.submit(); setIsDropdownOpen(false); }}
            >
              <span aria-hidden="true">✓</span>Áp dụng
            </button>
          </div>
        </div>
      ) : (
        <Space direction="vertical" style={{ paddingInline: 8 }}>
          {menu}
          <Text strong>Diện tích</Text>
          <Space.Compact style={{ width: 265 }}>
            <Form.Item name="AreaFrm" noStyle>
              <Input placeholder="Từ" />
            </Form.Item>
            <Text style={{ marginInline: 10 }}>-</Text>
            <Form.Item name="AreaTo" noStyle>
              <Input placeholder="Đến" />
            </Form.Item>
          </Space.Compact>
          <Divider style={{ margin: 5 }} />
          <Text strong>Diện tích sàn</Text>
          <Space.Compact style={{ width: 265 }}>
            <Form.Item name="FloorAreaFrm" noStyle>
              <Input placeholder="Từ" />
            </Form.Item>
            <Text style={{ marginInline: 10 }}>-</Text>
            <Form.Item name="FloorAreaTo" noStyle>
              <Input placeholder="Đến" />
            </Form.Item>
          </Space.Compact>
          <Divider style={{ margin: 5 }} />
          <Text strong>Ngang (m) - Dài (m)</Text>
          <Space.Compact style={{ width: 265 }}>
            <Form.Item name="WidthFrm" noStyle>
              <Input placeholder="Ngang từ" />
            </Form.Item>
            <Text style={{ marginInline: 10 }}>-</Text>
            <Form.Item name="LengthFrm" noStyle>
              <Input placeholder="Dài từ" />
            </Form.Item>
          </Space.Compact>
          <Divider style={{ margin: 5 }} />
          <Row gutter={[12, 12]}>
            <Col {...colStyle}>
              <Button
                className="w-full"
                variant="outline"
                onClick={() =>
                  form.resetFields([
                    "AreaFrm",
                    "AreaTo",
                    "WidthFrm",
                    "LengthFrm",
                  ])
                }
              >
                Đặt lại
              </Button>
            </Col>
            <Col {...colStyle}>
              <Button className="w-full" onClick={() => form.submit()}>
                Áp dụng
              </Button>
            </Col>
          </Row>
        </Space>
      )}
    >
      {presetData.map((e) => (
        <Option key={e.id} value={e.id}>
          {e.text} m<sup>2</sup>
        </Option>
      ))}
    </Select>
  );
};
