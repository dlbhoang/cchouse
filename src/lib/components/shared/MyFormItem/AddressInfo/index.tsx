import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import type { NamePath } from "antd/es/form/interface";
import { PlusIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import {
  DirectionSelect,
  DistrictSelect,
  ProvinceSelect,
  StreetSelect,
  WardSelect,
} from "@/lib/components/shared/MySelect";
import { IPropAddressBase } from "@/lib/interfaces/base/IPropAddressBase";
import { IPropRequest } from "@/lib/interfaces/Property/IProp";
import { SubAddressSelect } from "../../MySelect/Property/SubAddressSelect";

type ItemName = {
  ProvinceItem: NamePath;
  DistrictItem: NamePath;
  WardItem: NamePath;
  StreetItem: NamePath;
  AddressNumberItem: NamePath;
  SubAddressItem: NamePath;
  DirectionItem: NamePath;
  ShowAddressNumberItem: NamePath;

  LandNumberItem: NamePath;
  MapNumberItem: NamePath;
};

type Props = {
  colNumber: number;
  form: FormInstance<IPropRequest>;
  model?: IPropAddressBase;
  items: ItemName;
  isLand?: boolean;
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
  hasOldAddress?: boolean;
  hasShowAddressNumber?: boolean;
  disabled?: boolean;
  onShowOldAddress?: () => void;
};

export const AddressInfo = ({
  colNumber,
  form,
  model,
  items,
  leftChildren,
  rightChildren,
  hasShowAddressNumber,
  hasOldAddress,
  disabled,
  isLand,
  onShowOldAddress,
}: Props) => {
  const [selectedProvince, setSelectedProvince] = useState<number | undefined>(
    model?.ProvinceId
  );

  const districtWatch = Form.useWatch(items.DistrictItem, form);

  const colSize = 24 / colNumber;
  return (
    <Row gutter={12}>
      {leftChildren}
      <Col lg={colSize} xl={colSize} xs={24}>
        <Form.Item
          label="Tỉnh / TP"
          name={items.ProvinceItem}
          rules={[{ required: true }]}
          initialValue={1}
        >
          <ProvinceSelect
            disabled={disabled}
            allowClear={false}
            onChange={(val) => {
              form.resetFields([
                items.DistrictItem,
                items.WardItem,
                items.StreetItem,
              ]);
              setSelectedProvince(Number(val));
            }}
          />
        </Form.Item>
      </Col>
      <Col lg={colSize} xl={colSize} xs={24}>
        <Form.Item
          label="Quận / Huyện"
          name={items.DistrictItem}
          rules={[{ required: true }]}
        >
          <DistrictSelect
            disabled={disabled}
            parentVal={selectedProvince?.toString()}
            onChange={(val) => {
              form.resetFields([items.WardItem, items.StreetItem]);
            }}
          />
        </Form.Item>
      </Col>
      <Col lg={colSize} xl={colSize} xs={24}>
        <Form.Item
          label="Phường / Xã"
          name={items.WardItem}
          rules={[{ required: true }]}
        >
          <WardSelect
            disabled={disabled}
            parentVal={districtWatch?.toString()}
          />
        </Form.Item>
      </Col>
      <Col lg={colSize} xl={colSize} xs={24}>
        {isLand ? (
          <Space>
            <Form.Item
              name={items.LandNumberItem}
              label="Thửa đất"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={items.MapNumberItem}
              label="Tờ bản đồ"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Space>
        ) : (
          <Space.Compact block>
            <Form.Item
              label={
                hasShowAddressNumber ? (
                  <div className="form-item-checkbox">
                    <Typography.Text>Số nhà</Typography.Text>
                    <Checkbox
                      onChange={(e) =>
                        form.setFieldValue(
                          items.ShowAddressNumberItem,
                          e.target.checked
                        )
                      }
                    >
                      Hiển thị
                    </Checkbox>
                  </div>
                ) : (
                  "Số nhà"
                )
              }
              name={items.AddressNumberItem}
              rules={[{ required: true }]}
            >
              <Input disabled={disabled} />
            </Form.Item>
            <Form.Item
              name={items.SubAddressItem}
              label=" "
              style={{ width: "50%" }}
            >
              <SubAddressSelect />
            </Form.Item>
          </Space.Compact>
        )}
      </Col>
      <Col lg={colSize} xl={colSize} xs={24}>
        <Space.Compact block>
          <Form.Item
            label="Đường"
            name={items.StreetItem}
            rules={[{ required: true }]}
            style={{ width: "100%" }}
          >
            <StreetSelect
              disabled={disabled}
              parentVal={districtWatch?.toString()}
            />
          </Form.Item>
          {hasOldAddress && (
            <Tooltip title="Địa chỉ cũ">
              <Button
                style={{ marginTop: 30 }}
                icon={<PlusIcon className="size-4" />}
                onClick={onShowOldAddress}
              />
            </Tooltip>
          )}
        </Space.Compact>
      </Col>
      <Col lg={colSize} xl={colSize} xs={24}>
        <Form.Item label="Hướng" name={items.DirectionItem}>
          <DirectionSelect disabled={disabled} />
        </Form.Item>
      </Col>
      {rightChildren}
    </Row>
  );
};
