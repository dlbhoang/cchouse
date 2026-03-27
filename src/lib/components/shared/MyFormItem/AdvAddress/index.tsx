import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  Modal,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { OptionType } from "@/lib/types/common";
import { CombineAddress } from "../../../../core/utils/myFormat";
import {
  DistrictSelect,
  ProvinceSelect,
  StreetSelect,
  WardSelect,
} from "../../MySelect";

const items = {
  ProvinceItem: ["Property", "ProvinceId"],
  DistrictItem: ["Property", "DistrictId"],
  WardItem: ["Property", "WardId"],
  StreetItem: ["Property", "StreetId"],
  AddressNumberItem: ["Property", "AddressNumber"],
  ShowAddressNumberItem: ["Property", "ShowAddressNumber"],

  StreetNameItem: ["Property", "StreetName"],
  WardNameItem: ["Property", "WardName"],
  DistrictNameItem: ["Property", "DistrictName"],
};
type Props = {
  form: FormInstance;
};

const labelCol = {
  xs: 24,
  md: 6,
};
export const AdvAddress = ({ form }: Props) => {
  const showAddressNumberWatch = Form.useWatch(
    items.ShowAddressNumberItem,
    form
  );

  const provinceWatch = Form.useWatch(items.ProvinceItem, form);
  const districtWatch = Form.useWatch(items.DistrictItem, form);

  const AddressNumberWatch = Form.useWatch(items.AddressNumberItem, form);
  const streetNameWatch = Form.useWatch(items.StreetNameItem, form);
  const wardNameWatch = Form.useWatch(items.WardNameItem, form);
  const districtNameWatch = Form.useWatch(items.DistrictNameItem, form);

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button block onClick={() => setOpen(true)}>
        <Typography.Text ellipsis>
          {CombineAddress({
            AddressNumber: AddressNumberWatch,
            StreetName: streetNameWatch,
            WardName: wardNameWatch,
            DistrictName: districtNameWatch,
          }) ?? "Chọn địa chỉ"}
        </Typography.Text>
      </Button>

      <Modal
        title="Địa chỉ"
        closeIcon={null}
        maskClosable={false}
        open={open}
        cancelText="Đóng"
        okText="Xác nhận"
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={async () => {
          if (
            await form.validateFields([
              items.ProvinceItem,
              items.DistrictItem,
              items.WardItem,
              items.StreetItem,
            ])
          )
            setOpen(false);
        }}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label="Tỉnh / TP"
              labelCol={labelCol}
              name={items.ProvinceItem}
              rules={[{ required: true }]}
              initialValue="1"
            >
              <ProvinceSelect
                allowClear={false}
                onChange={(val, opts) => {
                  form.resetFields([
                    items.DistrictItem,
                    items.WardItem,
                    items.StreetItem,
                  ]);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Quận / Huyện"
              labelCol={labelCol}
              name={items.DistrictItem}
              rules={[{ required: true }]}
            >
              <DistrictSelect
                parentVal={provinceWatch}
                onChange={(val, opts) => {
                  form.setFieldValue(
                    items.DistrictNameItem,
                    (opts as OptionType)?.label
                  );
                  form.resetFields([
                    items.WardItem,
                    items.StreetItem,
                    items.StreetNameItem,
                    items.WardNameItem,
                  ]);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Phường / Xã"
              labelCol={labelCol}
              name={items.WardItem}
              rules={[{ required: true }]}
            >
              <WardSelect
                parentVal={districtWatch}
                onChange={(val, opts) =>
                  form.setFieldValue(
                    items.WardNameItem,
                    (opts as OptionType)?.label
                  )
                }
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Số nhà"
              labelCol={labelCol}
              name={items.AddressNumberItem}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Đường"
              labelCol={labelCol}
              name={items.StreetItem}
              // rules={[{ required: true }]}
            >
              <StreetSelect
                parentVal={districtWatch}
                onChange={(val, opts) =>
                  form.setFieldValue(
                    items.StreetNameItem,
                    (opts as OptionType)?.label
                  )
                }
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item noStyle name={items.ShowAddressNumberItem}>
              <Checkbox
                defaultChecked={showAddressNumberWatch}
                onChange={(e) =>
                  form.setFieldValue(
                    items.ShowAddressNumberItem,
                    e.target.checked
                  )
                }
              >
                Hiển thị số nhà khi đăng tin
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
