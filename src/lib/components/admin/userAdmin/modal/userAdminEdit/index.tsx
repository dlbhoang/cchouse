import { Form, Input, Modal } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { fileServices } from "@/services/api/services/fileServices";
import {
  IUserAdminRequest,
  IUserAdminResponse,
} from "@/services/api/userAdmin/IUserAdmin";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";
import PersonalForm from "../../form/personal";

type Props = {
  isModalOpen: boolean;
  model: IUserAdminResponse;
  handleCancel: () => void;
};

const UserAdminEdit = ({ isModalOpen, model, handleCancel }: Props) => {
  // const status = Object.entries(EUserAdminStatus);
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values: IUserAdminRequest) => {
    try {
      console.log("Success:", values);
      setIsSubmit(true);
      if (Array.isArray(values.Images) && values.Images.length > 0) {
        values.Images = await fileServices.uploadFiles(values.Images, "User");
      }

      if (Array.isArray(values.IdentityImages)) {
        values.IdentityImages = await fileServices.uploadFiles(
          values.IdentityImages,
          "User"
        );
      }
      if (Array.isArray(values.Avatar)) {
        values.Avatar = (
          await fileServices.uploadFiles(values.Avatar, "User")
        ).toString();
      }

      Object.assign(model, values);
      await userAdminApi.update(model);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Thông tin nhân viên"
      maskClosable={false}
      open={isModalOpen}
      confirmLoading={isSubmit}
      width={1000}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      onOk={() => {
        form.submit();
      }}
      okText="Lưu"
      cancelText="Đóng"
    >
      <Form
        name="basic"
        initialValues={
          {
            ...model,
            DateOfBirth: model?.DateOfBirth ? dayjs(model?.DateOfBirth) : null,
            Avatar: fileServices.mapFromString(model.Avatar),
            IdentityImages: fileServices.mapFromString(model.IdentityImages),
          } as IUserAdminRequest
        }
        onFinish={onFinish}
        onFinishFailed={globalHandleFailed(form)}
        autoComplete="off"
        form={form}
        layout="vertical"
        style={{ padding: 10 }}
      >
        <Form.Item name="Id" hidden>
          <Input />
        </Form.Item>
        <PersonalForm form={form} hideAvatar={false} />
      </Form>
    </Modal>
  );
};

export default UserAdminEdit;
