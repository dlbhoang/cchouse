import { Button, Col, Form, Input, Row, Tabs, Tooltip } from 'antd';
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
import SelectBase from '@/lib/components/shared/MySelect/base/SelectBase';
import { baseFilter } from '@/lib/core/configs/appConst';
import { AppRoutes } from '@/lib/core/configs/appRoutes';
import { ETransType } from '@/lib/core/enum';
import TitlePage from '@/lib/core/layout/components/TitlePage';
import { globalHandleFailed } from '@/lib/core/utils/ant-func';
import { convertToNumber } from '@/lib/core/utils/myFormat';
import { ICountItem } from '@/lib/interfaces/base/ICountStatus';
import { ICustomerOpts } from '@/lib/interfaces/filter/ISearchOptions';
import { IWardResponse } from '@/lib/interfaces/ConfigAddress/IConfigAddress';
import customerApi from '@/services/api/customer/customerApi';
import wardApi from '@/services/api/wardApi';

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
  const wardIds = Form.useWatch('WardIds', form);
  const wardFilterKey = Array.isArray(wardIds) ? wardIds.join(',') : (wardIds ?? '');
  const lastCreatedBy = useRef(createdBy);
  const lastWardIds = useRef(wardFilterKey);
  const [wards, setWards] = useState<IWardResponse[]>([]);

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

  useEffect(() => {
    if (lastWardIds.current !== wardFilterKey) {
      lastWardIds.current = wardFilterKey;
      form.submit();
    }
  }, [wardFilterKey, form]);

  useEffect(() => {
    let cancelled = false;
    wardApi.get({ pageIndex: 1, pageSize: 10000, IsNew: true })
      .then((res) => {
        if (!cancelled) setWards(res.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setWards([]);
      });
    return () => { cancelled = true; };
  }, []);

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
        <Col xs={24} md={8} xl={4}>
          <Form.Item name="Type" noStyle>
            <CustomerTypeSelect className="w-full" placeholder="Khách hàng" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8} xl={4}>
          <DateFilter form={form} />
        </Col>
        <Col xs={24} xl={16}>
          <SearchInput
            form={form}
            placeholder="Tìm theo tên, số điện thoại"
            handleRefresh={handleRefresh}
            hideRefresh
            searchButtonLabel="Tìm kiếm"
          />
        </Col>

        <Col xs={24} md={8} xl={5}>
          <Form.Item name="CreatedBy" noStyle>
            <UserAdminSelect
              valueAsName
              allowClear
              placeholder="Nhân viên chăm sóc"
              aria-label="Lọc theo nhân sự chăm sóc"
              className="w-full"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8} xl={5}>
          <Form.Item name="WardIds" noStyle>
            <SelectBase
              mode="multiple"
              allowClear
              placeholder="Khu vực"
              aria-label="Lọc theo khu vực"
              className="w-full"
              options={wards.map((ward) => ({
                value: ward.Id,
                label: `${ward.Name}${ward.ProvinceName ? ` · ${ward.ProvinceName}` : ''}`,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8} xl={5}>
          <PriceFilter form={form} showPresets={false} />
        </Col>
        <Col xs={24} md={8} xl={5}>
          <AreaFilter form={form} />
        </Col>
        <Col xs={24} xl={4} className="flex justify-end">
          <Tooltip title="Đặt lại bộ lọc">
            <Button
              aria-label="Đặt lại bộ lọc"
              icon={<RotateCcw size={16} strokeWidth={1.8} />}
              onClick={handleRefresh}
              style={{ color: '#0588f0', borderColor: '#0588f0' }}
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
                style={{ backgroundColor: '#0588f0', borderColor: '#0588f0' }}
              >
                Thêm mới
              </Button>
            )}
          </div>
        </Col>
        <Col span={24}>
          <Form.Item name="PriceFrm" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="PriceTo" hidden>
            <Input />
          </Form.Item>
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
