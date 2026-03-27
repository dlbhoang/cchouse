import {
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Space,
  TimePicker,
} from "antd";

import {
  DistrictSelect,
  LocationSelect,
  ManagerSelect,
  RoleSelect,
  SimSelect,
  TransTypeSelect,
  WeekendSelect,
} from "@/lib/components/shared/MySelect";
import { BranchSelect } from "@/lib/components/shared/MySelect/BranchSelect";
import CommissionSelect from "@/lib/components/shared/MySelect/CommissionSelect";
import PriceAutoComplete from "@/lib/components/shared/PriceAutoComplete";
import { appConst } from "@/lib/core/configs/appConst";
import { ETransType } from "@/lib/core/enum";

type Props = {
  form: FormInstance;
};

const colResponsive = {
  xl: 8,
  lg: 8,
  md: 12,
  xs: 24,
};

const timeFormat = appConst.TIME_FORMAT;
const UserAccessForm = ({ form }: Props) => {
  const roleWatch = Form.useWatch("RoleId", form);
  const transTypesWatch: number[] = Form.useWatch(
    ["UserAccess", "TransTypes"],
    form
  );

  const hiddenAdminRole =
    Number(roleWatch) === 1 ? (
      <Form.Item
        label="Chức vụ"
        name="RoleId"
        rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
        hidden
      >
        <Input />
      </Form.Item>
    ) : (
      <Col {...colResponsive} xs={12}>
        <Form.Item
          label="Chức vụ"
          name="RoleId"
          rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
        >
          <RoleSelect />
        </Form.Item>
      </Col>
    );

  console.log(transTypesWatch);

  return (
    <Row gutter={12}>
      <Col {...colResponsive} xs={12}>
        <Form.Item
          label="Chi nhánh"
          name="BranchId"
          rules={[{ required: true }]}
        >
          <BranchSelect />
        </Form.Item>
      </Col>
      {hiddenAdminRole}
      <Col {...colResponsive} xs={12}>
        <Form.Item
          label="Quản lý bởi"
          name="ManagedBy"
          rules={[{ required: true, message: "Vui lòng chọn quản lý" }]}
        >
          <ManagerSelect />
        </Form.Item>
      </Col>
      <Col {...colResponsive} xs={12}>
        <Form.Item
          label="Hoa hồng"
          name="Commission"
          rules={[{ required: true, message: "Vui lòng nhập hoa hồng" }]}
        >
          <CommissionSelect />
          {/* <InputNumber style={{ width: '100%' }} /> */}
        </Form.Item>
      </Col>
      <Col {...colResponsive} xs={12}>
        <Form.Item label="SĐT Cty cấp" name="SimId">
          <SimSelect />
        </Form.Item>
      </Col>
      <Col {...colResponsive} xs={12}>
        <Form.Item label="Lương" name="Salary">
          <PriceAutoComplete />
        </Form.Item>
      </Col>

      <Col {...colResponsive} xs={12}>
        <Form.Item
          label="Ngày vào làm"
          name={["UserAccess", "DateStart"]}
          rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
        >
          <DatePicker format={["DD/MM/YYYY", "DD/MM/YY"]} />
        </Form.Item>
      </Col>
      <Col {...colResponsive} xs={12}>
        <Form.Item label="Giờ làm việc" required style={{ marginBottom: 0 }}>
          <Space>
            <Form.Item name={["UserAccess", "TimeFrom"]}>
              <TimePicker showNow={false} format={timeFormat} />
            </Form.Item>
            <Form.Item name={["UserAccess", "TimeTo"]}>
              <TimePicker showNow={false} format={timeFormat} />
            </Form.Item>
          </Space>
        </Form.Item>
      </Col>
      <Col {...colResponsive} xs={12}>
        <Form.Item label="Cuối tuần" name={["UserAccess", "WorkWeekend"]}>
          <WeekendSelect mode="multiple" />
        </Form.Item>
      </Col>
      <Col {...colResponsive}>
        <Form.Item
          label="Loại giao dịch"
          name={["UserAccess", "TransTypes"]}
          rules={[{ required: true, message: "Vui lòng chọn loại giao dịch" }]}
        >
          <TransTypeSelect mode="multiple" />
        </Form.Item>
      </Col>
      <Col {...colResponsive}>
        <Form.Item
          label="Vị trí"
          name={["UserAccess", "Locations"]}
          rules={[{ required: true, message: "Vui lòng chọn vị trí" }]}
        >
          <LocationSelect mode="multiple" />
        </Form.Item>
      </Col>

      {transTypesWatch?.includes(ETransType.sell) && (
        <>
          <Col {...colResponsive}>
            <Form.Item
              label="Quận Mua bán"
              name={["UserAccess", "DistrictIds"]}
              rules={[{ required: true, message: "Vui lòng chọn quận" }]}
            >
              <DistrictSelect mode="multiple" />
            </Form.Item>
          </Col>
          <Col {...colResponsive}>
            <Form.Item
              label="Khung giá bán (tỷ)"
              style={{ marginBottom: 0 }}
              required
            >
              <Space>
                <Form.Item
                  name={["UserAccess", "PriceFrm"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập giá bán (từ)" },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name={["UserAccess", "PriceTo"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập giá bán (đến)" },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Space>
            </Form.Item>
          </Col>
        </>
      )}
      {transTypesWatch?.includes(ETransType.rent) && (
        <>
          <Col {...colResponsive}>
            <Form.Item
              label="Quận Cho thuê"
              name={["UserAccess", "DistrictRentIds"]}
              rules={[{ required: true, message: "Vui lòng chọn quận" }]}
            >
              <DistrictSelect mode="multiple" />
            </Form.Item>
          </Col>

          <Col {...colResponsive}>
            <Form.Item
              label="Khung giá thuê (triệu)"
              style={{ marginBottom: 0 }}
              required
            >
              <Space>
                <Form.Item
                  name={["UserAccess", "PriceRentFrm"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập giá thuê (từ)" },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name={["UserAccess", "PriceRentTo"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập giá thuê (đến)" },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Space>
            </Form.Item>
          </Col>
        </>
      )}
    </Row>
  );
};

export default UserAccessForm;
