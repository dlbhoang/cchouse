import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Form, Image, Input, Modal, Select, Space, Typography, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useMediaQuery } from "react-responsive";
import { PhoneNumber } from "@/lib/components/shared/MyFormItem";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import authApi from "@/services/auth/authApi";
import type { IRegisterAdmin } from "@/services/api/userAdmin/IUserAdmin";
import { fileServices } from "@/services/api/services/fileServices";

const { Text, Title, Link } = Typography;

// TODO: thay bằng enum/API thật khi có — tạm để danh sách mẫu
const positionOptions = [
  "Nhân viên kinh doanh",
  "Trưởng nhóm kinh doanh",
  "Quản lý kinh doanh",
  "Nhân viên marketing",
  "Nhân viên hành chính",
  "Khác",
];

const levelOptions = ["Trung học phổ thông", "Trung cấp", "Cao đẳng", "Đại học", "Sau đại học"];
const passwordPattern =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-]).{8,15}$/;

const getEmailDomainByPosition = (position?: string) => {
  const normalizedPosition = (position ?? "").toLowerCase();
  const isSales =
    normalizedPosition.includes("kinh doanh") ||
    normalizedPosition.includes("marketing") ||
    normalizedPosition.includes("sale");

  return isSales ? "@gmail.com" : "@cchouse.vn";
};

const isSalesPosition = (position?: string) => {
  const normalizedPosition = (position ?? "").toLowerCase();
  return (
    normalizedPosition.includes("kinh doanh") ||
    normalizedPosition.includes("marketing") ||
    normalizedPosition.includes("sale")
  );
};

const normalizeEmailLocalPart = (value?: string) => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "";
  return trimmed.split("@")[0].trim();
};

type Props = {
  isVisible: boolean;
  onModeChange: () => void;
};

const RegisterForm = ({ isVisible, onModeChange }: Props) => {
  const isMobile = useMediaQuery({ query: "(max-width: 480px)" });
  const [form] = Form.useForm<IRegisterAdmin>();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [registrationValues, setRegistrationValues] = useState<Partial<IRegisterAdmin>>({});
  const [identityFiles, setIdentityFiles] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const agreedTerms = Form.useWatch("AgreeTerms", form);
  const positionValue = Form.useWatch("Position", form) ?? "";
  const isSales = isSalesPosition(positionValue);
  const passwordValue = Form.useWatch("Password", form) ?? "";
  const passwordRequirements = [
    { label: "Phải từ 8-15 ký tự", valid: passwordValue.length >= 8 && passwordValue.length <= 15 },
    { label: "Phải chứa 1 ký tự viết hoa", valid: /[A-Z]/.test(passwordValue) },
    {
      label: "Phải chứa số, chữ cái và ký tự đặc biệt",
      valid:
        /[0-9]/.test(passwordValue) &&
        /[a-zA-Z]/.test(passwordValue) &&
        /[!@#$%^&*(),.?":{}|<>_\-]/.test(passwordValue),
    },
  ];

  const openTermsModal = () =>
    Modal.info({
      icon: null,
      className: "terms-modal",
      width: isMobile ? "calc(100vw - 24px)" : 760,
      centered: true,
      closable: true,
      maskClosable: true,
      title: "ĐIỀU KHOẢN & CHÍNH SÁCH BẢO MẬT THÔNG TIN CÔNG TY KHI SỬ DỤNG PHẦN MỀM C.C.HOUSE.",
      content: (
        <div className="terms-modal-content">
          <Text><strong>1. </strong>Điều khoản áp dụng đối với toàn bộ nhân sự được cấp quyền sử dụng phần mềm C.C.House.</Text>
          <Text><strong>2. </strong>Cam kết nhân sự kiểm tra &amp; đối chiếu thông tin Bất động sản trước khi nhập vào hệ thống quản lý bất động sản chung.</Text>
          <Text><strong>3. </strong>Chịu trách nhiệm về các nội dung quảng cáo, thông tin, hình ảnh, video liên quan về bất động sản là đúng thực tế.</Text>
          <Text><strong>4. </strong>Bảo mật thông tin, dữ liệu, tài khoản cá nhân. Nghiêm cấm tuyệt đối không chia sẻ, sao chép hoặc Copy cho bất kỳ đối tượng nào chưa được sự đồng ý văn bản của giám đốc C.C.House.</Text>
          <Text><strong>5. </strong>Trường hợp gây thất thoát ảnh hưởng sẽ bị truy cứu trách nhiệm và đền bù thiệt hại cho công ty. Nếu trường hợp vi phạm nghiêm trọng Công ty chuyển đến cơ quan chính quyền xử lý.</Text>
          <Text><strong>6. </strong>Nhân sự thuộc phòng kinh doanh Bất động sản tuân thủ các quy định liên quan và có chứng chỉ hành nghề môi giới, hoàn thành nghĩa vụ thuế.</Text>
        </div>
      ),
      footer: null,
    });

  useEffect(() => {
    const autoDomain = getEmailDomainByPosition(positionValue);
    const currentDomain = (form.getFieldValue("EmailExt") ?? "").trim();

    if (!currentDomain || currentDomain !== autoDomain) {
      form.setFieldValue("EmailExt", autoDomain);
    }

    if (isSales) {
      const currentEmail = (form.getFieldValue("Email") ?? "").trim();
      if (!currentEmail || currentEmail !== "cchouse") {
        form.setFieldValue("Email", "cchouse");
      }
    }
  }, [form, isSales, positionValue]);

  const handleEmailLocalPartChange = (value: string) => {
    if (isSales) return;
    const cleanLocalPart = normalizeEmailLocalPart(value);
    form.setFieldValue("Email", cleanLocalPart);
  };

  const onFinish = async (values: IRegisterAdmin) => {
    try {
      setLoading(true);
      const submittedValues = { ...registrationValues, ...values };
      const identityImages = await fileServices.uploadFilesNoAuth(
        identityFiles as Parameters<typeof fileServices.uploadFilesNoAuth>[0],
        "User",
      );
      const emailLocalPart = normalizeEmailLocalPart(submittedValues.Email ?? "");
      const emailDomain = (submittedValues.EmailExt ?? "@gmail.com").trim();
      const email = `${emailLocalPart}${emailDomain}`;
      await authApi.register({
        ...submittedValues,
        Address: submittedValues.Address ?? "",
        TempAddress: submittedValues.TempAddress ?? "",
        Email: email,
        Phone: submittedValues.Phone ?? "",
        Password: submittedValues.Password ?? "",
        IdentityImages: identityImages,
      } as IRegisterAdmin);
      form.resetFields();
      setIdentityFiles([]);
      setRegistrationValues({});
      setStep(1);
    } catch (error: any) {
      NotiBase(
        "error",
        error?.data?.message ??
          "Đăng ký thất bại, vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  const goToUploadStep = async () => {
    await form.validateFields();
    setRegistrationValues(form.getFieldsValue(true));
    setStep(2);
  };

  if (!isVisible) return null;

  return (
    <Form
      name="register-form"
      className="register-form"
      form={form}
      onFinish={onFinish}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      layout="vertical"
      disabled={loading}
      initialValues={{ EmailExt: "@gmail.com" }}
      style={{ fontSize: isMobile ? 13 : 14 }}
    >
      <div style={{ textAlign: "center", marginBottom: isMobile ? 20 : 28 }}>
        <Title level={2} style={{ margin: 0, fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>
          {step === 1 ? "Đăng ký tài khoản" : "Tải CCCD lên"}
        </Title>
        <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>
          {step === 1
            ? "Chỉ nhân sự C.C.House đã được tuyển dụng mới đăng ký sử dụng và truy cập phần mềm"
            : "Vui lòng tải ảnh mặt trước và mặt sau CCCD để hoàn tất đăng ký"}
        </Text>
      </div>

      {step === 1 ? <>
      <Form.Item
        label="Họ tên"
        name="Name"
        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        style={{ marginBottom: isMobile ? 12 : 16 }}
      >
        <Input size={isMobile ? "middle" : "large"} placeholder="Nguyễn Văn A" />
      </Form.Item>

      <div style={{ display: "flex", gap: 16 }}>
        <Form.Item
          label="Chức vụ"
          name="Position"
          rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
          style={{ marginBottom: isMobile ? 12 : 16, flex: 1 }}
        >
          <Select size={isMobile ? "middle" : "large"} placeholder="Chọn">
            {positionOptions.map((p) => (
              <Select.Option key={p} value={p}>
                {p}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Trình độ"
          name="Level"
          rules={[{ required: true, message: "Vui lòng chọn trình độ" }]}
          style={{ marginBottom: isMobile ? 12 : 16, flex: 1 }}
        >
          <Select size={isMobile ? "middle" : "large"} placeholder="Chọn">
            {levelOptions.map((l) => (
              <Select.Option key={l} value={l}>
                {l}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <Form.Item
          label="Ngày sinh"
          name="DateOfBirth"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          style={{ marginBottom: isMobile ? 12 : 16, flex: 1 }}
        >
          <DatePicker
            className="register-date-picker-field"
            popupClassName="register-date-picker-popup"
            size={isMobile ? "middle" : "large"}
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder="dd/mm/yyyy"
          />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="Sex"
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          style={{ marginBottom: isMobile ? 12 : 16, flex: 1 }}
        >
          <Select size={isMobile ? "middle" : "large"} placeholder="Chọn">
            <Select.Option value={1}>Nam</Select.Option>
            <Select.Option value={2}>Nữ</Select.Option>
            <Select.Option value={3}>Khác</Select.Option>
          </Select>
        </Form.Item>
      </div>

      <PhoneNumber label="Điện thoại" name="Phone" required placeholder="Nhập số điện thoại" />

      <Form.Item
        label="Email"
        style={{ marginBottom: isMobile ? 12 : 16 }}
      >
        <Space.Compact block>
          <Form.Item
            noStyle
            name="Email"
            rules={[{ required: true, message: "Vui lòng nhập Email" }]}
          >
            <Input
              size={isMobile ? "middle" : "large"}
              readOnly={isSales}
              placeholder={isSales ? "cchouse" : "nguyenvana"}
              value={isSales ? "cchouse" : undefined}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleEmailLocalPartChange(event.target.value)
              }
            />
          </Form.Item>
          <Form.Item noStyle name="EmailExt">
            <Input
              size={isMobile ? "middle" : "large"}
              readOnly
              value={form.getFieldValue("EmailExt") ?? getEmailDomainByPosition(positionValue)}
              style={{
                width: isMobile ? 150 : 170,
                background: "#f7f7f7",
                color: "#111827",
                cursor: "default",
              }}
            />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="Password"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu" },
          { pattern: passwordPattern, message: "Mật khẩu không đúng định dạng yêu cầu" },
        ]}
        style={{ marginBottom: 8 }}
      >
        <Input.Password
          size={isMobile ? "middle" : "large"}
          placeholder="Nhập mật khẩu"
          visibilityToggle={{ visible: showPw, onVisibleChange: setShowPw }}
          iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>

      <div className="register-password-requirements">
        {passwordRequirements.map((requirement) => (
          <div
            key={requirement.label}
            className={`register-password-requirement ${requirement.valid ? "is-valid" : ""}`}
          >
            {requirement.valid ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            <Text style={{ fontSize: isMobile ? 12 : 13 }}>{requirement.label}</Text>
          </div>
        ))}
      </div>

      <Form.Item
        name="AgreeTerms"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error("Vui lòng đồng ý điều khoản")),
          },
        ]}
        style={{ marginBottom: 16 }}
      >
        <Checkbox className="login-checkbox">
          <Text style={{ fontSize: isMobile ? 12 : 13 }}>
            bằng việc đăng ký tôi đồng ý cung cấp thông tin cá nhân, tuân thủ các{" "}
            <Link onClick={openTermsModal}>Quy định</Link> và{" "}
            <Link onClick={openTermsModal}>Chính sách bảo mật</Link> của công ty ban hành.
          </Text>
        </Checkbox>
      </Form.Item>
      </> : (
        <div className="register-identity-upload">
          <Text type="secondary">Chấp nhận JPG/PNG, tối đa 8MB mỗi ảnh, tối đa 2 ảnh.</Text>
          <Upload
            accept="image/jpeg,image/png"
            listType="picture-card"
            maxCount={2}
            multiple
            fileList={identityFiles}
            onPreview={async (file) => {
              const url = file.url ?? file.thumbUrl ?? (file.originFileObj
                ? await fileServices.getBase64(file.originFileObj)
                : undefined);
              if (url) setPreviewUrl(url);
            }}
            beforeUpload={(file) => {
              return fileServices.validateImg(file as never) ? false : Upload.LIST_IGNORE;
            }}
            onChange={({ fileList }) => setIdentityFiles(fileList)}
          >
            {identityFiles.length < 2 ? "+ Tải ảnh CCCD" : null}
          </Upload>
          <Image
            preview={{
              visible: Boolean(previewUrl),
              src: previewUrl,
              onVisibleChange: (visible) => {
                if (!visible) setPreviewUrl(undefined);
              },
            }}
            src={previewUrl}
            alt="Xem trước CCCD"
            style={{ display: "none" }}
          />
        </div>
      )}

      <Form.Item style={{ marginBottom: 12 }}>
        <Button
          block
          size={isMobile ? "middle" : "large"}
          type="primary"
          htmlType={step === 2 ? "submit" : undefined}
          loading={loading}
          disabled={step === 1 ? !agreedTerms : identityFiles.length !== 2}
          onClick={step === 1 ? goToUploadStep : undefined}
          style={{
            background: "#0588F0",
            borderColor: "#0588F0",
            borderRadius: 8,
            height: isMobile ? 42 : 46,
            fontWeight: 600,
          }}
        >
          {step === 1 ? "Tiếp tục" : "Đăng ký"}
        </Button>
      </Form.Item>

      {step === 2 && (
        <Button type="link" block onClick={() => setStep(1)} disabled={loading}>
          Quay lại chỉnh sửa thông tin
        </Button>
      )}

      <div style={{ textAlign: "center" }}>
        <Text style={{ fontSize: isMobile ? 12 : 13 }}>
          Bạn đã có tài khoản?{" "}
          <Link onClick={onModeChange} style={{ fontSize: isMobile ? 12 : 13 }}>
            Đăng nhập
          </Link>
        </Text>
      </div>

      <style>{`
        .register-date-picker-popup {
          width: 300px !important;
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12) !important;
        }

        .register-date-picker-field .ant-picker,
        .register-date-picker-field .ant-picker-input {
          border-radius: 8px;
        }

        .register-date-picker-field .ant-picker {
          min-height: 40px;
        }
      `}</style>
    </Form>
  );
};

export default RegisterForm;