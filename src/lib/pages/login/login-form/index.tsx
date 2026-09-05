// LoginForm.tsx
import { Modal, Typography, Flex, Input, Button, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { openUpgradeModal } from "@/lib/components/shared/MyModal";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { IUserLogin } from "@/lib/interfaces/IUser";
import { usePropStore } from "@/lib/stored";

const { Text, Link } = Typography;
const rememberedLoginKey = "cchouse-remembered-login";

type Props = {
  isVisible: boolean;
  onModeChange: () => void;
};

// Auth.js v5 luôn trả "CredentialsSignin" — map message từ API sang tiếng Việt
const parseAuthError = (error: string): string => {
  if (!error || error === "CredentialsSignin") {
    return "Số điện thoại hoặc mật khẩu không đúng";
  }
  if (error.toLowerCase().includes("tài khoản") || error.toLowerCase().includes("account")) {
    return "Số điện thoại chưa được đăng ký trong hệ thống";
  }
  if (error.toLowerCase().includes("mật khẩu") || error.toLowerCase().includes("password")) {
    return "Mật khẩu không đúng";
  }
  return error;
};

const LoginForm = ({ isVisible, onModeChange }: Props) => {
  const isMobile = useMediaQuery({ query: "(max-width: 480px)" });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { showHappyBirthdayModal } = usePropStore();

  useLayoutEffect(() => {
    const rememberedLogin = localStorage.getItem(rememberedLoginKey);
    if (!rememberedLogin) return;

    try {
      const values = JSON.parse(rememberedLogin) as { email?: string; password?: string };
      setEmail(values.email ?? "");
      setPassword(values.password ?? "");
      setRememberPassword(Boolean(values.email && values.password));
    } catch {
      localStorage.removeItem(rememberedLoginKey);
    }
  }, []);

  useEffect(() => {
    if (rememberPassword && (email || password)) {
      localStorage.setItem(rememberedLoginKey, JSON.stringify({ email, password }));
    }
  }, [email, password, rememberPassword]);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Vui lòng nhập email";
    if (!password) e.password = "Vui lòng nhập mật khẩu";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const onFinish = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const values: IUserLogin = { username: email.trim(), password };
      const result = await signIn("credentials", { redirect: false, ...values });

      if (result?.ok && !result?.error) {
        NotiBase("success", "Đăng nhập thành công, hệ thống đang chuyển hướng...");
        setTimeout(() => {
          window.location.href = `${AppRoutes.property.url}?TransType=1`;
        }, 1000);
        showHappyBirthdayModal();
      } else {
        NotiBase("error", parseAuthError(result?.error ?? ""));
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      NotiBase("error", "Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

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

  if (!isVisible) return null;

  return (
    <Flex vertical gap={isMobile ? 14 : 20}>

      {/* ── Fields ── */}
      <Flex vertical gap={isMobile ? 10 : 14}>

        {/* Email */}
        <Flex vertical gap={4}>
          <div className={`login-field ${focusedField === "email" || email ? "is-raised" : ""}`}>
            <Text className="login-field-label" type="secondary" style={{ fontSize: 12 }}>
              Email <span className="login-field-required">*</span>
            </Text>
          <Input
              type="email"
              value={email}
              placeholder={focusedField === "email" ? "nguyenvana.cchouse@gmail.com" : ""}
              autoComplete="email"
            size="large"
            status={errors.email ? "error" : undefined}
            className="login-field-input"
              style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, lineHeight: "20px", color: "#A1A1AA", height: 40 }}
              onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            onPressEnter={() => document.getElementById("pw-input")?.focus()}
          />
          </div>
          {errors.email && (
            <Text type="danger" style={{ fontSize: 11 }}>{errors.email}</Text>
          )}
        </Flex>

        {/* Mật khẩu */}
        <Flex vertical gap={4}>
          <div className={`login-field ${focusedField === "password" || password ? "is-raised" : ""}`}>
            <Text className="login-field-label" type="secondary" style={{ fontSize: 12 }}>
              Mật khẩu <span className="login-field-required">*</span>
            </Text>
          <Input
            id="pw-input"
            type={showPw ? "text" : "password"}
            value={password}
            placeholder={focusedField === "password" ? "*********" : ""}
            autoComplete="current-password"
            size="large"
            status={errors.password ? "error" : undefined}
            className="login-field-input"
            style={{ fontSize: 14, height: 40 }}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            suffix={
              <span
                onClick={() => setShowPw((v) => !v)}
                style={{ cursor: "pointer", color: "#9CA3AF" }}
              >
                {showPw ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            }
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
            }}
            onPressEnter={onFinish}
          />
          </div>
          {errors.password && (
            <Text type="danger" style={{ fontSize: 11 }}>{errors.password}</Text>
          )}
        </Flex>
      </Flex>

      <Flex align="center" justify="space-between">
        <Checkbox
          checked={rememberPassword}
          className="login-checkbox"
          onChange={(event) => {
            const checked = event.target.checked;
            setRememberPassword(checked);
            if (!checked) localStorage.removeItem(rememberedLoginKey);
          }}
        >
          <Text style={{ fontSize: isMobile ? 12 : 14 }}>Nhớ mật khẩu</Text>
        </Checkbox>
        <Link onClick={openUpgradeModal} style={{ fontSize: isMobile ? 12 : 14 }}>
          Quên mật khẩu
        </Link>
      </Flex>

      {/* ── Buttons ── */}
      <Flex vertical gap={8}>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={onFinish}
          style={{
            background: "#0588F0",
            borderColor: "#0588F0",
            borderRadius: 8,
            height: isMobile ? 42 : 46,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Đăng nhập
        </Button>
      </Flex>

      {/* ── Chưa có tài khoản ── */}
      <Flex justify="center">
        <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>
          Chưa có tài khoản?{" "}
          <Link onClick={onModeChange} style={{ fontSize: isMobile ? 12 : 13 }}>
            Đăng ký
          </Link>
        </Text>
      </Flex>

      {/* ── Điều khoản ── */}
      <Flex align="flex-start" gap={4}>
          <Checkbox className="login-checkbox" style={{ marginTop: 2 }} />
        <Text style={{ fontSize: isMobile ? 11 : 14, color: "#575855", lineHeight: 1.45 }}>
          Bằng việc đăng ký tôi đồng ý cung cấp thông tin cá nhân, tuân thủ các{" "}
          <Link onClick={openTermsModal}>Quy định</Link> và <Link>Chính sách bảo mật</Link> của công ty ban hành.
        </Text>
      </Flex>
    </Flex>
  );
};

export default LoginForm;