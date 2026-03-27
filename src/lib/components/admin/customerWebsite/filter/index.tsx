import { Col, Form, Row } from "antd";

import BlockStatusTabs from "../statusTabs";
import { SearchInput } from "@/lib/components/shared/MyFormItem";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { ICustomerWebsiteFilter } from "@/lib/interfaces/filter/ISearchOptions";

type Props = {
  model?: ICustomerWebsiteFilter;
  onSubmit: (values: ICustomerWebsiteFilter) => void;
};

const colStyle = {
  xs: 24,
  lg: 6,
};

const CustomerWebsiteFilter = ({ model, onSubmit }: Props) => {
  console.log("IsActive");
  console.log(model?.IsActive);
  const [form] = Form.useForm();
  const onFinish = async (item: ICustomerWebsiteFilter) => {
    onSubmit(item);
  };

  const handleRefresh = () => {
    form.resetFields(["Search"]);
    form.submit();
  };

  return (
    <Form
      name="basic"
      initialValues={model}
      onFinish={onFinish}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      form={form}
      layout="vertical"
    >
      <Form.Item name="IsActive" hidden />
      <Form.Item name="pageSize" hidden />
      <Form.Item name="pageIndex" hidden />
      <Row gutter={12} align="bottom">
        <Col {...colStyle}>
          <SearchInput
            form={form}
            placeholder="Tìm mã, tên,..."
            handleRefresh={handleRefresh}
          />
        </Col>
        <Col span={24}>
          <TitlePage title={`Khách hàng ${AppRoutes.userWebsite.name}`} />
        </Col>
        <Col span={24}>
          <BlockStatusTabs
            onChange={(key) => {
              form.setFieldValue("IsActive", key);
              form.submit();
            }}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default CustomerWebsiteFilter;
