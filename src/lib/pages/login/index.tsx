"use client";
import { Card, Col, Divider, Flex, Image, QRCode, Row, Typography } from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

const { Text, Link } = Typography;

function LoginPage() {
  const showContact = useMediaQuery({ query: "(min-height: 900px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 480px)" });
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E8EDF8 0%, #F5F6FA 50%, #EAE8F5 100%)",
        padding: isMobile ? 0 : "24px 16px",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          maxWidth: 430,
          borderRadius: isMobile ? 0 : 20,
          boxShadow: isMobile ? "none" : "0 8px 40px rgba(0,0,0,0.08)",
          minHeight: isMobile ? "100vh" : "auto",
        }}
        styles={{ body: { padding: isMobile ? "20px 16px" : "32px 36px" } }}
      >
        <Row>
          <Col xs={24}>

            {/* ── Logo ── */}
            <Flex vertical align="center" style={{ marginBottom: 20 }}>
              <Image
                src="logo_with_slogan.jpg"
                alt="cchouse-logo"
                preview={false}
                width={isMobile ? 150 : 200}
                height={isMobile ? 54 : 72}
                style={{ objectFit: "contain" }}
              />
            </Flex>

            {/* ── Tab switcher ── */}
            <Flex
              style={{
                background: "#F4F5F9",
                borderRadius: 12,
                padding: 4,
                marginBottom: 20,
              }}
            >
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1,
                    padding: isMobile ? "8px 0" : "9px 0",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: mode === m ? 600 : 400,
                    color: mode === m ? "#0A0B1E" : "#888",
                    background: mode === m ? "#ffffff" : "transparent",
                    boxShadow: mode === m ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {m === "login" ? "Đăng nhập" : "Đăng ký"}
                </button>
              ))}
            </Flex>

            {/* ── Greeting ── */}
            <Flex vertical gap={2} style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>
                {mode === "login" ? "Chào mừng bạn!" : "Xin chào bạn!"}
              </Text>
              <Text
                strong
                style={{ fontSize: isMobile ? 18 : 22, color: "#0A0B1E", lineHeight: 1.3 }}
              >
                {mode === "login" ? "Đăng nhập tài khoản" : "Đăng ký tài khoản"}
              </Text>
            </Flex>

            {/* ── Forms ── */}
            <LoginForm
              isVisible={mode === "login"}
              onModeChange={() => setMode("register")}
            />
            <RegisterForm
              isVisible={mode === "register"}
              onModeChange={() => setMode("login")}
            />

            {/* ── QR ── */}
            {mode === "login" && (
              <>
                <Divider style={{ margin: "16px 0" }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>hoặc</Text>
                </Divider>
                <Flex
                  align="center"
                  gap={14}
                  style={{
                    background: "#F8F9FC",
                    borderRadius: 12,
                    padding: isMobile ? "12px 14px" : "14px 16px",
                    border: "1px solid #EDEEF5",
                  }}
                >
                  <QRCode
                    size={isMobile ? 56 : 72}
                    errorLevel="Q"
                    value={process.env.NEXT_PUBLIC_LOGIN?.toString() ?? "https://admin.cchouse.vn"}
                    icon="/logo.png"
                    iconSize={13}
                    style={{ flexShrink: 0 }}
                  />
                  <Flex vertical gap={2}>
                    <Text style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: "#0A0B1E" }}>
                      Truy cập trên điện thoại
                    </Text>
                    <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12, lineHeight: 1.5 }}>
                      Quét mã QR bằng Zalo hoặc camera để đăng nhập nhanh
                    </Text>
                  </Flex>
                </Flex>
              </>
            )}
          </Col>

          {/* ── Contact footer ── */}
          {showContact && mode === "login" && (
            <Col xs={24}>
              <Divider style={{ margin: "20px 0 14px" }} />
              <Flex vertical gap={5}>
                <Text style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase" }}>
                  Mọi chi tiết liên hệ
                </Text>
                <Flex gap={8} align="center" wrap="wrap">
                  <Link href="tel:0917071719" style={{ color: "#0A0B1E", fontSize: 13, fontWeight: 500 }}>
                    0917 07 17 19
                  </Link>
                  <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
                  <Link href="tel:0919707477" style={{ color: "#0A0B1E", fontSize: 13, fontWeight: 500 }}>
                    0919 70 74 77
                  </Link>
                </Flex>
                <Text type="secondary" style={{ fontSize: 12 }}>Email: info@cchouse.vn</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>Mã số thuế: 0313463662</Text>
                <Divider style={{ margin: "6px 0" }} />
                <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.6 }}>
                  © Copyright @ 2023 CCHouse. All Rights Reserved – Since 2015
                </Text>
              </Flex>
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
}

export default LoginPage;