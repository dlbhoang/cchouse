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
    text: "Từ 300- 400",
    areaFrom: 300,
    areaTo: 400,
  },
];
type Props = {
  form: FormInstance;
};
const colStyle = {
  xs: 24,
  lg: 12,
};
export const AreaFilter = ({ form }: Props) => {
  const areaFrm = Form.useWatch("AreaFrm", form);
  const areaTo = Form.useWatch("AreaTo", form);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string>();

  const handleDropdownChange = (value: string) => {
    const item = areaData.find((x) => x.id.toString() === value.toString());
    form.setFieldValue("AreaFrm", item?.areaFrom);
    form.setFieldValue("AreaTo", item?.areaTo);
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
      onClick={() => setIsDropdownOpen(true)}
      onChange={handleDropdownChange}
      onDropdownVisibleChange={setIsDropdownOpen}
      placeholder="Diện tích"
      value={selectValue}
      // eslint-disable-next-line react/no-unstable-nested-components
      dropdownRender={(menu) => (
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
      {areaData.map((e) => (
        <Option key={e.id} value={e.id}>
          {e.text} m<sup>2</sup>
        </Option>
      ))}
    </Select>
  );
};
