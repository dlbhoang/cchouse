import { Button, Col, Form, Input, Row, Select, Tabs, Tooltip } from 'antd';
import { Plus, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  AreaFilter,
  DateFilter,
  PriceFilter,
  SearchInput,
} from '@/lib/components/shared/MyFormItem';
import {
  CustomerTypeSelect,
  UserAdminSelect,
} from '@/lib/components/shared/MySelect';
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
  const priceFrm = Form.useWatch('PriceFrm', form);
  const priceTo = Form.useWatch('PriceTo', form);
  const createdBy = Form.useWatch('CreatedBy', form);
  const lastCreatedBy = useRef(createdBy);

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

  useEffect(() => {
    if (lastCreatedBy.current !== createdBy) {
      lastCreatedBy.current = createdBy;
      form.submit();
    }
  }, [createdBy, form]);

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
        <Col xs={24} md={8} xl={3}>
          <Form.Item name="CreatedBy" noStyle>
            <UserAdminSelect
              valueAsName
              allowClear
              placeholder="Khách hàng"
              aria-label="Lọc theo nhân sự chăm sóc"
              className="w-full"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8} xl={4}>
          <DateFilter form={form} />
        </Col>
        <Col xs={24} xl={17}>
          <SearchInput
            form={form}
            placeholder="Tìm tên, số điện thoại,..."
            handleRefresh={handleRefresh}
            hideRefresh
          />
        </Col>

        <Col xs={24} md={8} xl={5}>
          <Form.Item name="Type" noStyle>
            <CustomerTypeSelect className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8} xl={4}>
          <Select
            allowClear
            placeholder="Giá (tỷ)"
            aria-label="Lọc nhanh theo giá"
            className="h-9 w-full"
            value={(() => {
              const from = Number(priceFrm ?? 0);
              const to = Number(priceTo ?? 0);
              if (from === 0 && to === 10) return '0-10';
              if (from === 10 && to === 20) return '10-20';
              if (from === 20 && to === 30) return '20-30';
              if (from === 30 && to === 40) return '30-40';
              return undefined;
            })()}
            options={[
              { value: '0-10', label: 'Dưới 10 tỷ' },
              { value: '10-20', label: 'Từ 10 - 20 tỷ' },
              { value: '20-30', label: 'Từ 20 - 30 tỷ' },
              { value: '30-40', label: 'Từ 30 - 40 tỷ' },
            ]}
            onChange={(value: string | undefined) => {
              const ranges: Record<string, [number, number]> = {
                '0-10': [0, 10],
                '10-20': [10, 20],
                '20-30': [20, 30],
                '30-40': [30, 40],
              };
              const range = value ? ranges[value] : undefined;
              form.setFieldsValue({
                PriceFrm: range?.[0],
                PriceTo: range?.[1],
              });
              form.submit();
            }}
          />
        </Col>
        <Col xs={24} md={8} xl={5}>
          <PriceFilter form={form} showPresets={false} />
        </Col>
        <Col xs={24} md={8} xl={5}>
          <AreaFilter form={form} />
        </Col>
        <Col xs={24} xl={5} className="flex justify-end">
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
