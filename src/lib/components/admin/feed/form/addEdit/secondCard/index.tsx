import {
  Checkbox,
  Col,
  Form,
  FormInstance,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

import MyCard from "@/lib/components/shared/MyCard";
import { StatusUsageSelect } from "@/lib/components/shared/MySelect";
import PriceAutoComplete from "@/lib/components/shared/PriceAutoComplete";
import { ETransType } from "@/lib/core/enum";
import { FormatNumber } from "@/lib/core/utils/myFormat";
import readMoney from "@/lib/core/utils/readMoney";
import { IFeedResponse } from "@/services/api/feed/IFeed";

type Props = {
  form: FormInstance<IFeedResponse>;
};

const SecondCard = ({ form }: Props) => {
  const transTypeWatch = Form.useWatch(["Property", "TransType"], form);
  const fullPriceWatch = Form.useWatch(["Property", "FullPrice"], form);
  const depositPriceWatch = Form.useWatch(["Property", "DepositPrice"], form);

  const [paymentMethod, setPaymentMethod] = useState<string>("VNĐ");
  const width = Form.useWatch(["Property", "Width"], form);
  const length = Form.useWatch(["Property", "Length"], form);

  useEffect(() => {
    if (width && length) {
      form.setFieldValue(
        ["Property", "Area"],
        Math.round(width * length * 100) / 100
      );
    }
  }, [width, length, form]);

  useEffect(() => {
    const val = form.getFieldValue(["Property", "PaymentMethod"]);
    if (Number(val) === 4) setPaymentMethod("USD");
  }, []);

  return (
    <MyCard title="2. Diện tích / Giá">
      <Row gutter={12}>
        <Col xs={12} lg={8} xl={6}>
          <Form.Item label="Chiều rộng (m)" name={["Property", "Width"]}>
            <InputNumber />
          </Form.Item>
        </Col>
        <Col xs={12} lg={8} xl={6}>
          <Form.Item label="Chiều dài (m)" name={["Property", "Length"]}>
            <InputNumber />
          </Form.Item>
        </Col>
        <Col xs={12} lg={8} xl={6}>
          <Form.Item
            label={
              <Typography.Text>
                Tổng diện tích (m<sup>2</sup>)
              </Typography.Text>
            }
            name={["Property", "Area"]}
            rules={[
              {
                required: true,
                message: "Diện tích không để trống!",
              },
            ]}
          >
            <InputNumber formatter={FormatNumber} />
          </Form.Item>
        </Col>
        <Col xs={12} lg={8} xl={6}>
          <Form.Item
            label={
              <Typography.Text>
                Diện tích sàn (m<sup>2</sup>)
              </Typography.Text>
            }
            name={["Property", "FloorArea"]}
          >
            <InputNumber formatter={FormatNumber} />
          </Form.Item>
        </Col>
        <Col xs={12} lg={8} xl={6}>
          <Form.Item label="Số phòng" name={["Property", "Bedroom"]}>
            <InputNumber />
          </Form.Item>
        </Col>
        <Col xs={12} lg={8} xl={6}>
          <Form.Item label="Số toilet" name={["Property", "Bathroom"]}>
            <InputNumber />
          </Form.Item>
        </Col>

        <Col xs={24} lg={12}>
          <Form.Item
            label={
              <div className="form-item-checkbox">
                <Typography.Text>Giá</Typography.Text>
                <Form.Item
                  noStyle
                  name={["Property", "HiddenPrice"]}
                  valuePropName="checked"
                >
                  <Checkbox>Ẩn giá</Checkbox>
                </Form.Item>
              </div>
            }
            name={["Property", "FullPrice"]}
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            extra={readMoney(fullPriceWatch?.toString())}
          >
            <PriceAutoComplete
              addonAfter={
                <Select
                  value={paymentMethod}
                  options={["VNĐ", "USD"].map((e) => ({ label: e, value: e }))}
                  onChange={(val) => {
                    if (val === "USD")
                      form.setFieldValue(["Property", "PaymentMethod"], 4);
                    setPaymentMethod(val);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {Number(transTypeWatch) === ETransType.rent && (
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Tiền cọc"}
              name={["Property", "DepositPrice"]}
              extra={readMoney(depositPriceWatch?.toString())}
            >
              <PriceAutoComplete />
            </Form.Item>
          </Col>
        )}
        <Col xs={12} lg={8} xl={6}>
          <Form.Item label="Tình trạng nhà" name={["Property", "StatusUsage"]}>
            <StatusUsageSelect />
          </Form.Item>
        </Col>
      </Row>
    </MyCard>
  );
};

export default SecondCard;
