import { Button, Col, Form, Input, Row, Tabs, Tooltip } from 'antd';
import { Plus, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  AreaFilter,
  DateFilter,
  PriceFilter,
  SearchInput,
} from '@/lib/components/shared/MyFormItem';
import { CustomerTypeSelect } from '@/lib/components/shared/MySelect';
import { baseFilter } from '@/lib/core/configs/appConst';
import { AppRoutes } from '@/lib/core/configs/appRoutes';
import { ETransType } from '@/lib/core/enum';
import TitlePage from '@/lib/core/layout/components/TitlePage';
import { globalHandleFailed } from '@/lib/core/utils/ant-func';
import { convertToNumber } from '@/lib/core/utils/myFormat';
import { ICountItem } from '@/lib/interfaces/base/ICountStatus';
import { ICustomerOpts } from '@/lib/interfaces/filter/ISearchOptions';
import customerApi from '@/services/api/customer/customerApi';

type Props = {
  model?: ICustomerOpts;
  onSubmit: (values: ICustomerOpts) => void;
  onCreateCustomer: () => void;
  onOpenListings: () => void;
  showDesktopCreateButton: boolean;
};

const CustomerFilter = ({
  model,
  onSubmit,
  onCreateCustomer,
  onOpenListings,
  showDesktopCreateButton,
}: Props) => {
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
        <Col xs={24} xl={6}>
          <DateFilter form={form} />
        </Col>
        <Col xs={24} xl={18}>
          <SearchInput
            form={form}
            placeholder="Tìm tên, số điện thoại,..."
            handleRefresh={handleRefresh}
            hideRefresh
          />
        </Col>

        <Col xs={24} md={8} xl={6}>
          <Form.Item name="Type" noStyle>
            <CustomerTypeSelect />
          </Form.Item>
        </Col>
        <Col xs={24} md={8} xl={6}>
          <PriceFilter form={form} />
        </Col>
        <Col xs={24} md={8} xl={6}>
          <AreaFilter form={form} />
        </Col>
        <Col xs={24} xl={6} className="flex justify-end">
          <Tooltip title="Đặt lại bộ lọc">
            <Button
              aria-label="Đặt lại bộ lọc"
              icon={<RotateCcw size={16} strokeWidth={1.8} />}
              onClick={handleRefresh}
              style={{ color: '#0788f5', borderColor: '#0788f5' }}
            />
          </Tooltip>
        </Col>

        <Col span={24}>
          <div className="flex min-h-10 items-center justify-between gap-3">
            <TitlePage title={`Quản lý ${AppRoutes.customer.name}`} />
            {showDesktopCreateButton && (
              <Button
                type="primary"
                icon={<Plus size={16} strokeWidth={1.8} />}
                onClick={onCreateCustomer}
                style={{ backgroundColor: '#0788f5', borderColor: '#0788f5' }}
              >
                Thêm mới
              </Button>
            )}
          </div>
        </Col>
        <Col span={24}>
          <Form.Item name="TransType" hidden>
            <Input />
          </Form.Item>
          <Tabs
            items={[
              {
                key: ETransType.sell.toString(),
                label: `Tìm mua (${counts.find((x) => x.Id === ETransType.sell)?.Count ?? 0})`,
              },
              {
                key: ETransType.rent.toString(),
                label: `Tìm thuê (${counts.find((x) => x.Id === ETransType.rent)?.Count ?? 0})`,
              },
              { key: 'feed', label: 'Tin đăng' },
            ]}
            activeKey={model?.TransType?.toString()}
            onChange={(key) => {
              if (key === 'feed') {
                onOpenListings();
                return;
              }
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
