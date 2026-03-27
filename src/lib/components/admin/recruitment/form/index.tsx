import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Switch,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import ProvinceAutocomplete from "@/lib/components/shared/Autocomplete/province";
import BottomFixed from "@/lib/components/shared/BottomFixed";
import DateRange from "@/lib/components/shared/components/date-range";
import MyCard from "@/lib/components/shared/MyCard";
import { PhoneNumber } from "@/lib/components/shared/MyFormItem";
import { LiteracySelect } from "@/lib/components/shared/MySelect";
import { GenderSelect } from "@/lib/components/shared/MySelect/GenderSelect";
import PriceAutoComplete from "@/lib/components/shared/PriceAutoComplete";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { useAdminContext } from "@/lib/stored";
import { IRecruitmentRequest } from "@/services/api/recruitment/IRecruitment";
import recruitmentApi from "@/services/api/recruitment/recruitmentApi";
import { CombineAddress } from "../../../../core/utils/myFormat";

type Props = {
  model?: IRecruitmentRequest;
};

const colSizes = {
  xs: 24,
  md: 12,
  xl: 8,
};

const ageOpts = [
  { value: "Từ 16 tuổi" },
  { value: "Từ 18 tuổi" },
  { value: "Từ 18 - 50 tuổi" },
];

const MainForm = () => {
  const { data } = recruitmentApi.useGet({ pageIndex: 1, pageSize: 10 });

  const roleOpts =
    data?.data?.map((e) => ({
      label: e.Role,
      value: e.Id,
    })) ?? [];

  return (
    <Row gutter={12}>
      <Col {...colSizes}>
        <Form.Item
          name={"Places"}
          label="Khu vực tuyển dụng"
          rules={[{ required: true }]}
        >
          <ProvinceAutocomplete mode="multiple" />
        </Form.Item>
      </Col>
      <Col {...colSizes}>
        <Form.Item
          name={"Role"}
          label="Vị trí tuyển dụng"
          rules={[{ required: true }]}
        >
          <AutoComplete
            filterOption={(inputValue, option) =>
              option!.label?.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            placeholder="Tên vị trí / chức vụ"
            options={roleOpts}
          />
        </Form.Item>
      </Col>
      <Col {...colSizes}>
        <Form.Item
          name={"Quantity"}
          label="Số lượng"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>
      </Col>
      <Col {...colSizes}>
        <Form.Item
          label="Khoảng lương (VNĐ)"
          required
          style={{ marginBottom: 0 }}
        >
          <Space>
            <Form.Item
              name={"FromSalary"}
              rules={[{ required: true, message: "Vui lòng nhập lương (từ)" }]}
            >
              <PriceAutoComplete />
            </Form.Item>
            <Form.Item
              name={"ToSalary"}
              rules={[{ required: true, message: "Vui lòng nhập lương (đến)" }]}
            >
              <PriceAutoComplete />
            </Form.Item>
          </Space>
        </Form.Item>
      </Col>
      <Col {...colSizes}>
        <Form.Item
          label="Hạn nộp hồ sơ"
          name={"DateRangeValues"}
          rules={[{ required: true }]}
        >
          <DateRange />
        </Form.Item>
      </Col>
      <Col {...colSizes}>
        <Form.Item label="Tuổi" name={"Age"}>
          <AutoComplete
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            placeholder="Yêu cầu về độ tuổi"
            options={ageOpts}
          />
        </Form.Item>
      </Col>
      <Col {...colSizes}>
        <Form.Item label="Giới tính" name={"Gender"}>
          <GenderSelect />
        </Form.Item>
      </Col>
      <Col {...colSizes}>
        <Form.Item label="Trình độ" name={"Education"}>
          <LiteracySelect />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item
          name={"Content"}
          label="Mô tả công việc"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            rows={6}
            placeholder="Sơ lược các việc cần làm, thời gian làm việc, ..."
          />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item name={"Benefit"} label="Quyền lợi">
          <Input.TextArea
            rows={6}
            placeholder="Các phúc lợi, bảo hiểm, du lịch cty,..."
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

const RecruitmentForm = ({ model }: Props) => {
  const router = useRouter();
  const { smallScreen, branches } = useAdminContext();
  const { data: session } = useSession();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm<IRecruitmentRequest>();

  const hiddenWatch: boolean = Form.useWatch("IsHidden", form) ?? false;

  const onFinish = async (values: IRecruitmentRequest) => {
    try {
      setIsSubmit(true);
      const dateRanges = values.DateRangeValues;
      const result: IRecruitmentRequest = {
        ...values,
        IsHidden: !values.IsHidden,
        BeginDate: dateRanges?.[0].format(appConst.SUBMIT_DATE_FORMAT),
        EndDate: dateRanges?.[1].format(appConst.SUBMIT_DATE_FORMAT),
      };
      if (model?.Id) {
        await recruitmentApi.update(result);
      } else await recruitmentApi.add(result);
      mutate(recruitmentApi.mutateKey);
      router.replace(AppRoutes.recruitment.url);
    } finally {
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
        IsHidden: !model.IsHidden,
        DateRangeValues: [dayjs(model.BeginDate), dayjs(model.EndDate)],
      });
    }
  }, [form, model]);

  const userBranch = branches.find((x) => x.Id === session?.user.BranchId);

  return (
    <Form
      name="basic"
      initialValues={{
        IsHidden: true,
        ContactPhone: userBranch?.ContactPhone,
        ContactAddress: CombineAddress({ ...userBranch }),
        ContactEmail: userBranch?.ContactEmail,
      }}
      onFinish={onFinish}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      form={form}
      layout="vertical"
      disabled={isSubmit}
    >
      <Form.Item name="Id" hidden>
        <Input />
      </Form.Item>

      <Row gutter={[12, 12]}>
        <Col xs={24} md={16}>
          <MyCard
            title="1. Thông tin tuyển dụng"
            size="default"
            extra={
              <Space align="center">
                <Form.Item valuePropName="checked" name={"IsHidden"} noStyle>
                  <Switch />
                </Form.Item>
                <span>{!hiddenWatch ? "Ẩn tin" : "Đang hiển thị"}</span>
              </Space>
            }
          >
            <MainForm />
          </MyCard>
        </Col>
        <Col xs={24} md={8}>
          <MyCard title="2. Yêu cầu" size="default">
            <Form.Item name={"Requirement"}>
              <Input.TextArea
                rows={6}
                placeholder="Trình độ học vấn, kinh nghiệm, độ tuổi, ..."
              />
            </Form.Item>
          </MyCard>
          <br />
          <MyCard title="3. Thông tin liên hệ" size="default">
            <PhoneNumber label="Số điện thoại" name={"ContactPhone"} required />
            <Form.Item
              name={"ContactAddress"}
              label="Địa chỉ"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name={"ContactEmail"} label="Email">
              <Input />
            </Form.Item>
          </MyCard>
        </Col>
      </Row>
      <BottomFixed>
        <Space>
          <Button
            type="primary"
            size="large"
            block={smallScreen}
            loading={isSubmit}
            htmlType="submit"
          >
            {model ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Space>
      </BottomFixed>
    </Form>
  );
};

export default RecruitmentForm;
