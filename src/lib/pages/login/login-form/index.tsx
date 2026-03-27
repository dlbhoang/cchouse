import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CSSProperties, useState } from "react";
import { openUpgradeModal } from "@/lib/components/shared/MyModal";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { IUserLogin } from "@/lib/interfaces/IUser";
import { usePropStore } from "@/lib/stored";

const { Text, Title } = Typography;

type Props = {
  style?: CSSProperties;
  onModeChange: () => void;
};

const LoginForm = ({ onModeChange, style }: Props) => {
  const [loading, setLoading] = useState(false);

  const { showHappyBirthdayModal } = usePropStore();
  const router = useRouter();

  const onFinish = async (values: IUserLogin) => {
    // await signOut();
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        ...values,
      });
      console.log("result", result);
      if (result?.ok) {
        NotiBase(
          "success",
          "Đăng nhập thành công, hệ thống đang chuyển hướng..."
        );
        setTimeout(
          () => router.push(`${AppRoutes.property.url}?TransType=1`),
          1000
        );
        showHappyBirthdayModal();
      } else {
        console.log("result", result);

        NotiBase("error", result?.error ?? "");
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      NotiBase("error", e as string);
      console.log("signIn error: ", e);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    NotiBase("error", errorInfo);
    console.log(errorInfo);
  };

  const OpenModal = () =>
    Modal.info({
      icon: null,
      width: 750,
      centered: true,
      title: "",
      content: (
        <Row>
          <Col xs={24}>
            <Typography.Text strong style={{ fontSize: 18, color: "#1677ff" }}>
              ĐIỀU KHOẢN VÀ ĐIỀU KIỆN SỬ DỤNG HỆ THỐNG
            </Typography.Text>
          </Col>
          <Divider />
          <Space direction="vertical">
            <Typography.Text>
              <strong>1. </strong> Nhân sự C.C.House mới được đăng nhập vào hệ
              thống
            </Typography.Text>
            <Typography.Text>
              <strong>2. </strong> Tương tác càng nhiều xem càng nhiều Bất động
              sản
            </Typography.Text>
            <Typography.Text>
              <strong>3. </strong> Trong vòng 6 ngày nhập tối đa 3 sản phẩm hoặc
              nhập 20 sổ hồng vào hệ thống (Nếu không hệ thống chỉ cho xem sản
              phẩm mình đã nhập).
            </Typography.Text>
            <Typography.Text>
              <strong>4. </strong> Kiểm tra và xác thực sản phẩm trước khi nhập
              vào hệ thống, tránh dữ liệu rác
            </Typography.Text>
          </Space>
        </Row>
      ),
      footer: null,
      maskClosable: true,
    });

  return (
    <Form
      name="login-form"
      // initialValues={init}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      style={style ?? { display: "none" }}
    >
      <Space direction="vertical" size="small">
        <Text>Xin chào bạn,</Text>
        <Title level={4} style={{ margin: 0 }}>
          Đăng nhập để tiếp tục
        </Title>
      </Space>
      <Divider />
      <Form.Item
        label="Tài khoản"
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
      >
        <Input.Password size="large" />
      </Form.Item>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row justify={"space-between"}>
          <Button type="link" onClick={openUpgradeModal}>
            Quên mật khẩu?
          </Button>
          <Button type="link" onClick={onModeChange}>
            Đăng ký tài khoản
          </Button>
        </Row>
        <Button
          block
          size="large"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Đăng nhập
        </Button>
        <Button type="link" size="small" onClick={OpenModal}>
          Điều khoản & điều kiện sử dụng
        </Button>
      </Space>
    </Form>
  );
};

export default LoginForm;
