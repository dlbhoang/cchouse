"use client";
import {
  Card,
  Col,
  Divider,
  Image,
  QRCode,
  Row,
  Space,
  Typography,
} from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

const { Text, Link } = Typography;

function LoginPage() {
  const showContact = useMediaQuery({ query: `(min-height: 900px)` });
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <Card style={{ marginLeft: "auto", width: 430 }}>
      <Row gutter={[12, 12]}>
        <Col xs={24}>
          <div className="flex-center" style={{ marginBottom: 10 }}>
            <Image
              src="logo_with_slogan.jpg"
              alt="cchouse-logo"
              preview={false}
              width={220}
              height={80}
            />
          </div>
          {/* {submitForm} */}
          <LoginForm
            style={mode === "login" ? { display: "block" } : undefined}
            onModeChange={() => setMode("register")}
          />
          <RegisterForm
            style={mode === "register" ? { display: "block" } : undefined}
            onModeChange={() => setMode("login")}
          />
          {mode === "login" && (
            <div className="login-qr">
              <QRCode
                size={90}
                errorLevel="Q"
                value={
                  process.env.NEXT_PUBLIC_LOGIN?.toString() ??
                  "https://admin.cchouse.vn"
                }
                icon="/logo.png"
                iconSize={15}
              />
              <span>Truy cập trên điện thoại</span>
            </div>
          )}
        </Col>
        {showContact && mode === "login" && (
          <Col xs={24} style={{ position: "absolute", bottom: 20 }}>
            <Space direction="vertical">
              <Text style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                Mọi chi tiết liên hệ
              </Text>
              <Space>
                <Link style={{ color: "black" }} href="tel:0917071719">
                  0917 07 17 19
                </Link>
                -
                <Link style={{ color: "black" }} href="tel:0919707477">
                  0919 70 74 77
                </Link>
              </Space>
              <span>Email: info@cchouse.vn</span>
              <span>Mã số thuế: 0313463662</span>
              <Divider style={{ margin: 0 }} />
              <span>
                © Copyright @ 2023 <br />
                CCHouse. All Rights Reserved - Since 2015
              </span>
            </Space>
          </Col>
        )}
      </Row>
    </Card>
  );
}
export default LoginPage;
