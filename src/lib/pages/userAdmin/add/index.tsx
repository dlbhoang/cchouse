"use client";
import { Button, Card, Col, Form, Row, Space, Steps, Typography } from "antd";
import type { UploadFile } from "antd/es/upload";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PersonalForm from "@/lib/components/admin/userAdmin/form/personal";
import UserAccessForm from "@/lib/components/admin/userAdmin/form/userAccess";
import AppUpload from "@/lib/components/shared/components/app-upload";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETableName } from "@/lib/core/enum";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import imagesApi from "@/services/api/imagesApi";
import { fileServices } from "@/services/api/services/fileServices";
import type { IUserAdminRequest } from "@/services/api/userAdmin/IUserAdmin";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";

const AddUserAdminPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState<UploadFile[]>([]);
  const [form] = Form.useForm<IUserAdminRequest>();

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleNext = async () => {
    if (current === 0) {
      await form.validateFields([
        "Avatar",
        "IdentityImages",
        "Name",
        "Phone",
        "Email",
        "Sex",
        "DateOfBirth",
        "Insurrance",
        "Address",
        "TempAddress",
        // 'BranchId',
        // 'RoleId',
        // 'ManagedBy',
        // 'Commission',
      ]);
    } else await form.validateFields();
    setCurrent(current + 1);
  };

  const steps = [
    {
      title: "Thông tin nhân viên",
      content: (
        <Space direction="vertical" size="large">
          <PersonalForm form={form} hideAvatar={false} />
          <Typography.Text type="warning">
            * Tài khoản được cấp theo định dạng: "Email/Aa123456!"
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: "Thông tin hoạt động",
      content: <UserAccessForm form={form} />,
    },
    {
      title: "Hồ sơ",
      content: (
        <div>
          <Typography.Text type="secondary">* tối đa 10 hình</Typography.Text>
          <AppUpload
            multiple
            maxCount={2}
            accept="image/*"
            action={imagesApi.uploadUrl}
            model={{
              tableName: ETableName.User,
              resize: false,
              watermark: false,
            }}
            showUploadList={false}
            fileList={images}
            onChange={(info) => {
              setImages(info.fileList as UploadFile[]);
            }}
            onDelete={(uid) => {
              setImages(images.filter((x) => x.uid !== uid));
            }}
          />
        </div>
      ),
    },
  ];

  const onFinish = async () => {
    try {
      const values: IUserAdminRequest = form.getFieldsValue(true);
      setLoading(true);

      if (images.length > 0) {
        values.Images = fileServices.processFiles(images as UploadFile[]);
      }

      if (values.IdentityImages) {
        values.IdentityImages = fileServices.processFiles(
          values.IdentityImages as UploadFile[]
        );
      }

      if (values.Avatar) {
        values.Avatar = fileServices
          .processFiles(values.Avatar as UploadFile[])
          .toString();
      }
      // if (Array.isArray(values.Avatar)) {
      //   values.Avatar = (
      //     await fileServices.uploadFiles(values.Avatar, 'User')
      //   ).toString();
      // }

      console.log("Success:", values);
      await userAdminApi.add({
        ...values,
        Email: `${values.Email}${values.EmailExt}`,
        UserAccess: values.UserAccess && {
          ...values.UserAccess,
          TimeFrom: dayjs(values.UserAccess.TimeFrom).format("HH:mm"),
          TimeTo: dayjs(values.UserAccess.TimeTo).format("HH:mm"),
        },
      });

      router.replace(AppRoutes.userAdmin.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <TitlePage title="Tạo nhân viên mới" />
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={globalHandleFailed(form)}
        autoComplete="off"
        form={form}
        initialValues={{ EmailExt: "@gmail.com" }}
        layout="vertical"
        style={{ padding: 10 }}
      >
        <Steps
          current={current}
          items={steps.map((e) => ({ key: e.title, title: e.title }))}
        />
        <Row>
          <Col span={24}>
            <Space style={{ padding: 20 }}>{steps[current].content}</Space>
          </Col>
          <Col span={24}>
            <Space>
              {current < steps.length - 1 && (
                <Button type="primary" onClick={handleNext}>
                  Tiếp tục
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  loading={loading}
                  onClick={() => form.submit()}
                >
                  Xong
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                  Trở về
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AddUserAdminPage;
