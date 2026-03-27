import { Col, Form, Row } from "antd";
import { useEffect } from "react";

import { DateFilter, SearchInput } from "@/lib/components/shared/MyFormItem";
import SelectBase from "@/lib/components/shared/MySelect/base/SelectBase";
import { baseFilter } from "@/lib/core/configs/appConst";
import { ETableName } from "@/lib/core/enum";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import type { IUserAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import type { IBaseOpts } from "@/services/api/base";

type Props = {
  model?: IBaseOpts;
  onSubmit: (values: IBaseOpts) => void;
};

const colStyle = {
  xs: 24,
  lg: 6,
};

const ImageCloudFilter = ({ model, onSubmit }: Props) => {
  const [form] = Form.useForm<IBaseOpts>();

  const onFinish = async (item: IUserAdminOpts) => {
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
      <Row gutter={12}>
        <Col {...colStyle}>
          <Form.Item name="TableName">
            <SelectBase
              options={Object.keys(ETableName).map((item) => ({
                label: item,
                value: item,
              }))}
            />
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

        <Col span={24}>
          <TitlePage title={"Ảnh cloud"} />
        </Col>
      </Row>
    </Form>
  );
};

export default ImageCloudFilter;
