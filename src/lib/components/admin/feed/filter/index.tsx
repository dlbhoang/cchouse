import { Col, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";

import {
  AreaFilter,
  DateFilter,
  PriceFilter,
  SearchInput,
} from "@/lib/components/shared/MyFormItem";
import {
  AddressSelectCustom,
  TransTypeSelect,
  UserAdminSelect,
} from "@/lib/components/shared/MySelect";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { convertToNumber } from "@/lib/core/utils/myFormat";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { IFeedFilter } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";
import feedApi from "@/services/api/feed/feedApi";
import { baseFilter } from "../../../../core/configs/appConst";
import FeedStatusTabs from "../statusTabs";

const colStyle = {
  xs: 12,
  lg: 6,
  xl: 4,
};

const hiddenFields = ["Status", "IsWebsite", "pageSize", "pageIndex"];

type Props = {
  model?: IFeedFilter;
  isWebsite?: boolean;

  onSubmit: (values: IFeedFilter) => void;
};

const FeedFilter = ({ model, isWebsite, onSubmit }: Props) => {
  const { smallScreen } = useAdminContext();
  const [form] = Form.useForm<IFeedFilter>();
  const [countStatus, setCountStatus] = useState<ICountItem[]>([]);

  useEffect(() => {
    if (model) {
      const fetch = async () => {
        const result = isWebsite
          ? await feedApi.countStatusWebsite(model)
          : await feedApi.countStatus(model);
        setCountStatus(result.data);
      };
      fetch();
    }
  }, [isWebsite, model]);

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
        Status: convertToNumber(model.Status),
        TransType: convertToNumber(model.TransType),
        UserAdminId: convertToNumber(model.UserAdminId),
        ProvinceId: convertToNumber(model.ProvinceId),
        DistrictId: convertToNumber(model.DistrictId),
        WardId: convertToNumber(model.WardId),
        StreetId: convertToNumber(model.StreetId),
        PriceFrm: convertToNumber(model.PriceFrm),
        PriceTo: convertToNumber(model.PriceTo),
        AreaFrm: convertToNumber(model.AreaFrm),
        AreaTo: convertToNumber(model.AreaTo),
        LengthFrm: convertToNumber(model.LengthFrm),
        LengthTo: convertToNumber(model.LengthTo),
        WidthFrm: convertToNumber(model.WidthFrm),
        WidthTo: convertToNumber(model.WidthTo),
      });
    }
  }, [form, model]);

  const handleRefresh = () => {
    form.resetFields();
    onSubmit({
      ...baseFilter,
      Status: convertToNumber(model?.Status),
      pageIndex: 1,
    });
  };

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
          <Col xs={16} lg={12} xl={8}>
            <Form.Item name="TransType">
              <TransTypeSelect />
            </Form.Item>
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
      <SearchInput
        form={form}
        placeholder="Tìm mã, tên,..."
        handleRefresh={handleRefresh}
      />
    </div>
  );

  return (
    <Form
      name="basic"
      onFinish={onSubmit}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      form={form}
      layout="vertical"
    >
      {hiddenFields.map((e) => (
        <Form.Item key={e} name={e} hidden>
          <Input />
        </Form.Item>
      ))}
      {smallScreen ? (
        mobileForm
      ) : (
        <Row gutter={12}>
          <Col {...colStyle}>
            <Form.Item name="TransType">
              <TransTypeSelect />
            </Form.Item>
          </Col>
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
            <Form.Item name="UserAdminId">
              <UserAdminSelect />
            </Form.Item>
          </Col>
          <Col {...colStyle}>
            <DateFilter form={form} />
          </Col>
          <Col xs={16} lg={12} xl={8}>
            <SearchInput
              form={form}
              placeholder="Tìm mã, tên,..."
              handleRefresh={handleRefresh}
            />
          </Col>
        </Row>
      )}
      <TitlePage
        title={`Tin đăng ${
          isWebsite ? AppRoutes.feedWebsite.name : AppRoutes.feed.name
        }`}
      />
      <FeedStatusTabs
        defaultActiveKey={model?.Status?.toString()}
        counts={countStatus}
        onChange={(key) => {
          form.setFieldsValue({ Status: Number(key), pageIndex: 1 });
          form.submit();
        }}
      />
    </Form>
  );
};

export default FeedFilter;
