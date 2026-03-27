import {
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Tabs,
  TabsProps,
} from "antd";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { MultiplePhoneNumber } from "@/lib/components/shared/MyFormItem";
import {
  CustomerTypeSelect,
  ProvinceSelect,
  UserAdminSelect,
} from "@/lib/components/shared/MySelect";
import { ICustomerResponse } from "@/services/api/customer/ICustomer";
import RequirementCard from "../requirement";

type Props = {
  form: FormInstance;
  model?: ICustomerResponse;
};

const CustomerInfo = ({ form, model }: Props) => {
  const searchParams = useSearchParams();
  const transType = searchParams?.get("TransType");
  const { data: session } = useSession();
  const typeWatch = Form.useWatch("Req_Type") || [];

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
      });

      const reqType: number[] = [];
      if (model.BuyingRequirement) {
        reqType.push(1);
      }
      if (model.RentingRequirement) {
        reqType.push(2);
      }
      if (reqType.length > 0) form.setFieldValue("Req_Type", reqType);
    }
  }, [form, model]);

  const [active, setActive] = useState<string>();
  const onChange = (key: string) => {
    setActive(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tìm mua",
      children: (
        <RequirementCard
          title="Nhu cầu tìm mua"
          form={form}
          itemName="BuyingRequirement"
        />
      ),
      disabled: !typeWatch?.includes(1),
    },
    {
      key: "2",
      label: "Tìm thuê",
      children: (
        <RequirementCard
          title="Nhu cầu tìm thuê"
          form={form}
          itemName="RentingRequirement"
        />
      ),
      disabled: !typeWatch?.includes(2),
    },
  ];

  useEffect(() => {
    setActive(transType?.toString());
  }, [transType]);

  return (
    <Row gutter={[12, 12]}>
      <Form.Item name="Id" hidden>
        <InputNumber />
      </Form.Item>
      <Col xs={12} xl={12}>
        <Form.Item
          label="Nhận diện khách hàng"
          name="Type"
          rules={[{ required: true }]}
        >
          <CustomerTypeSelect />
        </Form.Item>
      </Col>
      <Col xs={12} xl={12}>
        <Form.Item label="Họ và tên" name="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col xs={12} lg={12}>
        <MultiplePhoneNumber required name="Phone" label="SĐT" />
      </Col>

      <Col xs={12} xl={12}>
        <Form.Item
          label="Tỉnh/TP"
          name="ProvinceId"
          rules={[{ required: true }]}
          initialValue={1}
        >
          <ProvinceSelect
            allowClear={false}
            onChange={(val) => {
              form.resetFields([["BuyingRequirement", "Districts"]]);
            }}
          />
        </Form.Item>
      </Col>

      <Col xs={12}>
        <Form.Item label="Nhu cầu" name="Req_Type" rules={[{ required: true }]}>
          <Checkbox.Group
            onChange={(values) => {
              if (values.length > 0) {
                setActive(values[0].toString());
              } else setActive(undefined);
            }}
            options={[
              {
                label: "Tìm mua",
                value: 1,
              },
              {
                label: "Tìm thuê",
                value: 2,
              },
            ]}
          />
        </Form.Item>
      </Col>
      {/* <Col xs={12} xl={12}>
        <Form.Item
          label="Chia sẻ"
          name="IsShared"
          valuePropName="checked"
          tooltip="Tất cả nhân viên sẽ xem được khách hàng của bạn"
        >
          <Switch />
        </Form.Item>
      </Col> */}
      {(!model || session?.user.Name === model?.CreatedBy) && (
        <Col xs={12} xl={12}>
          <Form.Item
            label="Nhân sự chăm sóc"
            name="ViewableUserAdminIds"
            tooltip="Nhân viên được chọn sẽ xem được khách hàng của bạn"
          >
            <UserAdminSelect exceptCurrentUser mode="multiple" />
          </Form.Item>
        </Col>
      )}

      <Col span={24}>
        <Tabs
          activeKey={active}
          items={typeWatch.length > 0 ? items : []}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default CustomerInfo;
