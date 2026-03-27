import { Col, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";

import { DateFilter, SearchInput } from "@/lib/components/shared/MyFormItem";
import { UserAdminSelect } from "@/lib/components/shared/MySelect";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";
import feedApi from "@/services/api/feed/feedApi";
import { baseFilter } from "../../../../core/configs/appConst";

const colStyle = {
  xs: 12,
  lg: 8,
};

const hiddenFields = ["Status", "IsWebsite", "pageSize", "pageIndex"];

type Props = {
  model?: ISearchOptions;
  isWebsite?: boolean;

  onSubmit: (values: ISearchOptions) => void;
};

const NewsFilter = ({ model, isWebsite, onSubmit }: Props) => {
  const { smallScreen } = useAdminContext();
  const [form] = Form.useForm<ISearchOptions>();
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
      });
    }
  }, [form, model]);

  const handleRefresh = () => {
    form.resetFields();
    onSubmit({
      ...baseFilter,
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
          <Col {...colStyle}>
            <Form.Item name="CreatedBy">
              <UserAdminSelect valueAsName placeholder="Người đăng" />
            </Form.Item>
          </Col>
          <Col {...colStyle}>
            <DateFilter form={form} />
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
            <Form.Item name="CreatedBy">
              <UserAdminSelect valueAsName placeholder="Người đăng" />
            </Form.Item>
          </Col>
          <Col {...colStyle}>
            <DateFilter form={form} />
          </Col>
          <Col xs={16} lg={12} xl={8}>
            <SearchInput
              form={form}
              placeholder="Tìm theo tiêu đề"
              handleRefresh={handleRefresh}
            />
          </Col>
        </Row>
      )}
      <TitlePage title={AppRoutes.news.name.toUpperCase()} />
    </Form>
  );
};

export default NewsFilter;
