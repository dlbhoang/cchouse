import { Button, Col, Form, Row, Select, Space, Tooltip } from "antd";
import { Building2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SearchInput } from "@/lib/components/shared/MyFormItem";
import { ManagerSelect, RoleSelect } from "@/lib/components/shared/MySelect";
import { BranchSelect } from "@/lib/components/shared/MySelect/BranchSelect";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { IUserAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";

type Props = {
  model?: IUserAdminOpts;
  onSubmit: (values: IUserAdminOpts) => void;
};

const UserAdminFilter = ({ model, onSubmit }: Props) => {
  const [form] = Form.useForm<IUserAdminOpts>();
  const [countStatus, setCountStatus] = useState<ICountItem[]>([]);
  const router = useRouter();
  const { enumList, smallScreen } = useAdminContext();
  const statusOptions = enumList.UserStatus.map((item) => ({
    value: item.Value,
    label: `${item.Name} (${countStatus.find((status) => status.Id === item.Value)?.Count ?? 0})`,
  }));

  if (!statusOptions.some((item) => item.value === 4)) {
    statusOptions.push({
      value: 4,
      label: `Từ chối (${countStatus.find((status) => status.Id === 4)?.Count ?? 0})`,
    });
  }

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
        Status: model.Status ?? 1,
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
      <Row gutter={[12, 0]} align="bottom">
        <Col xs={24} md={8} xl={4}>
          <Form.Item name="BranchId">
            <BranchSelect />
          </Form.Item>
        </Col>
        <Col xs={24} md={8} xl={4}>
          <Form.Item name="ManagedBy">
            <ManagerSelect />
          </Form.Item>
        </Col>
        <Col xs={24} md={8} xl={4}>
          <Form.Item name="RoleId">
            <RoleSelect />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={4}>
          <SearchInput
            form={form}
            placeholder="Tìm mã, tên"
            handleRefresh={handleRefresh}
          />
        </Col>
        <Col xs={24} md={12} xl={4}>
          <Form.Item>
            <Tooltip title="API nhân sự hiện chưa có dữ liệu phòng ban">
              <Select className="w-full" placeholder="Phòng ban" disabled />
            </Tooltip>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={4}>
          <Form.Item name="Status">
            <Select
              className="w-full"
              placeholder="Trạng thái hoạt động"
              options={statusOptions}
              onChange={() => {
                form.setFieldsValue({ pageIndex: 1 });
                form.submit();
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <TitlePage title={`Quản lý ${AppRoutes.userAdmin.name}`} />
            <Space wrap>
              <Button
                icon={<Building2 className="size-4" />}
                onClick={() => router.push(AppRoutes.branch.url)}
              >
                Chi nhánh
              </Button>
              <Button
                type="primary"
                icon={<Plus className="size-4" />}
                aria-label="Thêm mới nhân viên"
                onClick={() => router.push(`${AppRoutes.userAdmin.url}/add`)}
              >
                {!smallScreen && "Thêm mới"}
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default UserAdminFilter;
