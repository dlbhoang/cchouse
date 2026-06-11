"use client";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Space,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomFixed from "@/lib/components/shared/BottomFixed";
import VideoUpload from "@/lib/components/shared/components/video-upload";
import MyCard from "@/lib/components/shared/MyCard";
import { UploadItem } from "@/lib/components/shared/MyFormItem";
import { DeletedImgModal } from "@/lib/components/shared/MyModal";
import { ApartmentSelect } from "@/lib/components/shared/MySelect";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETableName, ETransType } from "@/lib/core/enum";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { useAdminContext } from "@/lib/stored";
import apartmentUnitApi from "@/services/api/apartment/unit/apartmentUnitApi";
import {
  IApartmentUnitRequest,
  IApartmentUnitResponse,
} from "@/services/api/apartment/unit/IApartmentUnit";
import imagesApi, { IFileUploadResponse } from "@/services/api/imagesApi";
import { fileServices } from "@/services/api/services/fileServices";
import ApartmentDescription from "../../apartment/description";
import PreviewModal from "../modal/preview";
import ContactZone from "./contactZone";
import FirstZone from "./firstZone";
import SecondZone from "./secondZone";

const hiddenFields = ["Id", "Status", "Video", ["Contact", "Id"]];

const colFullResponsive = {
  xs: 24,
  lg: 12,
};
type Props = {
  model?: IApartmentUnitResponse;
};
const ApartmentUnitForm = ({ model }: Props) => {
  const router = useRouter();
  const { smallScreen } = useAdminContext();
  const [form] = Form.useForm<IApartmentUnitRequest>();

  const [preview, setPreview] = useState(false);
  const [previewData, setPreviewData] = useState<IApartmentUnitRequest>();

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [curImg, setCurImg] = useState<IFileUploadResponse[]>([]);
  const [openDeletedImg, setOpenDeletedImg] = useState(false);

  const watchTransType = Form.useWatch("TransType", form);
  const watchApartmentId = Form.useWatch("ApartmentId", form);
  const watchImages = Form.useWatch("Images", form);

  const onFinish = async (item: IApartmentUnitRequest) => {
    console.log("Success:", item);
    setPreview(false);
    setIsSubmit(true);
    try {
      if (Array.isArray(item.Images)) {
        item.Images = await fileServices.uploadImages(
          item.Images,
          "ApartmentUnit"
        );
      }

      const phones = item?.Contact?.Phone?.filter(
        (x) => x !== null && x !== "" && x !== undefined
      );
      const result: IApartmentUnitRequest = {
        ...item,
        Contact: {
          ...item.Contact,
          Name: item.Contact?.Type === 7 ? "Tìm chủ" : item.Contact?.Name,
          Phone: item.Contact?.Type === 7 ? ["0000000000"] : phones,
        },
      };

      if ((result?.Id ?? 0) > 0) {
        await apartmentUnitApi.update(result);
      } else await apartmentUnitApi.add(result);
      router.push(
        `${AppRoutes.apartmentUnit.url}?TransType=${result.TransType}`
      );
    } catch {
      setIsSubmit(false);
    } finally {
      setIsSubmit(false);
    }
  };

  const handlePreview = (item: IApartmentUnitRequest) => {
    if (!model) {
      setPreviewData(item);
      setPreview(true);
    } else {
      onFinish(item);
    }
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
        Images: fileServices.mapFromFileUpload(curImg),
        Video: model.Video
          ? fileServices.mapFromString(model.Video.toString())
          : null,
      });
    }
  }, [form, model, curImg]);

  useEffect(() => {
    if (model?.Id) {
      const fetch = async () => {
        const result = await apartmentUnitApi.images(model.Id, {
          IsDeleted: false,
        });

        setCurImg(result.data);
      };
      fetch();
    }
  }, [model?.Id]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handlePreview}
      disabled={isSubmit}
      initialValues={{ Status: 1, PriceForRentMethod: 2 }}
    >
      {hiddenFields.map((e) => (
        <Form.Item key={e.toString()} name={e} hidden>
          <Input />
        </Form.Item>
      ))}
      <Card>
        <TitlePage
          title={
            model?.Id
              ? `Thông tin căn hộ - Mã: ${model?.Id}`
              : "Thêm căn hộ mới"
          }
        />
        {/* {model && model.Id > 0 && <EditInfo model={model} />} */}
        <Row gutter={[12, 12]}>
          <Col xs={24} lg={8} xl={6}>
            <Col>
              <Form.Item
                label="Loại giao dịch"
                name="TransType"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  disabled={!!model}
                  onChange={(e) =>
                    form.setFieldValue(
                      ["Contact", "PaymentMethod"],
                      e.target.value
                    )
                  }
                >
                  <Radio value={ETransType.sell}>Mua bán</Radio>
                  <Radio value={ETransType.rent}>Cho thuê</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Chung cư"
                name="ApartmentId"
                rules={[{ required: true }]}
              >
                <ApartmentSelect />
              </Form.Item>
            </Col>
            {watchApartmentId && (
              <Col>
                <ApartmentDescription id={Number(watchApartmentId)} />
              </Col>
            )}
          </Col>
          {watchTransType && (
            <Col xs={24} lg={16} xl={10}>
              <Col>
                <MyCard title="1. Loại hình / Trạng thái">
                  <FirstZone form={form} model={model} />
                </MyCard>
              </Col>
              <Col>
                <MyCard title="2. Chi tiết căn hộ">
                  <SecondZone form={form} model={model} />
                </MyCard>
              </Col>
              <Col>
                <MyCard
                  title={`3. Chủ nhà / Giá 
                  ${
                    Number(watchTransType) === ETransType.sell ? "bán" : "thuê"
                  }`}
                  extra={
                    <Form.Item
                      noStyle
                      name={["Contact", "NoBroker"]}
                      valuePropName="checked"
                    >
                      <Checkbox>Miễn trung gian</Checkbox>
                    </Form.Item>
                  }
                >
                  <ContactZone form={form} model={model} />
                </MyCard>
              </Col>
            </Col>
          )}

          {watchTransType && (
            <Col xs={24} xl={8}>
              <MyCard
                title={`4. Hình ảnh / tài liệu (${
                  watchImages?.length ?? 0
                }/20)`}
                extra={
                  model && (
                    <>
                      <Button
                        type="link"
                        onClick={() => setOpenDeletedImg(true)}
                      >
                        Lịch sử hình ảnh
                      </Button>
                      <DeletedImgModal
                        contentId={model.Id}
                        TableName={ETableName.ApartmentUnit}
                        isOpen={openDeletedImg}
                        onClose={() => setOpenDeletedImg(false)}
                      />
                    </>
                  )
                }
              >
                <UploadItem
                  multiple
                  maxCount={20}
                  // showUploadList={false}
                  form={form}
                  name={"Images"}
                  listType="picture"
                  model={{ TableName: ETableName.ApartmentUnit }}
                  accept="image/*"
                />
              </MyCard>

              <MyCard title="5. Video">
                <Form.Item
                  name=""
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
                      TableName: ETableName.ApartmentUnit,
                      Resize: false,
                      Watermark: false,
                    }}
                    showUploadList={false}
                    onDelete={(uid) => {
                      const values = form.getFieldValue(
                        "Video"
                      ) as IMyUploadFile[];
                      form.setFieldValue(
                        "Video",
                        values.filter((x) => x.uid !== uid)
                      );
                    }}
                  />
                </Form.Item>
              </MyCard>
            </Col>
          )}
        </Row>
      </Card>
      <BottomFixed>
        <Space>
          <Button
            type="primary"
            size="large"
            block={smallScreen}
            loading={isSubmit}
            htmlType="submit"
          >
            {model && (model?.Id ?? 0) > 0 ? "Cập nhật" : "Thêm mới"}
          </Button>
          {(model?.Id ?? 0) > 0 && (
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "orange" }}
              block={smallScreen}
              loading={isSubmit}
              htmlType="button"
              onClick={() =>
                router.push(`${AppRoutes.feed.url}/add?unitId=${model?.Id}`)
              }
            >
              Đăng tin
            </Button>
          )}
        </Space>
      </BottomFixed>

      {previewData && (
        <PreviewModal
          isModalOpen={preview}
          model={previewData}
          handleCancel={() => setPreview(false)}
          handleOk={() => onFinish(previewData)}
        />
      )}
    </Form>
  );
};

export default ApartmentUnitForm;
