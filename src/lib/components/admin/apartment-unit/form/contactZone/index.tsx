import {
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
} from "antd";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { MultiplePhoneNumber } from "@/lib/components/shared/MyFormItem";
import {
  CustomerTypeSelect,
  PaymentMethodSelect,
  StatusUsageSelect,
} from "@/lib/components/shared/MySelect";
import { ETransType } from "@/lib/core/enum";
import {
  IApartmentUnitRequest,
  IApartmentUnitResponse,
} from "@/services/api/apartment/unit/IApartmentUnit";

type Props = {
  form: FormInstance<IApartmentUnitRequest>;
  model?: IApartmentUnitResponse;
};

const colRes = {
  xs: 24,
  lg: 12,
};

const contact = "Contact";

const ContactZone = ({ model, form }: Props) => {
  const transTypeWatch = Form.useWatch("TransType", form);
  const { data: session } = useSession();

  const [noOwner, setNoOwner] = useState(model?.Contact.TypeName === "Tìm chủ");
  const [hasRentInfo, setHasRentInfo] = useState(
    [3, 6].includes(model?.StatusUsage ?? 0)
  );

  return (
    <Row gutter={12}>
      <Col {...colRes}>
        <Form.Item
          label="Nhận diện KH"
          name={[contact, "Type"]}
          rules={[{ required: true }]}
        >
          <CustomerTypeSelect
            onChange={(val) => {
              if (val === 7) {
                setNoOwner(true);
              } else {
                setNoOwner(false);
              }

              if (val === 8) {
                const userPhones: string[] = [];
                if (session?.user.CompanyPhone)
                  userPhones.push(session?.user.CompanyPhone);
                if (session?.user.Phone) userPhones.push(session?.user.Phone);
                form.setFieldValue([contact, "Name"], session?.user.Name);
                form.setFieldValue([contact, "Phone"], userPhones);
              }
            }}
          />
        </Form.Item>
      </Col>
      {!noOwner && (
        <Col {...colRes}>
          <Form.Item
            label="Tên liên hệ"
            name={[contact, "Name"]}
            rules={[{ required: true, message: "Tên liên hệ không để trống!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      )}

      {!noOwner &&
        ([1, 2].includes(session?.user.RoleId ?? 0) ||
        session?.user.Id === model?.UserAdminId ||
        !model?.Contact?.IsHidePhone ? (
          <Col {...colRes}>
            <MultiplePhoneNumber
              required
              name={[contact, "Phone"]}
              label={
                <div className="form-item-checkbox">
                  <Typography.Text>Điện thoại</Typography.Text>
                  {([1, 2].includes(session?.user.RoleId ?? 0) ||
                    session?.user.Id === model?.UserAdminId ||
                    !model?.Id) && (
                    <Form.Item
                      noStyle
                      name={[contact, "IsHidePhone"]}
                      valuePropName="checked"
                    >
                      <Checkbox>Ẩn</Checkbox>
                    </Form.Item>
                  )}
                </div>
              }
            />
          </Col>
        ) : (
          <Col {...colRes}>SĐT đang bị ẩn, vui lòng liên hệ quản lý</Col>
        ))}
      <Col {...colRes}>
        <Space.Compact direction="horizontal" block>
          <Form.Item
            label={`
            Giá ${Number(transTypeWatch) === ETransType.sell ? "bán" : "thuê"}`}
            name={[contact, "Price"]}
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={[contact, "PaymentMethod"]}
            label="Đơn vị"
            className="hidden-label"
            style={{ marginTop: 30, width: "50%" }}
            rules={[{ required: true }]}
          >
            <PaymentMethodSelect />
          </Form.Item>
        </Space.Compact>
      </Col>
      <Col {...colRes}>
        <Form.Item
          label="Tình trạng nhà"
          name={"StatusUsage"}
          rules={[{ required: true }]}
        >
          <StatusUsageSelect
            onChange={(val) => {
              if ([3, 6].includes(val)) setHasRentInfo(true);
              else setHasRentInfo(false);
            }}
          />
        </Form.Item>
      </Col>

      {hasRentInfo && (
        <>
          <Col {...colRes}>
            <Space.Compact direction="horizontal" style={{ width: "100%" }}>
              <Form.Item label="Giá thuê" name={"PriceForRent"}>
                <InputNumber />
              </Form.Item>
              <Form.Item
                name={"PriceForRentMethod"}
                label="Đơn vị thuê"
                className="hidden-label"
                style={{ marginTop: 30 }}
                initialValue={2}
              >
                <PaymentMethodSelect />
              </Form.Item>
            </Space.Compact>
          </Col>
          <Col {...colRes}>
            <Form.Item label="Thời hạn" name={"EndTimeRent"}>
              <Input />
            </Form.Item>
          </Col>
        </>
      )}
      <Col {...colRes}>
        <Form.Item label={"Đặc điểm nổi bật"} name={"Outstanding"}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Ghi chú" name="Note">
          <Input.TextArea rows={5} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ContactZone;
