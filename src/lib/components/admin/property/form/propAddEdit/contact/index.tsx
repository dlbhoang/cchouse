import { PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Checkbox,
  Col,
  ColProps,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { MultiplePhoneNumber } from "@/lib/components/shared/MyFormItem/MultiplePhoneNumber";
import {
  CustomerTypeSelect,
  LawSelect,
  PaymentMethodSelect,
  StatusUsageSelect,
} from "@/lib/components/shared/MySelect";
import { ETransType } from "@/lib/core/enum";
import { IPropRequest, IPropResponse } from "@/lib/interfaces/Property/IProp";
import { fileServices } from "@/services/api/services/fileServices";
import LogoModal from "./logo-modal";

const colSizes: ColProps = {
  xs: 12,
  lg: 8,
};

type Props = {
  form: FormInstance<IPropRequest>;
  isFull: boolean;
  model?: IPropResponse;
};

const ContactZone = ({ model, form, isFull }: Props) => {
  const transType = form.getFieldValue("TransType");
  const customerTypeWatch = Form.useWatch("CustomerType", form);
  const customerLogoWatch = Form.useWatch("CustomerLogo", form);
  const [hasRentInfo, setHasRentInfo] = useState(
    ["3", "6"].includes(model?.PropAddress?.StatusUsage?.toString() ?? "")
  );
  const { data: session } = useSession();
  const [noOwner, setNoOwner] = useState(model?.CustomerType === 7);
  const [openLogo, setOpenLogo] = useState(false);
  const [logo, setLogo] = useState<string>();

  useEffect(() => {
    const fetch = async () => {
      if (!customerLogoWatch || customerLogoWatch.length === 0) {
        setLogo(undefined);
        return;
      }

      if (Array.isArray(customerLogoWatch)) {
        const firstItem = customerLogoWatch[0];
        if (firstItem?.url) {
          // Direct URL available.
          setLogo(firstItem.url);
        } else if (firstItem?.originFileObj) {
          // URL needs to be generated from a file object.
          const logoUrl = await fileServices.getBase64(firstItem.originFileObj);
          setLogo(logoUrl);
        }
      }
    };
    fetch();
  }, [customerLogoWatch]);

  return (
    <Row gutter={12}>
      <Col {...colSizes}>
        <Form.Item name={"CustomerLogo"} hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="Nhận diện KH"
          name="CustomerType"
          rules={[{ required: true }]}
        >
          <CustomerTypeSelect
            onChange={(val) => {
              setNoOwner(val?.toString() === "7");
              if (val?.toString() !== "9") {
                form.setFieldValue("CustomerLogo", undefined);
              }
              if (val?.toString() === "8") {
                const { CompanyPhone, Phone, Name } = session?.user || {};
                const userPhones = [CompanyPhone, Phone].filter(
                  (phone): phone is string => Boolean(phone)
                );
                form.setFieldValue("CustomerName", Name);
                form.setFieldValue("CustomerPhone", userPhones);
              }
            }}
          />
        </Form.Item>
      </Col>
      {!noOwner && (
        <Col {...colSizes}>
          <Form.Item
            label="Tên liên hệ"
            name="CustomerName"
            dependencies={["CustomerType", "CustomerLogo"]}
            rules={[
              { required: true, message: "Tên liên hệ không để trống!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !getFieldValue("CustomerLogo") &&
                    Number(getFieldValue("CustomerType")) === 9
                  ) {
                    return Promise.reject(
                      new Error("Logo công ty không để trống!")
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              suffix={
                customerTypeWatch === 9 && (
                  <Tooltip title="Logo">
                    <PlusOutlined
                      style={{ fontSize: 10 }}
                      onClick={() => setOpenLogo(true)}
                    />
                  </Tooltip>
                )
              }
              prefix={logo && <Avatar src={logo} size={"small"} />}
            />
          </Form.Item>
          <LogoModal form={form} open={openLogo} onOpenChange={setOpenLogo} />
        </Col>
      )}
      {!noOwner &&
        ([1, 2].includes(session?.user.RoleId ?? 0) ||
        session?.user.Id === model?.UserAdminId ||
        !model?.IsHidePhone ? (
          <Col lg={8} xl={8} xs={24}>
            <MultiplePhoneNumber
              required
              name="CustomerPhone"
              label={
                <div className="form-item-checkbox">
                  <Typography.Text>Điện thoại</Typography.Text>
                  {([1, 2].includes(session?.user.RoleId ?? 0) ||
                    session?.user.Id === model?.UserAdminId ||
                    !model?.Id) && (
                    <Form.Item
                      noStyle
                      name="IsHidePhone"
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
          <Col lg={8} xl={8} xs={24}>
            <Form.Item name={"CustomerPhone"} hidden>
              <Input />
            </Form.Item>
            SĐT đang bị ẩn, vui lòng liên hệ quản lý
          </Col>
        ))}
      <Col {...colSizes}>
        <Form.Item
          label={`
            Giá ${Number(transType) === ETransType.sell ? "bán" : "thuê"}`}
          name="Price"
          rules={[{ required: true }]}
        >
          <InputNumber
            addonAfter={
              <Form.Item
                name="PaymentMethod"
                label="Đơn vị"
                className="hidden-label"
                noStyle
                rules={[{ required: true }]}
              >
                <PaymentMethodSelect
                  showSearch={false}
                  allowClear={false}
                  style={{ minWidth: 80 }}
                />
              </Form.Item>
            }
          />
        </Form.Item>
      </Col>
      <Col {...colSizes}>
        <Form.Item
          label="Pháp lý Nhà, Đất"
          name={["PropAddress", "Laws"]}
          rules={[{ required: true }]}
        >
          <LawSelect mode="multiple" />
        </Form.Item>
      </Col>
      <Col {...colSizes}>
        <Form.Item
          label="Tình trạng nhà"
          name={["PropAddress", "StatusUsage"]}
          rules={[{ required: true }]}
        >
          <StatusUsageSelect
            onChange={(val) => {
              if (val.toString() === "3" || val.toString() === "6")
                setHasRentInfo(true);
              else setHasRentInfo(false);
            }}
          />
        </Form.Item>
      </Col>
      {hasRentInfo && (
        <>
          <Col {...colSizes}>
            <Space.Compact direction="horizontal" style={{ width: "100%" }}>
              <Form.Item
                label="Giá thuê"
                name={["PropAddress", "PriceForRent"]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name={["PropAddress", "PriceForRentMethod"]}
                label="Đơn vị thuê"
                className="hidden-label"
                style={{ marginTop: 30 }}
                initialValue={2}
              >
                <PaymentMethodSelect />
              </Form.Item>
            </Space.Compact>
          </Col>
          <Col {...colSizes}>
            <Form.Item label="Thời hạn" name={["PropAddress", "EndTimeRent"]}>
              <InputNumber
                addonAfter={
                  <Form.Item noStyle name={["PropAddress", "EndTimeRentUnit"]}>
                    <Select>
                      <Select.Option value="Tháng">Tháng</Select.Option>
                      <Select.Option value="Năm">Năm</Select.Option>
                    </Select>
                  </Form.Item>
                }
              />
            </Form.Item>
          </Col>
        </>
      )}
      <Col {...colSizes}>
        <Form.Item label="Hoa hồng" name="Commission">
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ContactZone;
