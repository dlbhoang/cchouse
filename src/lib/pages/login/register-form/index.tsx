import {
  Button,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Typography,
  type UploadFile,
} from "antd";
import dayjs from "dayjs";
import { type CSSProperties, useEffect, useState } from "react";
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
  style?: CSSProperties;
  onModeChange: () => void;
};

const RegisterForm = ({ onModeChange, style }: Props) => {
  const [form] = Form.useForm<IRegisterAdmin>();
  const [loading, setLoading] = useState(false);

  const [qrDone, setQrDone] = useState(false);
  const identitiesWatch = Form.useWatch("IdentityImages", form);

  const onFinish = async (values: IRegisterAdmin) => {
    try {
      setLoading(true);

      console.log(values);
      if (Array.isArray(values.IdentityImages)) {
        // vướng authen
        values.IdentityImages = await fileServices.uploadFilesNoAuth(
          values.IdentityImages,
          "User"
        );
      }

      console.log(values);

      await authApi.register({
        ...values,
        Email: `${values.Email}${values.EmailExt}`,
      });

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
                form.setFieldValue(
                  "Sex",
                  temp[4].toLocaleLowerCase() === "nam" ? 1 : 2
                );
                form.setFieldValue("Address", temp[5]);
                form.setFieldValue("TempAddress", temp[5]);
                form.setFieldValue("DateOfBirth", dayjs(temp[3], "DDMMYYYY"));
              }
              setQrDone(true);
              console.log(temp);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    };
    handleReadQR();
  }, [form, identitiesWatch, qrDone]);

  return (
    <Form
      name="register-form"
      form={form}
      // initialValues={init}
      onFinish={onFinish}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      layout="vertical"
      disabled={loading}
      style={style ?? { display: "none" }}
      initialValues={{ EmailExt: "@cchouse.vn" }}
    >
      {hiddenFields.map((e) => (
        <Form.Item key={e.toString()} name={e} hidden>
          <Input />
        </Form.Item>
      ))}
      <Space direction="vertical" size="small">
        <Text>Xin chào bạn,</Text>
        <Title level={4} style={{ margin: 0 }}>
          Đăng ký tài khoản
        </Title>
      </Space>
      <Divider />
      <Form.Item
        label="Email"
        name="Email"
        rules={[{ required: true, message: "Vui lòng nhập Email" }]}
      >
        <Input
          addonAfter={
            <Form.Item
              label="EmailExt"
              noStyle
              name="EmailExt"
              rules={[{ required: true, message: "Vui lòng nhập Email" }]}
            >
              <Select>
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
      >
        <Input.Password />
      </Form.Item>
      <PhoneNumber label="SĐT" name={"Phone"} required />
      <UploadItem
        form={form}
        name={"IdentityImages"}
        label="Hình CCCD (2 mặt)"
        maxCount={2}
        rules={[{ required: true, message: "Vui lòng tải đủ 2 hình" }]}
        listType="picture"
        multiple
        model={{ TableName: ETableName.User }}
        accept="image/*"
        action={imagesApi.uploadUrl}
      />

      <Space direction="vertical" style={{ width: "100%" }}>
        <Button type="link" onClick={onModeChange}>
          Đã có tài khoản, đăng nhập ngay
        </Button>
        <Button block size="large" type="primary" htmlType="submit">
          Đăng ký
        </Button>
      </Space>
    </Form>
  );
};

export default RegisterForm;
