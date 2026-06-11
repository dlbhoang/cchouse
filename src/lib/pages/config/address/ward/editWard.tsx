import { Col, Form, Input, Modal, Row, type UploadFile } from "antd";
import { useEffect, useState } from "react";
import AppUpload from "@/lib/components/shared/components/app-upload";
import { DistrictSelect } from "@/lib/components/shared/MySelect";
import { ETableName } from "@/lib/core/enum";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import type {
  IWardRequest,
  IWardResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import imagesApi from "@/services/api/imagesApi";
import { fileServices } from "@/services/api/services/fileServices";
import wardApi from "@/services/api/wardApi";

type Props = {
  isModalOpen: boolean;
  model?: IWardResponse;
  handleCancel: () => void;
  handleMutate: () => void;
};

const EditWard = ({
  isModalOpen,
  model,
  handleCancel,
  handleMutate,
}: Props) => {
  const title = model != null && model?.Id > 0 ? "Chỉnh sửa" : "Tạo mới";
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async (item: IWardRequest) => {
    console.log("Success:", item);
    try {
      setConfirmLoading(true);
      if (item.Images) {
        const res = fileServices.processFiles(item.Images as UploadFile[]);
        item.Images = res.toString();
      }
      await wardApi.update(item);

      handleMutate();
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
      title={title}
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
              name="DistrictId"
              label="Quận"
              rules={[{ required: true, message: "Vui lòng chọn quận" }]}
            >
              <DistrictSelect disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="Name" label="Tên phường">
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

export default EditWard;
