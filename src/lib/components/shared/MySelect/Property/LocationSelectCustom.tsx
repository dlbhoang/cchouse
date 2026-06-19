import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
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
};
export const LocationSelectCustom = ({
  form,
  locationName,
  locationFeatureName,
}: Props) => {
  const { enumList } = useAdminContext();

  const locationWatch = Form.useWatch("Location", form);
  const locationFeatureWatch = Form.useWatch("LocationFeature", form);

  const [location, setLocation] = useState<string>();
  const [feature, setFeature] = useState<string>();
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
    padding: 20,
    maxWidth: 250,
  };

  const dropdownRender = () => (
    <div style={contentStyle}>
      <Typography.Text strong>Vị trí: </Typography.Text>
      <Form.Item name={locationName}>
        <Radio.Group>
          <Radio value={1}>Mặt tiền</Radio>
          <Radio value={2}>Hẻm</Radio>
        </Radio.Group>
      </Form.Item>
      <Typography.Text strong>Đặc điểm: </Typography.Text>
      <Form.Item name={locationFeatureName}>
        <Radio.Group>
          <Row>
            {enumList.LocationFeature.map((e) => (
              <Col xs={12}>
                <Radio value={e.Value}>{e.Name}</Radio>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Form.Item>
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
          <Button block type="primary" htmlType="button" onClick={handleApply}>
            Áp dụng
          </Button>
        </Col>
      </Row>
    </div>
  );

  useEffect(() => {
    if (locationWatch) {
      if (locationWatch === 1) setLocation("Mặt tiền");
      else setLocation("Hẻm");
    } else setLocation(undefined);
  }, [locationWatch]);

  useEffect(() => {
    if (locationFeatureWatch) {
      setFeature(
        enumList.LocationFeature.find(
          (x) => x.Value === Number(locationFeatureWatch)
        )?.Name
      );
    } else setFeature(undefined);
  }, [enumList.LocationFeature, locationFeatureWatch]);

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
          type={location || feature ? undefined : "secondary"}
          ellipsis
        >
          {location && feature
            ? `${location}, ${feature}`
            : location || feature || "Chọn"}
        </Typography.Text>
        <Typography.Text type="secondary">
          <DownOutlined />
        </Typography.Text>
      </Button>
    </Dropdown>
  );
};
