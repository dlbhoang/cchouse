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
import { ETransType } from "@/lib/core/enum";

const { Text } = Typography;
const { Option } = Select;

const priceData = [
  {
    id: 1,
    text: "Dưới 10",
    priceFrom: 0,
    priceTo: 10,
  },
  {
    id: 2,
    text: "Từ 10 - 20",
    priceFrom: 10,
    priceTo: 20,
  },
  {
    id: 3,
    text: "Từ 20 - 30",
    priceFrom: 20,
    priceTo: 30,
  },
  {
    id: 4,
    text: "Từ 30 - 40",
    priceFrom: 30,
    priceTo: 40,
  },
];

type Props = {
  form: FormInstance;
};
const colStyle = {
  xs: 24,
  lg: 12,
};
export const PriceFilter = ({ form }: Props) => {
  const priceFrm = Form.useWatch("PriceFrm", form);
  const priceTo = Form.useWatch("PriceTo", form);

  const transType = Form.useWatch("TransType", form);
  const methodName = Number(transType) === ETransType.sell ? "tỷ" : "triệu";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string>();
  const handleDropdownChange = (value: string) => {
    const priceItem = priceData.find(
      (x) => x.id.toString() === value.toString()
    );
    form.setFieldValue("PriceFrm", priceItem?.priceFrom);
    form.setFieldValue("PriceTo", priceItem?.priceTo);
  };

  useEffect(() => {
    // Update the displayed value
    let result;
    if (priceFrm && priceTo) {
      result = `Giá: ${priceFrm}-${priceTo} (${methodName})`;
    } else if (priceFrm) {
      result = `Giá: trên ${priceFrm} (${methodName})`;
    } else if (priceTo) {
      result = `Giá: dưới ${priceTo} (${methodName})`;
    }
    setSelectValue(result);
  }, [methodName, priceFrm, priceTo]);
  return (
    <Select
      style={{ width: "100%" }}
      open={isDropdownOpen}
      dropdownMatchSelectWidth={false}
      onClick={() => setIsDropdownOpen(true)}
      onChange={handleDropdownChange}
      onDropdownVisibleChange={setIsDropdownOpen}
      placeholder={`Giá (${methodName})`}
      value={selectValue}
      // eslint-disable-next-line react/no-unstable-nested-components
      dropdownRender={(menu) => (
        <Space direction="vertical">
          {menu}
          <Text strong>Khoảng giá</Text>
          <Space.Compact style={{ width: 265 }}>
            <Form.Item name="PriceFrm" noStyle>
              <Input placeholder="Từ" />
            </Form.Item>
            <Text style={{ marginInline: 10 }}>-</Text>
            <Form.Item name="PriceTo" noStyle>
              <Input placeholder="Đến" />
            </Form.Item>
          </Space.Compact>
          <Divider style={{ margin: 5 }} />
          <Row gutter={[12, 12]}>
            <Col {...colStyle}>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => form.resetFields(["PriceFrm", "PriceTo"])}
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
      {priceData.map((e) => (
        <Option key={e.id} value={e.id}>
          {e.text} {methodName}
        </Option>
      ))}
    </Select>
  );
};
