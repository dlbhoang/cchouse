import {
  Col,
  // DatePicker,
  Form,
  Row,
} from "antd";
import { useEffect } from "react";

import { SearchInput } from "@/lib/components/shared/MyFormItem";
import { AddressSelectCustom } from "@/lib/components/shared/MySelect";
import { baseFilter } from "@/lib/core/configs/appConst";
import { IParcelLandAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";

type Props = {
  model?: IParcelLandAdminOpts;
  onSubmit: (values: IParcelLandAdminOpts) => void;
};

const colStyle = {
  xs: 12,
  lg: 6,
};

const ApartmentFilter = ({ model, onSubmit }: Props) => {
  const [form] = Form.useForm();

  const onFinish = async (item: IParcelLandAdminOpts) => {
    const updatedItem = {
      ...item,
    };
    onSubmit(updatedItem);
  };

  const handleRefresh = () => {
    form.resetFields();
    onSubmit({ ...baseFilter, Status: 1 });
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
          <Form.Item>
            <AddressSelectCustom
              form={form}
              nameProvince="ProvinceId"
              nameDistrict="DistrictId"
              nameWard="WardId"
              nameStreet="StreetId"
              nameAddressNumber="AddressNumber"
              isHiddenField
            />
          </Form.Item>
        </Col>
        <Col {...colStyle}>
          <SearchInput
            form={form}
            placeholder="Tìm tên chung cư / căn hộ"
            handleRefresh={handleRefresh}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default ApartmentFilter;
