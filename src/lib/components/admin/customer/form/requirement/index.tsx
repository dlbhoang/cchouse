import { InputNumber as LucideInputNumber } from "@/lib/components/antd-lucide";
import { Select as LucideSelect } from "@/lib/components/antd-lucide";
import {Col, Form, FormInstance, Input, Row, Space} from "antd";
import { Rule } from "antd/es/form";

import MyCard from "@/lib/components/shared/MyCard";
import {
  DirectionSelect,
  DistrictSelect,
  FloorSelect,
  LocationFeatureSelect,
  LocationSelect,
  PropTypeSelect,
  WardSelect,
} from "@/lib/components/shared/MySelect";
import { ICustomerRequest } from "@/services/api/customer/ICustomer";

type Props = {
  title: string;
  form: FormInstance<ICustomerRequest>;
  itemName: "BuyingRequirement" | "RentingRequirement";
};

const labelCheckbox = "Chi tiết";

const RequirementCard = ({ title, form, itemName }: Props) => {
  const provinceIdWatch = Form.useWatch("ProvinceId", form);
  const id = form.getFieldValue("Id");
  const districtsWatch = Form.useWatch([itemName, "Districts"], form);
  const wardsWatch = Form.useWatch([itemName, "Wards"], form);
  const hasArea = (districtsWatch?.length ?? 0) > 0 || (wardsWatch?.length ?? 0) > 0;

  const rules: Rule[] | undefined =
    hasArea ? [{ required: true }] : undefined;

  const switchValueToBoolean = (val?: number) => {
    return { checked: val !== undefined && val !== 2 };
  };

  const switchBooleanToValue = (checked: boolean) => {
    if (itemName === "BuyingRequirement") return checked ? 0 : 2;
    return checked ? 1 : 2;
  };

  const options = [
    {
      label: "Tìm mua",
      value: 0,
    },
    {
      label: "Tìm thuê",
      value: 1,
    },
    {
      label: "Tạm ngưng",
      value: 2,
    },
    {
      label: "Đã mua",
      value: 3,
    },
    {
      label: "Đã thuê",
      value: 3,
    },
  ];

  return (
    <MyCard
      title=""
      // extra={
      //   id > 0 && (
      //     <Form.Item
      //       noStyle
      //       name={[itemName, 'Status']}
      //       valuePropName="checked"
      //       getValueFromEvent={switchBooleanToValue}
      //       getValueProps={switchValueToBoolean}
      //     >
      //       <Switch
      //         checkedChildren={<Check />}
      //         unCheckedChildren={<X />}
      //       />
      //     </Form.Item>
      //   )
      // }
    >
      <Row gutter={12}>
        {id > 0 && (
          <Col xs={24} md={12} xl={8}>
            {/* <Form.Item
              label="Cần tìm"
              name={[itemName, 'Status']}
              valuePropName="checked"
              getValueFromEvent={switchBooleanToValue}
              getValueProps={switchValueToBoolean}
            >
              <Switch
                checkedChildren={<Check />}
                unCheckedChildren={<X />}
              />
            </Form.Item> */}
            <Form.Item label="Trạng thái" name={[itemName, "Status"]}>
              <LucideSelect
                options={
                  itemName === "BuyingRequirement"
                    ? options.filter(
                        (x) => !["Tìm thuê", "Đã thuê"].includes(x.label)
                      )
                    : options.filter(
                        (x) => !["Tìm mua", "Đã mua"].includes(x.label)
                      )
                }
              />
            </Form.Item>
          </Col>
        )}
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            label="Phường / Xã"
            name={[itemName, "Wards"]}
            rules={rules}
          >
            <WardSelect parentVal={provinceIdWatch} isNew mode="multiple" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            label="Quận / Huyện (dữ liệu cũ)"
            name={[itemName, "Districts"]}
            rules={districtsWatch?.length ? rules : undefined}
            // rules={
            //   rules
            //     ? [
            //         ...rules,
            //         {
            //           validator: (_, value) => {
            //             if (value.length > 5) {
            //               return Promise.reject(
            //                 new Error('Tối đa 5 Quận/Huyện')
            //               );
            //             }
            //             return Promise.resolve();
            //           },
            //         },
            //       ]
            //     : undefined
            // }
          >
            <DistrictSelect parentVal={provinceIdWatch} mode="multiple" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            label="Loại BĐS"
            name={[itemName, "PropTypes"]}
            rules={rules}
            // rules={
            //   rules
            //     ? [
            //         ...rules,
            //         {
            //           validator: (_, value) => {
            //             if (value.length > 5) {
            //               return Promise.reject(new Error('Tối đa 5 loại'));
            //             }
            //             return Promise.resolve();
            //           },
            //         },
            //       ]
            //     : undefined
            // }
          >
            <PropTypeSelect mode="multiple" />
          </Form.Item>
        </Col>
        <Col xs={12} md={12} xl={8}>
          <Form.Item
            label="Khoảng giá"
            style={{ marginBottom: 0 }}
            required={hasArea}
          >
            <Space>
              <Form.Item
                name={[itemName, "PriceFrm"]}
                rules={
                  hasArea
                    ? [{ required: true, message: "Không để trống!" }]
                    : undefined
                }
              >
                <LucideInputNumber placeholder="Từ" />
              </Form.Item>
              <Form.Item
                name={[itemName, "PriceTo"]}
                rules={
                  hasArea
                    ? [{ required: true, message: "Không để trống!" }]
                    : undefined
                }
              >
                <LucideInputNumber placeholder="Đến" />
              </Form.Item>
            </Space>
          </Form.Item>
        </Col>

        {/* <Col xs={24} md={12} xl={8}>
          <Form.Item label="Tình trạng khách hàng" name={[itemName, 'Status']}>
            <RequirementStatusSelect />
          </Form.Item>
        </Col> */}

        <Col xs={12} md={12} xl={8}>
          <Form.Item label="Mặt tiền/Hẻm" name={[itemName, "Location"]}>
            <LocationSelect />
          </Form.Item>
        </Col>
        <Col xs={12} md={12} xl={8}>
          <Form.Item
            label="Đặc điểm vị trí"
            name={[itemName, "LocationFeature"]}
          >
            <LocationFeatureSelect />
          </Form.Item>
        </Col>
        <Col xs={12} md={12} xl={8}>
          <Form.Item label="Chọn hướng" name={[itemName, "Direction"]}>
            <DirectionSelect mode="multiple" />
          </Form.Item>
        </Col>
        <Col xs={12} md={12} xl={8}>
          <Form.Item label="Số lầu" name={[itemName, "Floors"]}>
            <FloorSelect />
          </Form.Item>
        </Col>
        <Col xs={12} lg={12} xl={8}>
          <Form.Item label="Chiều rộng (m)" name={[itemName, "Width"]}>
            <LucideInputNumber />
          </Form.Item>
        </Col>
        <Col xs={12} md={12} xl={8}>
          <Form.Item label="Chiều dài (m)" name={[itemName, "Length"]}>
            <LucideInputNumber />
          </Form.Item>
        </Col>
        <Col xs={12} md={12} xl={8}>
          <Form.Item label="Tổng diện tích (m2)" name={[itemName, "Area"]}>
            <LucideInputNumber />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item label="Ghi chú" name={[itemName, "Note"]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>
    </MyCard>
  );
};

export default RequirementCard;
