"use client";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
  type UploadFile,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import PersonalForm from "@/lib/components/admin/userAdmin/form/personal";
import UserAccessForm from "@/lib/components/admin/userAdmin/form/userAccess";
import BottomFixed from "@/lib/components/shared/BottomFixed";
import MyCard from "@/lib/components/shared/MyCard";
import { UploadItem } from "@/lib/components/shared/MyFormItem";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETableName } from "@/lib/core/enum";
import { FormatDateSubmit } from "@/lib/core/utils/myFormat";
import { fileServices } from "@/services/api/services/fileServices";
import type { IUserAdminRequest } from "@/services/api/userAdmin/IUserAdmin";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";

const hiddenFields = ["Id", "EmailExt"];

type Props = {
  id: string;
};

const EditUserAdminPage = ({ id }: Props) => {
  const router = useRouter();
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [form] = Form.useForm<IUserAdminRequest>();
  const [status, setStatus] = useState<number>(0);

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const result = await userAdminApi.getById(Number(id));
        if (result.data) {
          const tempEmail = result.data.Email.split("@");
          form.setFieldsValue({
            ...result.data,
            Email: tempEmail[0],
            EmailExt: `@${tempEmail[1]}`,
            Avatar: fileServices.mapFromString(result.data.Avatar),
            IdentityImages: fileServices.mapFromString(
              result.data.IdentityImages
            ),
            Images: fileServices.mapFromString(result.data.Images),
            DateOfBirth: dayjs(result.data.DateOfBirth),
            UserAccess: {
              ...result.data.UserAccess,
              DateStart: dayjs(result.data.UserAccess?.DateStart),
              TimeFrom: result.data.UserAccess?.TimeFrom
                ? dayjs(result.data.UserAccess?.TimeFrom, appConst.TIME_FORMAT)
                : dayjs("07:00", appConst.TIME_FORMAT),
              TimeTo: result.data.UserAccess?.TimeTo
                ? dayjs(result.data.UserAccess?.TimeTo, appConst.TIME_FORMAT)
                : dayjs("18:00", appConst.TIME_FORMAT),
            },
          });

          setStatus(result.data.Status);
        }
      };
      fetchData();
    }
  }, [form, id, router]);

  const onFinish = async (values: IUserAdminRequest) => {
    try {
      setIsSubmit(true);

      if (Array.isArray(values.Images) && values.Images.length > 0) {
        values.Images = fileServices.processFiles(
          values.Images as UploadFile[]
        );
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

      // if (Array.isArray(values.Images) && values.Images.length > 0) {
      //   values.Images = await fileServices.uploadFiles(values.Images, 'User');
      // }

      // if (Array.isArray(values.IdentityImages)) {
      //   values.IdentityImages = await fileServices.uploadFiles(
      //     values.IdentityImages,
      //     'User'
      //   );
      // }
      // if (Array.isArray(values.Avatar)) {
      //   values.Avatar = (
      //     await fileServices.uploadFiles(values.Avatar, 'User')
      //   ).toString();
      // }

      console.log("Success:", values);

      const action = status === 3 ? "active" : "update";
      await userAdminApi[action]({
        ...values,
        Email: `${values.Email}${values.EmailExt}`,
        DateOfBirth: FormatDateSubmit(values.DateOfBirth?.toString()),
        UserAccess: values?.UserAccess
          ? {
              ...values.UserAccess,
              TimeFrom: dayjs(values.UserAccess?.TimeFrom).format("HH:mm"),
              TimeTo: dayjs(values.UserAccess?.TimeTo).format("HH:mm"),
              DateStart: FormatDateSubmit(
                values.UserAccess?.DateStart?.toString()
              ),
            }
          : undefined,
      });

      router.replace(AppRoutes.userAdmin.url);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish} disabled={isSubmit}>
      {hiddenFields.map((e) => (
        <Form.Item key={e} name={e} hidden>
          <Input />
        </Form.Item>
      ))}
      <Card>
        <Row gutter={[12, 12]}>
          <Col xs={24} lg={12}>
            <MyCard title="1. Thông tin cá nhân">
              <PersonalForm form={form} hideAvatar={false} />
            </MyCard>
          </Col>
          <Col xs={24} lg={12}>
            <MyCard title="2. Thông tin hoạt động">
              <UserAccessForm form={form} />
            </MyCard>
          </Col>
          <Col xs={24}>
            <MyCard title="3. Hồ sơ">
              <Typography.Text type="secondary">
                * tối đa 10 hình
              </Typography.Text>
              <UploadItem
                maxCount={10}
                form={form}
                name="Images"
                multiple
                model={{ TableName: ETableName.User }}
                accept="image/*"
              />
            </MyCard>
          </Col>
        </Row>
      </Card>
      <BottomFixed>
        <Button
          type="primary"
          size="large"
          block={isMobile}
          loading={isSubmit}
          htmlType="submit"
        >
          {status === 3 ? "Kích hoạt" : "Cập nhật"}
        </Button>
      </BottomFixed>
    </Form>
  );
};

export default EditUserAdminPage;
