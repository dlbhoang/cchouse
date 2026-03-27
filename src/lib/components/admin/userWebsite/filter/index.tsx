import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { Col, Form, Row, Segmented } from "antd";
import { usePathname, useRouter } from "next/navigation";

import { SearchInput } from "@/lib/components/shared/MyFormItem";
import { UserWebsiteStatusSelect } from "@/lib/components/shared/MySelect/userWebsite/status-select";
import { UserWebsiteTypeSelect } from "@/lib/components/shared/MySelect/userWebsite/type-select";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { useAdminContext } from "@/lib/stored";
import type { IUserWebsiteOpts } from "@/services/api/userWebsite/model";

type Props = {
  model?: IUserWebsiteOpts;
  onSubmit: (values: IUserWebsiteOpts) => void;
};

const UserWebsiteFilter = ({ model, onSubmit }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { smallScreen } = useAdminContext();
  const [form] = Form.useForm<IUserWebsiteOpts>();
  form.setFieldsValue({ ...model });

  const handleRefresh = () => {
    onSubmit({ ...baseFilter });
  };

  return (
    <Row gutter={12} align="bottom" justify={"space-between"}>
      <Col span={24}>
        <TitlePage title={`Khách hàng ${AppRoutes.userWebsite.name}`} />
      </Col>
      <Col xs={18}>
        <Form
          name="basic"
          onFinish={onSubmit}
          onFinishFailed={globalHandleFailed(form)}
          autoComplete="off"
          form={form}
          layout={smallScreen ? "vertical" : "inline"}
        >
          <Form.Item name="IsActive" hidden />
          <Form.Item name="Status">
            <UserWebsiteStatusSelect />
          </Form.Item>
          <Form.Item name="Type">
            <UserWebsiteTypeSelect />
          </Form.Item>
          <SearchInput
            form={form}
            placeholder="Tìm theo tên, số điện thoại, email,..."
            handleRefresh={handleRefresh}
          />
        </Form>
      </Col>
      <Col>
        <Segmented
          options={[
            { value: "list", icon: <BarsOutlined /> },
            { value: "card", icon: <AppstoreOutlined /> },
          ]}
          onChange={(value) => {
            router.push(
              `${pathname}?${objToQueryString({
                ...model,
                view: value,
              })}`
            );
          }}
          value={model?.view ?? "list"}
        />
      </Col>
    </Row>
  );
};

export default UserWebsiteFilter;
