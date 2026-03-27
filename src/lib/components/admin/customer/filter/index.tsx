import { Col, Form, Input, Row, Tabs } from "antd";
import { useEffect, useState } from "react";

import {
  AreaFilter,
  DateFilter,
  PriceFilter,
  SearchInput,
} from "@/lib/components/shared/MyFormItem";
import { CustomerTypeSelect } from "@/lib/components/shared/MySelect";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { convertToNumber } from "@/lib/core/utils/myFormat";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { ICustomerOpts } from "@/lib/interfaces/filter/ISearchOptions";
import customerApi from "@/services/api/customer/customerApi";

type Props = {
  model?: ICustomerOpts;
  onSubmit: (values: ICustomerOpts) => void;
};

const colStyle = {
  xs: 12,
  lg: 6,
  xl: 4,
};
const CustomerFilter = ({ model, onSubmit }: Props) => {
  const [form] = Form.useForm<ICustomerOpts>();
  const [counts, setCounts] = useState<ICountItem[]>([]);

  const handleRefresh = () => {
    form.resetFields();
    onSubmit({ ...baseFilter, TransType: ETransType.sell });
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await customerApi.countStatus(model);
      setCounts(res.data);
    };
    fetch();
  }, [model]);

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
        search: model.search,
        PriceFrm: convertToNumber(model.PriceFrm),
        PriceTo: convertToNumber(model.PriceTo),
        AreaFrm: convertToNumber(model.AreaFrm),
        AreaTo: convertToNumber(model.AreaTo),
      });
    }
  }, [form, model]);

  return (
    <Form
      name="basic"
      initialValues={{
        TransType: ETransType.sell,
      }}
      onFinish={onSubmit}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      form={form}
      layout="vertical"
    >
      <Row gutter={[12, 12]}>
        <Col {...colStyle}>
          <Form.Item name="Type" noStyle>
            <CustomerTypeSelect />
          </Form.Item>
        </Col>

        <Col {...colStyle}>
          <PriceFilter form={form} />
        </Col>
        <Col {...colStyle}>
          <AreaFilter form={form} />
        </Col>
        <Col {...colStyle}>
          <DateFilter form={form} />
        </Col>
        <Col xs={24} lg={12} xl={8}>
          <SearchInput
            form={form}
            placeholder="Tìm tên, số diện thoại,..."
            handleRefresh={handleRefresh}
          />
        </Col>
        <Col span={24}>
          <TitlePage title={`Quản lý ${AppRoutes.customer.name}`} />
        </Col>
        <Col span={24}>
          <Form.Item name="TransType" hidden>
            <Input />
          </Form.Item>
          <Tabs
            items={[
              {
                key: ETransType.sell.toString(),
                label: `Tìm mua (${
                  counts.find((x) => x.Id === ETransType.sell)?.Count ?? 0
                })`,
              },
              {
                key: ETransType.rent.toString(),
                label: `Tìm thuê (${
                  counts.find((x) => x.Id === ETransType.rent)?.Count ?? 0
                })`,
              },
            ]}
            activeKey={model?.TransType?.toString()}
            onChange={(key) => {
              form.resetFields();
              form.setFieldsValue({ TransType: Number(key) });
              form.submit();
            }}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default CustomerFilter;
