import { ChevronDown } from "lucide-react";
import {
  Button,
  Col,
  Checkbox,
  Dropdown,
  Form,
  FormInstance,
  Radio,
  Row,
  theme,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

import { useAdminContext } from "@/lib/stored";

const { useToken } = theme;

type Props = {
  form: FormInstance;
  locationName: string;
  locationFeatureName: string;
  multipleFeatures?: boolean;
  mapMode?: boolean;
};
export const LocationSelectCustom = ({
  form,
  locationName,
  locationFeatureName,
  multipleFeatures = false,
  mapMode = false,
}: Props) => {
  const { enumList } = useAdminContext();

  const locationWatch = Form.useWatch("Location", form);
  const locationFeatureWatch = Form.useWatch(locationFeatureName, form);

  const [location, setLocation] = useState<string>();
  const [feature, setFeature] = useState<string>();
  const [open, setOpen] = useState(false);
  const handleApply = () => {
    form.submit();
  };

  const colStyle = {
    xs: 24,
    lg: 12,
  };

  const { token } = useToken();

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    width: 304,
    padding: 16,
  };

  const dropdownRender = () => (
    <div
      className={
        mapMode
          ? "map-location-dropdown-content"
          : "property-location-dropdown-content"
      }
      style={mapMode ? undefined : contentStyle}
    >
      <Typography.Text strong>Vị trí</Typography.Text>
      <Form.Item name={locationName} className={mapMode ? "map-location-radio-item" : undefined}>
        <Radio.Group
          className={mapMode ? "map-location-radio-group" : undefined}
          onChange={mapMode ? handleApply : undefined}
        >
          <Radio value={1}>Mặt tiền</Radio>
          <Radio value={2}>Hẻm</Radio>
        </Radio.Group>
      </Form.Item>
      {multipleFeatures ? (
        <>
          <Typography.Text strong className="property-location-feature-heading">
            Đặc điểm vị trí
          </Typography.Text>
          <Checkbox.Group
            className="property-location-feature-group"
            value={Array.isArray(locationFeatureWatch) ? locationFeatureWatch : []}
            onChange={(values) => form.setFieldValue(locationFeatureName, values)}
          >
            <Row>
              {enumList.LocationFeature.filter((e) => e.Value <= 4).map((e) => (
                <Col key={e.Value} xs={12}>
                  <Checkbox value={e.Value}>{e.Name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
          <Typography.Text strong className="property-location-feature-heading">
            Đặc điểm nội thất
          </Typography.Text>
          <Checkbox.Group
            className="property-location-feature-group"
            value={Array.isArray(locationFeatureWatch) ? locationFeatureWatch : []}
            onChange={(values) => form.setFieldValue(locationFeatureName, values)}
          >
            <Row>
              {enumList.LocationFeature.filter((e) => e.Value > 4).map((e) => (
                <Col key={e.Value} xs={12}>
                  <Checkbox value={e.Value}>{e.Name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </>
      ) : (
        <Form.Item name={locationFeatureName} className={mapMode ? "map-location-radio-item map-location-feature-item" : undefined}>
          <Radio.Group
            className={
              mapMode
                ? "map-location-feature-group"
                : "property-location-feature-group"
            }
            onChange={mapMode ? handleApply : undefined}
          >
            {mapMode ? (
            enumList.LocationFeature.filter((e) => e.Value <= 4).map((e) => (
              <Radio key={e.Value} value={e.Value}>{e.Name}</Radio>
            ))
          ) : (
            <Row>
              {enumList.LocationFeature.filter((e) => e.Value <= 4).map((e) => (
                <Col key={e.Value} xs={12}>
                  <Radio value={e.Value}>{e.Name}</Radio>
                </Col>
              ))}
            </Row>
          )}
          </Radio.Group>
        </Form.Item>
      )}
      {!mapMode && (
        <Row gutter={[12, 12]}>
          <Col {...colStyle}>
            <Button
              block
              htmlType="button"
              onClick={() => {
                form.resetFields([locationFeatureName, locationName]);
                handleApply();
              }}
            >
              Đặt lại
            </Button>
          </Col>
          <Col {...colStyle}>
            <Button
              block
              type="primary"
              htmlType="button"
              className="property-location-apply-btn"
              style={{
                backgroundColor: "#0588f0",
                borderColor: "#0588f0",
                color: "#fff",
              }}
              onClick={handleApply}
            >
              Áp dụng
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );

  useEffect(() => {
    if (locationWatch) {
      if (locationWatch === 1) setLocation("Mặt tiền");
      else setLocation("Hẻm");
    } else setLocation(undefined);
  }, [locationWatch]);

  useEffect(() => {
    const values = Array.isArray(locationFeatureWatch)
      ? locationFeatureWatch
      : locationFeatureWatch == null || locationFeatureWatch === ""
        ? []
        : [locationFeatureWatch];
    setFeature(
      values
        .map((value) =>
          enumList.LocationFeature.find((x) => x.Value === Number(value))?.Name
        )
        .filter(Boolean)
        .join(", ") || undefined
    );
  }, [enumList.LocationFeature, locationFeatureWatch]);

  return (
    <Dropdown
      trigger={["click"]}
      transitionName={mapMode ? "map-filter-popup" : undefined}
      dropdownRender={dropdownRender}
      overlayClassName={
        mapMode ? "map-location-dropdown" : "property-location-dropdown"
      }
      open={open}
      onOpenChange={setOpen}
    >
      <button
        type="button"
        style={{ textAlign: "left" }}
        aria-label="Vị trí"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`property-custom-dropdown-trigger property-location-trigger ${
          open ? "is-open" : ""
        } ${location || feature ? "has-value" : ""}`}
      >
        <span className="property-custom-dropdown-label">
          Vị trí
        </span>
        <Typography.Text ellipsis className="property-custom-dropdown-value">
          {location && feature ? `${location}, ${feature}` : location || feature || ""}
        </Typography.Text>
        <ChevronDown
          className="property-custom-dropdown-arrow"
          size={16}
          aria-hidden="true"
        />
      </button>
    </Dropdown>
  );
};
