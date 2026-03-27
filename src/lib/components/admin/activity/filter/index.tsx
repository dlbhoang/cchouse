import { Col, Form, Row } from "antd";
import { useEffect } from "react";

import { DateFilter, SearchInput } from "@/lib/components/shared/MyFormItem";
import { UserAdminSelect } from "@/lib/components/shared/MySelect";
import { baseFilter } from "@/lib/core/configs/appConst";
import { IHistoryOpts } from "@/services/api/history/IHistory";

type Props = {
  model?: IHistoryOpts;
  onSubmit: (values: IHistoryOpts) => void;
};

const colStyle = {
  xs: 24,
  lg: 6,
};

const ActivityFilter = ({ model, onSubmit }: Props) => {
  const [form] = Form.useForm();

  const onFinish = async (item: IHistoryOpts) => {
    onSubmit(item);
  };

  const handleRefresh = () => {
    form.resetFields();
    onSubmit({ ...baseFilter });
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
      });
    }
  }, [form, model]);

  return (
    <Form
      name="basic"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      layout="vertical"
    >
      <Form.Item name="Status" hidden />
      <Row gutter={[12, 12]}>
        <Col {...colStyle}>
          <Form.Item name="UserId">
            <UserAdminSelect />
          </Form.Item>
        </Col>
        <Col {...colStyle}>
          <DateFilter form={form} />
        </Col>
        <Col {...colStyle}>
          <SearchInput
            form={form}
            placeholder="Tìm mã, tên"
            handleRefresh={handleRefresh}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default ActivityFilter;
