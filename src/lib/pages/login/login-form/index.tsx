// LoginForm.tsx
import { Modal, Row, Col, Divider, Space, Typography, Flex, Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeOutlined, FacebookFilled } from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { openUpgradeModal } from "@/lib/components/shared/MyModal";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { IUserLogin } from "@/lib/interfaces/IUser";
import { usePropStore } from "@/lib/stored";

const { Text, Link } = Typography;

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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
  const { showHappyBirthdayModal } = usePropStore();

  const validate = () => {
    const e: typeof errors = {};
    if (!phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    if (!password) e.password = "Vui lòng nhập mật khẩu";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const onFinish = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const values: IUserLogin = { username: phone.trim(), password };
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
      width: isMobile ? "95vw" : 750,
      centered: true,
      title: "",
      content: (
        <Row>
          <Col xs={24}>
            <Text strong style={{ fontSize: isMobile ? 14 : 18, color: "#1677ff" }}>
              ĐIỀU KHOẢN VÀ ĐIỀU KIỆN SỬ DỤNG HỆ THỐNG
            </Text>
          </Col>
          <Divider />
          <Space direction="vertical">
            <Text style={{ fontSize: isMobile ? 13 : 14 }}><strong>1. </strong>Nhân sự C.C.House mới được đăng nhập vào hệ thống</Text>
            <Text style={{ fontSize: isMobile ? 13 : 14 }}><strong>2. </strong>Tương tác càng nhiều xem càng nhiều Bất động sản</Text>
            <Text style={{ fontSize: isMobile ? 13 : 14 }}><strong>3. </strong>Trong vòng 6 ngày nhập tối đa 3 sản phẩm hoặc nhập 20 sổ hồng vào hệ thống.</Text>
            <Text style={{ fontSize: isMobile ? 13 : 14 }}><strong>4. </strong>Kiểm tra và xác thực sản phẩm trước khi nhập vào hệ thống, tránh dữ liệu rác</Text>
          </Space>
        </Row>
      ),
      footer: null,
      maskClosable: true,
    });

  if (!isVisible) return null;

  return (
    <Flex vertical gap={isMobile ? 14 : 20}>

      {/* ── Fields ── */}
      <Flex vertical gap={isMobile ? 10 : 14}>

        {/* Số điện thoại */}
        <Flex vertical gap={4}>
          <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>Số điện thoại</Text>
          <Input
            type="tel"
            value={phone}
            placeholder="Nhập số điện thoại"
            autoComplete="username"
            size="large"
            status={errors.phone ? "error" : undefined}
            style={{ borderRadius: 8, fontSize: 14, height: isMobile ? 40 : 44 }}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
            }}
            onPressEnter={() => document.getElementById("pw-input")?.focus()}
          />
          {errors.phone && (
            <Text type="danger" style={{ fontSize: 11 }}>{errors.phone}</Text>
          )}
        </Flex>

        {/* Mật khẩu */}
        <Flex vertical gap={4}>
          <Row justify="space-between" align="middle">
            <Col>
              <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>Mật khẩu</Text>
            </Col>
            <Col>
              <Link onClick={openUpgradeModal} style={{ fontSize: isMobile ? 12 : 13 }}>
                Quên mật khẩu
              </Link>
            </Col>
          </Row>
          <Input
            id="pw-input"
            type={showPw ? "text" : "password"}
            value={password}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
            size="large"
            status={errors.password ? "error" : undefined}
            style={{ borderRadius: 8, fontSize: 14, height: isMobile ? 40 : 44 }}
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
          {errors.password && (
            <Text type="danger" style={{ fontSize: 11 }}>{errors.password}</Text>
          )}
        </Flex>
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
            background: "#0A0B1E",
            borderColor: "#0A0B1E",
            borderRadius: 8,
            height: isMobile ? 42 : 46,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Đăng nhập
        </Button>
        <Button
          size="large"
          block
          icon={<FacebookFilled style={{ color: "#1877F2" }} />}
          onClick={() => NotiBase("info", "Tính năng đang phát triển")}
          style={{
            borderRadius: 8,
            height: isMobile ? 42 : 46,
            fontSize: 14,
          }}
        >
          Đăng nhập bằng Facebook
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
      <Flex justify="center">
        <Link onClick={openTermsModal} style={{ fontSize: 11, color: "#9CA3AF" }}>
          Điều khoản &amp; điều kiện sử dụng
        </Link>
      </Flex>
    </Flex>
  );
};

export default LoginForm;