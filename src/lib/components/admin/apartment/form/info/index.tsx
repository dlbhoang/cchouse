import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Typography,
} from "antd";
import VideoUpload from "@/lib/components/shared/components/video-upload";

import { UploadItem } from "@/lib/components/shared/MyFormItem";
import {
  LawSelect,
  PropTypeSelect,
  UtilitySelect,
} from "@/lib/components/shared/MySelect";
import { ETableName } from "@/lib/core/enum";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { IApartmentRequest } from "@/services/api/apartment/IApartment";
import imagesApi from "@/services/api/imagesApi";

const ApartmentInfoForm = ({
  form,
}: {
  form: FormInstance<IApartmentRequest>;
}) => {
  return (
    <Row gutter={12}>
      <Col lg={12} xl={8} xs={24}>
        <Form.Item label="Loại hình" name="Types" rules={[{ required: true }]}>
          <PropTypeSelect mode="multiple" />
        </Form.Item>
      </Col>
      <Col lg={12} xl={8} xs={24}>
        <Form.Item
          label={
            <Typography.Text>
              Tổng diện tích (m<sup>2</sup>)
            </Typography.Text>
          }
          name="Area"
          rules={[{ required: true, message: "Tổng diện tích không để trống" }]}
        >
          <InputNumber />
        </Form.Item>
      </Col>
      <Col lg={12} xl={8} xs={24}>
        <Form.Item label="Pháp lý" name="Law" rules={[{ required: true }]}>
          <LawSelect onlyMain />
        </Form.Item>
      </Col>
      <Col lg={12} xl={12} xs={24}>
        <Form.Item label="Tiện ích" name="Utilities">
          <UtilitySelect mode="multiple" />
        </Form.Item>
      </Col>

      <Col xs={24} xl={12}>
        <Form.Item label="Quy mô" name="Dimension">
          <Input.TextArea
            rows={5}
            placeholder="4 blocks, mỗi block 20 tầng, mật độ xây dựng,..."
          />
        </Form.Item>
      </Col>
      <Col xs={24} xl={12}>
        <span>Hình ảnh (tối đa 10 hình)</span>
        <UploadItem
          form={form}
          maxCount={10}
          multiple
          name="Images"
          model={{ tableName: ETableName.Apartment }}
          accept="image/*"
        />
      </Col>
      <Col xs={24} xl={12}>
        <Form.Item
          name="Video"
          label="Video"
          valuePropName="fileList"
          getValueFromEvent={(e: any) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
          extra="~ khoảng 30s - 40s"
        >
          <VideoUpload
            maxCount={1}
            accept="video/*"
            action={imagesApi.uploadVideoUrl}
            model={{
              tableName: ETableName.Apartment,
              resize: false,
              watermark: false,
            }}
            showUploadList={false}
            onDelete={(uid) => {
              const values = form.getFieldValue("Video") as IMyUploadFile[];
              form.setFieldValue(
                "Video",
                values.filter((x) => x.uid !== uid)
              );
            }}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ApartmentInfoForm;
