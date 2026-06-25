import { Col, Form, Input, Row } from "antd";
import { useEffect } from "react";

import { DateFilter } from "@/lib/components/shared/MyFormItem";
import { UserAdminSelect } from "@/lib/components/shared/MySelect";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";

const colStyle = {
  xs: 24,
  sm: 8,
};

const hiddenFields = ["Status", "IsWebsite", "pageSize", "pageIndex"];

type Props = {
  model?: ISearchOptions;
  onSubmit: (values: ISearchOptions) => void;
};

const NewsFilter = ({ model, onSubmit }: Props) => {
  const { smallScreen } = useAdminContext();
  const [form] = Form.useForm<ISearchOptions>();

  useEffect(() => {
    if (!model) {
      return;
    }

    form.setFieldsValue({
      ...model,
    });
  }, [form, model]);

  const filterFields = (
    <Row gutter={12}>
      <Col {...colStyle} className="news-filter-col--user">
        <Form.Item name="CreatedBy">
          <UserAdminSelect
            valueAsName
            placeholder="Người đăng"
            onChange={() => form.submit()}
          />
        </Form.Item>
      </Col>
      <Col {...colStyle}>
        <Form.Item>
          <DateFilter
            form={form}
            placeholder={["Chọn ngày", "Chọn ngày"]}
            onValueChange={() => form.submit()}
          />
        </Form.Item>
      </Col>
      <Col {...colStyle}>
        <Form.Item name="Search">
          <Input
            placeholder="Tìm kiếm theo tiêu đề"
            allowClear
            onPressEnter={() => form.submit()}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  return (
    <Form
      name="news-filter"
      className="news-filter-form"
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
        <div>
          <div
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Row gutter={12} wrap={false}>
              <Col flex="200px" className="news-filter-col--user">
                <Form.Item name="CreatedBy">
                  <UserAdminSelect
                    valueAsName
                    placeholder="Người đăng"
                    onChange={() => form.submit()}
                  />
                </Form.Item>
              </Col>
              <Col flex="200px">
                <DateFilter
                  form={form}
                  placeholder={["Chọn ngày", "Chọn ngày"]}
                  onValueChange={() => form.submit()}
                />
              </Col>
            </Row>
          </div>
          <Form.Item name="Search">
            <Input
              placeholder="Tìm kiếm theo tiêu đề"
              allowClear
              onPressEnter={() => form.submit()}
            />
          </Form.Item>
        </div>
      ) : (
        filterFields
      )}
    </Form>
  );
};

export default NewsFilter;
