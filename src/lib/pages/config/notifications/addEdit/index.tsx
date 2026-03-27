"use client";
import { Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import { UploadItem } from "@/lib/components/shared/MyFormItem";
import { UserAdminSelect } from "@/lib/components/shared/MySelect";
import { ETableName } from "@/lib/core/enum";
import type { INotiRequest } from "@/services/api/notifications/INoti";
import notiApi from "@/services/api/notifications/notiApi";
import { fileServices } from "@/services/api/services/fileServices";

type Props = {
  isOpen: boolean;
  model?: INotiRequest;
  onOpenChange: (val: boolean) => void;
};

const AddNoti = ({ model, isOpen, onOpenChange }: Props) => {
  const [form] = Form.useForm<INotiRequest>();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onSubmit = async (item: INotiRequest) => {
    console.log("Success:", item);
    try {
      setIsSubmit(true);
      if (item.AttachFiles && Array.isArray(item.AttachFiles)) {
        item.AttachFiles = await fileServices.uploadFiles(
          item.AttachFiles,
          "Notifications"
        );
      }

      if (item.Id > 0) await notiApi.put(item);
      else await notiApi.add(item);
      form.resetFields();
      onOpenChange(false);
    } finally {
      mutate(notiApi.mutateKey);
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    if (model)
      form.setFieldsValue({
        ...model,
        AttachFiles: fileServices.mapFromString(model?.AttachFiles),
      });
  }, [form, model]);

  return (
    <Modal
      title={model?.Id ? "Gửi thông báo" : "Tạo thông báo"}
      maskClosable={false}
      open={isOpen}
      confirmLoading={isSubmit}
      width={800}
      onCancel={() => {
        form.resetFields();
        onOpenChange(false);
      }}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Đóng"
    >
      <Form
        name="basic"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        <Form.Item name="Id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={12} align="bottom">
          <Col xs={24}>
            <Form.Item
              label="Tiêu đề"
              name="Title"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              label="Nội dung"
              name="Description"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={5} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <UploadItem
              maxCount={10}
              form={form}
              isFile
              label="Tệp đính kèm"
              name="AttachFiles"
              model={{ tableName: ETableName.Notification }}
            />
          </Col>
          <Col xs={24}>
            <Form.Item
              label="Gửi đến"
              name="SendToUsers"
              rules={[{ required: true }]}
            >
              <UserAdminSelect mode="multiple" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddNoti;
