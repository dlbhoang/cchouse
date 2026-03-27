import {
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Radio,
  Row,
  Select,
  UploadFile,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import AppUpload from "@/lib/components/shared/components/app-upload";

import { PhoneNumber } from "@/lib/components/shared/MyFormItem/PhoneNumber";
import { LiteracySelect } from "@/lib/components/shared/MySelect";
import { ETableName } from "@/lib/core/enum";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { useAdminContext } from "@/lib/stored";
import imagesApi from "@/services/api/imagesApi";
import { fileServices } from "@/services/api/services/fileServices";

type Props = {
  form: FormInstance;
  hideAvatar: boolean;
};
const { Option } = Select;

const colResponsive = {
  xl: 6,
  lg: 12,
  xs: 24,
};

const PersonalForm = ({ form, hideAvatar }: Props) => {
  const { enumList } = useAdminContext();
  const sex = enumList.Sex;

  const [qrDone, setQrDone] = useState(false);
  const modelId = Form.useWatch("Id", form);
  const identitiesWatch = Form.useWatch("IdentityImages", form);

  // eslint-disable-next-line sonarjs/cognitive-complexity
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
    <Row gutter={12}>
      <Col hidden={hideAvatar} lg={8} xl={8} xs={24}>
        <Form.Item
          label="Ảnh đại diện"
          name={"Avatar"}
          valuePropName="fileList"
          getValueFromEvent={(e: any) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
          rules={[{ required: true, message: "Vui lòng thêm ảnh đại diện" }]}
        >
          <AppUpload
            multiple
            maxCount={1}
            accept="image/*"
            action={imagesApi.uploadUrl}
            model={{
              tableName: ETableName.User,
              resize: false,
              watermark: false,
            }}
            showUploadList={false}
            onDelete={(uid) => {
              const imagesValue = form.getFieldValue(
                "Avatar"
              ) as IMyUploadFile[];
              form.setFieldValue(
                "Avatar",
                imagesValue.filter((x) => x.uid !== uid)
              );
            }}
          />
        </Form.Item>
      </Col>
      <Col hidden={hideAvatar} lg={16} xl={16} xs={24}>
        <Form.Item
          label="CMND/CCCD"
          name={"IdentityImages"}
          valuePropName="fileList"
          getValueFromEvent={(e: any) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
          rules={[
            { required: true, message: "Vui lòng thêm ảnh CMND/CCCD (2 ảnh)" },
            {
              validator: (_, value) => {
                if (value && value.length > 1) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Vui lòng thêm ảnh CMND/CCCD (2 ảnh)")
                );
              },
            },
          ]}
        >
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
            onDelete={(uid) => {
              const imagesValue = form.getFieldValue(
                "IdentityImages"
              ) as IMyUploadFile[];
              form.setFieldValue(
                "IdentityImages",
                imagesValue.filter((x) => x.uid !== uid)
              );
            }}
          />
        </Form.Item>
      </Col>

      <Col {...colResponsive}>
        <Form.Item
          label="Tên đầy đủ"
          name="Name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col {...colResponsive}>
        <PhoneNumber
          label="ĐT cá nhân"
          name="Phone"
          message="SĐT không hợp lệ"
          required
        />
      </Col>
      <Col {...colResponsive}>
        {modelId > 0 ? (
          <Form.Item label="Email">
            <Input
              disabled={!!modelId}
              value={
                form.getFieldValue("Email") + form.getFieldValue("EmailExt")
              }
            />
          </Form.Item>
        ) : (
          <Form.Item
            label="Email"
            name="Email"
            rules={[{ required: true, message: "Vui lòng nhập Email" }]}
          >
            <Input
              disabled={!!modelId}
              addonAfter={
                <Form.Item
                  label="EmailExt"
                  noStyle
                  name="EmailExt"
                  rules={[{ required: true, message: "Vui lòng nhập Email" }]}
                >
                  <Select disabled={!!modelId}>
                    <Option value="@gmail.com">@gmail.com</Option>
                    <Option value="@cchouse.vn">@cchouse.vn</Option>
                  </Select>
                </Form.Item>
              }
            />
          </Form.Item>
        )}
      </Col>
      <Col {...colResponsive}>
        <Form.Item
          label="Giới tính"
          name="Sex"
          rules={[{ required: true, message: "Vui lòng chọn" }]}
        >
          <Radio.Group>
            {sex.map((e) => (
              <Radio value={e.Value}>{e.Name}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Col>

      <Col lg={8} xl={6} xs={12}>
        <Form.Item label="Trình độ" name="Literacy">
          <LiteracySelect />
        </Form.Item>
      </Col>
      <Col lg={8} xl={6} xs={12}>
        <Form.Item
          label="Ngày sinh"
          name="DateOfBirth"
          rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
        >
          <DatePicker format={["DD/MM/YYYY", "DD/MM/YY"]} placeholder="Chọn" />
        </Form.Item>
      </Col>
      <Col {...colResponsive}>
        <Form.Item
          label="Bảo hiểm"
          name="Insurrance"
          rules={[{ required: true, message: "Vui lòng chọn" }]}
        >
          <Radio.Group>
            <Radio value>Có</Radio>
            <Radio value={false}>Không</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          label="Địa chỉ thường trú"
          name="Address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          label="Địa chỉ tạm trú"
          name="TempAddress"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default PersonalForm;
