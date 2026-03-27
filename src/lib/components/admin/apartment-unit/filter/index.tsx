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
  DirectionSelect,
  LocationSelectCustom,
  PropTypeSelect,
  TransStatusSelect,
  UserAdminSelect,
} from "@/lib/components/shared/MySelect";
import { ETransType } from "@/lib/core/enum";
import { convertToNumber } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import { IApartmentUnitOpts } from "@/services/api/apartment/unit/IApartmentUnit";
import { baseFilter } from "../../../../core/configs/appConst";

type Props = {
  model: IApartmentUnitOpts;
  onSubmit: (values: IApartmentUnitOpts) => void;
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

const ApartmentUnitFilter = ({ model, onSubmit }: Props) => {
  const { smallScreen } = useAdminContext();
  const [form] = Form.useForm<IApartmentUnitOpts>();
  const handleRefresh = () => {
    form.resetFields();
    onSubmit({
      ...baseFilter,
      Status: [1],
      TransType: model.TransType,
    });
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
        search: model.search,
        Status: model.Status?.toString()
          .split(",")
          .map((e) => Number(e)) ?? [1],
        PropTypeId:
          model.PropTypeId?.toString()
            .split(",")
            .map((e) => Number(e)) ?? undefined,
        TransType: convertToNumber(model.TransType),
        DistrictId: convertToNumber(model.DistrictId),
        CreateUserId: convertToNumber(model.CreateUserId),
        PriceFrm: convertToNumber(model.PriceFrm),
        PriceTo: convertToNumber(model.PriceTo),
        AreaFrm: convertToNumber(model.AreaFrm),
        AreaTo: convertToNumber(model.AreaTo),
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
            <Form.Item name="Status">
              <TransStatusSelect
                mode="multiple"
                transType={model?.TransType || ETransType.sell}
              />
            </Form.Item>
          </Col>
          <Col {...colStyle}>
            <Form.Item name="Direction">
              <DirectionSelect mode="multiple" />
            </Form.Item>
          </Col>
          <Col {...colStyle}>
            <Form.Item name="PropTypeId">
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
          <Col {...colStyle}>
            <Form.Item name="CreateUserId">
              <UserAdminSelect />
            </Form.Item>
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
            <Form.Item name="Status">
              <TransStatusSelect
                mode="multiple"
                transType={model?.TransType || ETransType.sell}
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
          <Col xs={24} lg={12} xl={8}>
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
            <Form.Item name="Direction">
              <DirectionSelect mode="multiple" />
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

          <Col {...colStyle}>
            <Form.Item name="UserAdminId">
              <UserAdminSelect />
            </Form.Item>
          </Col>
          <Col {...colStyle}>
            <DateFilter form={form} />
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default ApartmentUnitFilter;
