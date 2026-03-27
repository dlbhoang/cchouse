import { Col, Form, Input, Row } from "antd";
import { useEffect } from "react";

import {
  AdvPropSearch,
  AreaFilter,
  DateFilter,
  PriceFilter,
} from "@/lib/components/shared/MyFormItem";
import {
  AddressSelectCustom,
  LocationSelectCustom,
  PropTypeSelect,
  TransTypeSelect,
} from "@/lib/components/shared/MySelect";
import SelectBase from "@/lib/components/shared/MySelect/base/SelectBase";
import { ETransType } from "@/lib/core/enum";
import { convertToNumber } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import { IPropTempOpts } from "@/services/api/property/model";
import { baseFilter } from "../../../../core/configs/appConst";

type Props = {
  model: IPropTempOpts;
  onSubmit: (values: IPropTempOpts) => void;
};

const colStyle = {
  xs: 12,
  lg: 6,
  xl: 4,
};

const hiddenFields = [
  "PropertyId",
  "TransType",
  "Location",
  "LocationFeature",
  "ProvinceId",
  "DistrictId",
  "WardId",
  "StreetId",
  "AddressNumber",
  "PriceFrm",
  "PriceTo",
  "AreaFrm",
  "AreaTo",
];

const PropTempFilter = ({ model, onSubmit }: Props) => {
  const { smallScreen } = useAdminContext();
  const [form] = Form.useForm<IPropTempOpts>();
  const handleRefresh = () => {
    form.resetFields();
    onSubmit({
      ...baseFilter,
      TransType: model.TransType,
    });
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
        search: model.search,
        Status: convertToNumber(model.Status),
        PropTypeIds:
          model.PropTypeIds?.toString()
            .split(",")
            .map((e) => Number(e)) ?? undefined,
        Direction:
          model.Direction?.toString()
            .split(",")
            .map((e) => Number(e)) ?? undefined,
        UserAdminId: convertToNumber(model.UserAdminId),
        CustomerType: convertToNumber(model.CustomerType),
        Location: convertToNumber(model.Location),
        LocationFeature: convertToNumber(model.LocationFeature),
        ProvinceId: convertToNumber(model.ProvinceId),
        DistrictId: convertToNumber(model.DistrictId),
        WardId: convertToNumber(model.WardId),
        StreetId: convertToNumber(model.StreetId),
        PriceFrm: convertToNumber(model.PriceFrm),
        PriceTo: convertToNumber(model.PriceTo),
        AreaFrm: convertToNumber(model.AreaFrm),
        AreaTo: convertToNumber(model.AreaTo),
        FloorAreaFrm: convertToNumber(model.FloorAreaFrm),
        FloorAreaTo: convertToNumber(model.FloorAreaTo),
        LengthFrm: convertToNumber(model.LengthFrm),
        LengthTo: convertToNumber(model.LengthTo),
        WidthFrm: convertToNumber(model.WidthFrm),
        WidthTo: convertToNumber(model.WidthTo),
      });
    }
  }, [form, model]);

  const mobileForm = (
    <div>
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <Row gutter={12} wrap={false}>
          {hiddenFields.map((e) => (
            <Form.Item key={e} name={e} hidden>
              <Input />
            </Form.Item>
          ))}
          <Col {...colStyle} xs={16}>
            <Form.Item name="TransType">
              <TransTypeSelect />
            </Form.Item>
          </Col>
          <Form.Item name="Status">
            <SelectBase
              placeholder="Trạng thái"
              allowClear
              options={[
                "Chưa chuyển đổi",
                "Đã chuyển đổi",
                "Dữ liệu lỗi",
                "Dữ liệu trùng",
              ].map((e, index) => ({
                label: e,
                value: index + 2,
              }))}
            />
          </Form.Item>
          <Col {...colStyle}>
            <LocationSelectCustom
              form={form}
              locationName="Location"
              locationFeatureName="LocationFeature"
            />
          </Col>

          <Col {...colStyle}>
            <Form.Item name="PropTypeIds">
              <PropTypeSelect mode="multiple" />
            </Form.Item>
          </Col>

          <Col {...colStyle}>
            <DateFilter form={form} />
          </Col>
        </Row>
        <Row gutter={12} wrap={false}>
          <Col xs={16} lg={12} xl={8}>
            <Form.Item>
              <AddressSelectCustom
                form={form}
                nameProvince="ProvinceId"
                nameDistrict="DistrictId"
                nameWard="WardId"
                nameStreet="StreetId"
                nameAddressNumber="AddressNumber"
              />
            </Form.Item>
          </Col>

          <Col {...colStyle}>
            <PriceFilter form={form} />
          </Col>
          <Col {...colStyle}>
            <AreaFilter form={form} />
          </Col>
        </Row>
      </div>
      <AdvPropSearch
        form={form}
        placeholder="Tìm mã, tên, địa chỉ..."
        handleRefresh={handleRefresh}
      />
    </div>
  );

  return (
    <Form
      name="basic"
      onFinish={onSubmit}
      autoComplete="off"
      form={form}
      layout="vertical"
      initialValues={{
        TransType: ETransType.sell,
      }}
    >
      {smallScreen ? (
        mobileForm
      ) : (
        <Row gutter={12}>
          {hiddenFields.map((e) => (
            <Form.Item key={e} name={e} hidden>
              <Input />
            </Form.Item>
          ))}
          <Col {...colStyle}>
            {/* TODO: Chưa có API */}
            <Form.Item name="TransType">
              <TransTypeSelect />
            </Form.Item>
          </Col>
          <Col {...colStyle}>
            {/* TODO: Chưa có API */}
            <Form.Item name="Status">
              <SelectBase
                placeholder="Trạng thái"
                allowClear
                options={[
                  "Chưa chuyển đổi",
                  "Đã chuyển đổi",
                  "Dữ liệu lỗi",
                  "Dữ liệu trùng",
                ].map((e, index) => ({
                  label: e,
                  value: index + 2,
                }))}
              />
            </Form.Item>
          </Col>
          <Col {...colStyle}>
            <LocationSelectCustom
              form={form}
              locationName="Location"
              locationFeatureName="LocationFeature"
            />
          </Col>
          <Col xs={24} lg={12} xl={4}>
            <Form.Item>
              <AddressSelectCustom
                form={form}
                nameProvince="ProvinceId"
                nameDistrict="DistrictId"
                nameWard="WardId"
                nameStreet="StreetId"
                nameAddressNumber="AddressNumber"
              />
            </Form.Item>
          </Col>

          <Col {...colStyle}>
            <Form.Item name="PropTypeIds">
              <PropTypeSelect mode="multiple" />
            </Form.Item>
          </Col>

          <Col {...colStyle}>
            <PriceFilter form={form} />
          </Col>

          <Col {...colStyle}>
            <AreaFilter form={form} />
          </Col>

          <Col xs={24} lg={12} xl={8}>
            <AdvPropSearch
              form={form}
              placeholder="Tìm mã, tên, địa chỉ..."
              handleRefresh={handleRefresh}
            />
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default PropTempFilter;
