import { Col, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";
import ProvinceAutocomplete from "@/lib/components/shared/Autocomplete/province";
import { DateFilter, SearchInput } from "@/lib/components/shared/MyFormItem";
import StatusTabs from "@/lib/components/shared/status-tabs";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { IRecruitmentOpts } from "@/lib/interfaces/filter/ISearchOptions";
import recruitmentApi from "@/services/api/recruitment/recruitmentApi";
import { baseFilter } from "../../../../core/configs/appConst";

const colStyle = {
  xs: 12,
  lg: 8,
};

const hiddenFields = ["Status", "IsWebsite", "pageSize", "pageIndex"];

type Props = {
  model?: IRecruitmentOpts;
  onSubmit: (values: IRecruitmentOpts) => void;
};

const RecruitmentFilter = ({ model, onSubmit }: Props) => {
  const [form] = Form.useForm<IRecruitmentOpts>();
  const [countStatus, setCountStatus] = useState<ICountItem[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await recruitmentApi.countStatus(model);
      setCountStatus(result.data);
    };
    fetch();
  }, [model]);

  useEffect(() => {
    form.setFieldsValue({
      ...model,
    });
  }, [form, model]);

  const handleRefresh = () => {
    form.resetFields();
    onSubmit({
      ...baseFilter,
      pageIndex: 1,
    });
  };

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

      <Row gutter={12}>
        <Col {...colStyle}>
          <Form.Item name="Place">
            <ProvinceAutocomplete />
          </Form.Item>
        </Col>

        <Col {...colStyle}>
          <DateFilter form={form} />
        </Col>
        <Col xs={16} lg={12} xl={8}>
          <SearchInput
            form={form}
            placeholder="Tìm theo vị trí"
            handleRefresh={handleRefresh}
          />
        </Col>
      </Row>
      <TitlePage
        title={`Danh sách ${AppRoutes.recruitment.name.toUpperCase()}`}
      />
      <StatusTabs
        counts={countStatus}
        onChange={(key) => {
          form.setFieldsValue({ Status: Number(key), pageIndex: 1 });
          form.submit();
        }}
      />
    </Form>
  );
};

export default RecruitmentFilter;
