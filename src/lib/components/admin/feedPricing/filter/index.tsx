import { Col, Form, Row } from "antd";

import { SearchInput } from "@/lib/components/shared/MyFormItem";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { IFeedFilter } from "@/lib/interfaces/filter/ISearchOptions";

type Props = {
  model?: IFeedFilter;
  onSubmit: (values: IFeedFilter) => void;
};

const colStyle = {
  xs: 24,
  lg: 6,
};

const FeedPricingFilter = ({ model, onSubmit }: Props) => {
  const [form] = Form.useForm();
  const onFinish = async (item: IFeedFilter) => {
    console.log("Success:", item);
    onSubmit(item);
  };

  const handleRefresh = () => {
    form.resetFields(["Search", "ManagedBy", "RoleId"]);
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
      <Form.Item name="pageSize" hidden />
      <Form.Item name="pageIndex" hidden />
      <Row gutter={12} align="bottom">
        {/* <Col {...colStyle}>
          <Form.Item label="Quản lý bởi" name="ManagedBy">
            <ManagerSelect />
          </Form.Item>
        </Col>
        <Col {...colStyle}>
          <Form.Item label="Chức vụ" name="RoleId">
            <RoleSelect />
          </Form.Item>
        </Col> */}
        <Col {...colStyle}>
          <SearchInput
            form={form}
            placeholder="Tìm mã, tên,..."
            handleRefresh={handleRefresh}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default FeedPricingFilter;
