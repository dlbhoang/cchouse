import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";

import { SearchInput } from "@/lib/components/shared/MyFormItem";
import { ManagerSelect, RoleSelect } from "@/lib/components/shared/MySelect";
import { BranchSelect } from "@/lib/components/shared/MySelect/BranchSelect";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { IUserAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";
import UserStatusTabs from "../../statusTabs";

type Props = {
  model?: IUserAdminOpts;
  onSubmit: (values: IUserAdminOpts) => void;
};

const colStyle = {
  xs: 24,
  lg: 6,
};

const UserAdminFilter = ({ model, onSubmit }: Props) => {
  const [form] = Form.useForm<IUserAdminOpts>();
  const [countStatus, setCountStatus] = useState<ICountItem[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await userAdminApi.countStatus(model);
      setCountStatus(result.data);
    };
    fetch();
  }, [model]);

  const onFinish = async (item: IUserAdminOpts) => {
    onSubmit(item);
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
      <Form.Item name="Status" hidden />
      <Row gutter={12} align="bottom">
        <Col {...colStyle}>
          <Form.Item name="BranchId">
            <BranchSelect />
          </Form.Item>
        </Col>
        <Col {...colStyle}>
          <Form.Item name="ManagedBy">
            <ManagerSelect />
          </Form.Item>
        </Col>
        <Col {...colStyle}>
          <Form.Item name="RoleId">
            <RoleSelect />
          </Form.Item>
        </Col>
        <Col {...colStyle}>
          <SearchInput
            form={form}
            placeholder="Tìm mã, tên"
            handleRefresh={handleRefresh}
          />
        </Col>
        <Col span={24}>
          <TitlePage title={`Quản lý ${AppRoutes.userAdmin.name}`} />
        </Col>
        <Col span={24}>
          <UserStatusTabs
            counts={countStatus}
            onChange={(key) => {
              form.setFieldsValue({ Status: Number(key), pageIndex: 1 });
              form.submit();
            }}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default UserAdminFilter;
