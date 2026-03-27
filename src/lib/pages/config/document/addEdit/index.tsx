"use client";
import { Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import { UploadItem } from "@/lib/components/shared/MyFormItem";
import SelectBase from "@/lib/components/shared/MySelect/base/SelectBase";
import { ETableName } from "@/lib/core/enum";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import documentApi from "@/services/api/document/documentApi";
import type {
  IDocumentRequest,
  IDocumentResponse,
  IDocumentTypeResponse,
} from "@/services/api/document/IDocument";
import { fileServices } from "@/services/api/services/fileServices";

type Props = {
  model?: IDocumentResponse;
  types: IDocumentTypeResponse[];
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
};

const AddEditDocument = ({ types, model, isOpen, onOpenChange }: Props) => {
  const [form] = Form.useForm<IDocumentRequest>();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      ...model,
      DocFile: fileServices.mapFromString(model?.DocFile?.toString()),
      PdfFile: fileServices.mapFromString(model?.PdfFile?.toString()),
    } as IDocumentRequest);
  }, [form, model]);

  const onSubmit = async (item: IDocumentRequest) => {
    console.log("Success:", item);
    try {
      setIsSubmit(true);
      if (item.DocFile && Array.isArray(item.DocFile)) {
        const res = fileServices.processFiles(item.DocFile);
        item.DocFile = res.toString();
      }
      if (item.PdfFile && Array.isArray(item.PdfFile)) {
        const res = await fileServices.processFiles(item.PdfFile);
        item.PdfFile = res.toString();
      }
      if (model?.Id) await documentApi.update(item);
      else await documentApi.add(item);
      form.resetFields();
      onOpenChange(false);
    } finally {
      mutate(documentApi.mutateKey);
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title={model?.Id ? "Chỉnh sửa" : "Thêm văn bản"}
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
        onFinishFailed={globalHandleFailed(form)}
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        <Form.Item name="Id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={12} align="bottom">
          <Col xl={12} lg={12} md={24} xs={24}>
            <Form.Item
              label="Loại văn bản"
              name="DocumentTypeId"
              rules={[{ required: true }]}
            >
              <SelectBase
                placeholder="Loại văn bản"
                options={types.map((e) => ({
                  label: e.Name,
                  value: e.Id ?? 0,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={24} xs={24}>
            <Form.Item
              label="Tên văn bản"
              name="Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="Mô tả / Ghi chú" name="Note">
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={24} xs={24}>
            <UploadItem
              maxCount={1}
              form={form}
              isFile
              label="File PDF"
              name="PdfFile"
              model={{ tableName: ETableName.Document }}
            />
          </Col>
          <Col xl={12} lg={12} md={24} xs={24}>
            <UploadItem
              maxCount={1}
              form={form}
              isFile
              label="File Word"
              name="DocFile"
              model={{ tableName: ETableName.Document }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddEditDocument;
