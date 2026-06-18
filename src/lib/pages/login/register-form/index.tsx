import { Button, Divider, Form, Input, Select, Space, Typography, type UploadFile } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { PhoneNumber, UploadItem } from "@/lib/components/shared/MyFormItem";
import { ETableName } from "@/lib/core/enum";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import imagesApi from "@/services/api/imagesApi";
import { fileServices } from "@/services/api/services/fileServices";
import type { IRegisterAdmin } from "@/services/api/userAdmin/IUserAdmin";
import authApi from "@/services/auth/authApi";

const { Text, Title, Link } = Typography;

const hiddenFields = ["Name", "Sex", "Address", "TempAddress", "DateOfBirth"];

type Props = {
  isVisible: boolean;
  onModeChange: () => void;
};

const RegisterForm = ({ isVisible, onModeChange }: Props) => {
  const isMobile = useMediaQuery({ query: "(max-width: 480px)" });
  const [form] = Form.useForm<IRegisterAdmin>();
  const [loading, setLoading] = useState(false);
  const [qrDone, setQrDone] = useState(false);
  const identitiesWatch = Form.useWatch("IdentityImages", form);

  const onFinish = async (values: IRegisterAdmin) => {
    try {
      setLoading(true);
      if (Array.isArray(values.IdentityImages)) {
        values.IdentityImages = await fileServices.uploadFilesNoAuth(values.IdentityImages, "User");
      }
      await authApi.register({ ...values, Email: `${values.Email}${values.EmailExt}` });
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleReadQR = async () => {
      if (identitiesWatch && !qrDone) {
        const data: UploadFile[] = identitiesWatch;
        if (data.length > 0 && data[0]) {
          try {
            const qrData = await fileServices.readQR(data[0].originFileObj);
            if (qrData) {
              const temp = qrData.split("|");
              if (temp.length > 0) {
                form.setFieldValue("Name", temp[2]);
                form.setFieldValue("Sex", temp[4].toLocaleLowerCase() === "nam" ? 1 : 2);
                form.setFieldValue("Address", temp[5]);
                form.setFieldValue("TempAddress", temp[5]);
                form.setFieldValue("DateOfBirth", dayjs(temp[3], "DDMMYYYY"));
              }
              setQrDone(true);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    };
    handleReadQR();
  }, [form, identitiesWatch, qrDone]);

  if (!isVisible) return null;

  return (
    <Form
      name="register-form"
      form={form}
      onFinish={onFinish}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      layout="vertical"
      disabled={loading}
      initialValues={{ EmailExt: "@cchouse.vn" }}
      style={{ fontSize: isMobile ? 13 : 14 }}
    >
      {hiddenFields.map((e) => (
        <Form.Item key={e} name={e} hidden>
          <Input />
        </Form.Item>
      ))}

      <Divider style={{ margin: "12px 0" }} />

      <Form.Item
        label="Email"
        name="Email"
        rules={[{ required: true, message: "Vui lòng nhập Email" }]}
        style={{ marginBottom: isMobile ? 12 : 16 }}
      >
        <Input
          size={isMobile ? "middle" : "large"}
          style={{ borderRadius: 8 }}
          addonAfter={
            <Form.Item
              label="EmailExt"
              noStyle
              name="EmailExt"
              rules={[{ required: true, message: "Vui lòng nhập Email" }]}
            >
              <Select style={{ width: isMobile ? 120 : 140 }}>
                <Select.Option value="@gmail.com">@gmail.com</Select.Option>
                <Select.Option value="@cchouse.vn">@cchouse.vn</Select.Option>
              </Select>
            </Form.Item>
          }
        />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="Password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        style={{ marginBottom: isMobile ? 12 : 16 }}
      >
        <Input.Password
          size={isMobile ? "middle" : "large"}
          style={{ borderRadius: 8 }}
        />
      </Form.Item>

      <PhoneNumber label="SĐT" name="Phone" required />

      <UploadItem
        form={form}
        name="IdentityImages"
        label="Hình CCCD (2 mặt)"
        maxCount={2}
        rules={[{ required: true, message: "Vui lòng tải đủ 2 hình" }]}
        listType="picture"
        multiple
        model={{ TableName: ETableName.User }}
        accept="image/*"
        action={imagesApi.uploadUrl}
      />

      <Space direction="vertical" style={{ width: "100%", marginTop: 4 }} size={8}>
        <Link onClick={onModeChange} style={{ fontSize: isMobile ? 12 : 13 }}>
          Đã có tài khoản, đăng nhập ngay
        </Link>
        <Button
          block
          size={isMobile ? "middle" : "large"}
          type="primary"
          htmlType="submit"
          style={{
            background: "#0A0B1E",
            borderColor: "#0A0B1E",
            borderRadius: 8,
            height: isMobile ? 42 : 46,
            fontWeight: 600,
          }}
        >
          Đăng ký
        </Button>
      </Space>
    </Form>
  );
};

export default RegisterForm;