import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import { Rule } from "antd/es/form";

import MyCard from "@/lib/components/shared/MyCard";
import {
  DirectionSelect,
  DistrictSelect,
  FloorSelect,
  LocationFeatureSelect,
  LocationSelect,
  PropTypeSelect,
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
  const dataWatch = Form.useWatch([itemName, "Districts"], form);

  const rules: Rule[] | undefined =
    dataWatch?.length > 0 ? [{ required: true }] : undefined;

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
      //         checkedChildren={<CheckOutlined />}
      //         unCheckedChildren={<CloseOutlined />}
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
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item> */}
            <Form.Item label="Trạng thái" name={[itemName, "Status"]}>
              <Select
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
            label="Quận / Huyện"
            name={[itemName, "Districts"]}
            rules={rules}
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
            required={dataWatch?.length > 0}
          >
            <Space>
              <Form.Item
                name={[itemName, "PriceFrm"]}
                rules={
                  dataWatch?.length > 0
                    ? [{ required: true, message: "Không để trống!" }]
                    : undefined
                }
              >
                <InputNumber placeholder="Từ" />
              </Form.Item>
              <Form.Item
                name={[itemName, "PriceTo"]}
                rules={
                  dataWatch?.length > 0
                    ? [{ required: true, message: "Không để trống!" }]
                    : undefined
                }
              >
                <InputNumber placeholder="Đến" />
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
            <InputNumber />
          </Form.Item>
        </Col>
        <Col xs={12} md={12} xl={8}>
          <Form.Item label="Chiều dài (m)" name={[itemName, "Length"]}>
            <InputNumber />
          </Form.Item>
        </Col>
        <Col xs={12} md={12} xl={8}>
          <Form.Item label="Tổng diện tích (m2)" name={[itemName, "Area"]}>
            <InputNumber />
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
