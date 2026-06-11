import { Col, Form, Input, Modal, Row, type UploadFile } from "antd";
import { useEffect, useState } from "react";
import AppUpload from "@/lib/components/shared/components/app-upload";
import { ETableName } from "@/lib/core/enum";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import type {
  IProvinceRequest,
  IProvinceResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import imagesApi from "@/services/api/imagesApi";
import provinceApi from "@/services/api/provinceApi";
import { fileServices } from "@/services/api/services/fileServices";

type Props = {
  isModalOpen: boolean;
  model: IProvinceResponse;
  handleCancel: () => void;
};

const EditProvince = ({ isModalOpen, model, handleCancel }: Props) => {
  const [form] = Form.useForm<IProvinceRequest>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async (item: IProvinceRequest) => {
    try {
      setConfirmLoading(true);

      if (item.Images) {
        const res = fileServices.processFiles(item.Images as UploadFile[]);
        item.Images = res.toString();
      }

      await provinceApi.update(item);
    } finally {
      setConfirmLoading(false);
      handleCancel();
    }
  };

  useEffect(() => {
    if (model)
      form.setFieldsValue({
        ...model,
        Images: fileServices.mapFromString(model.Images),
      });
  }, [form, model]);

  return (
    <Modal
      title={`${model.Type} ${model.Name}`}
      maskClosable={false}
      open={isModalOpen}
      confirmLoading={confirmLoading}
      width={600}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Đóng"
    >
      <Form
        name="basic"
        // initialValues={model}
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
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="Name"
              label="Tên tỉnh/thành"
              rules={[
                { required: true, message: "Vui lòng nhập tên tỉnh/thành" },
              ]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="ShortName" label="Tên viết tắt">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Hình minh họa"
              name={"Images"}
              valuePropName="fileList"
              getValueFromEvent={(e: any) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <AppUpload
                multiple
                maxCount={1}
                accept="image/*"
                action={imagesApi.uploadUrl}
                model={{
                  TableName: ETableName.Address,
                  resize: false,
                  watermark: false,
                }}
                showUploadList={false}
                onDelete={(uid) => {
                  const imagesValue = form.getFieldValue(
                    "Images"
                  ) as IMyUploadFile[];
                  form.setFieldValue(
                    "Images",
                    imagesValue.filter((x) => x.uid !== uid)
                  );
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditProvince;
