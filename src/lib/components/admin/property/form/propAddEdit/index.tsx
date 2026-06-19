"use client";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import { UploadFile } from "antd/es/upload";
import { MapPinnedIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import BottomFixed from "@/lib/components/shared/BottomFixed";
import AppUpload from "@/lib/components/shared/components/app-upload";
import VideoUpload from "@/lib/components/shared/components/video-upload";
import EmblededGoong from "@/lib/components/shared/EmblededGoong";
import MyCard from "@/lib/components/shared/MyCard";
import { DeletedImgModal } from "@/lib/components/shared/MyModal";
import {
  EquipmentSelect,
  ErrorsSelect,
  FurnitureSelect,
  UtilitySelect,
} from "@/lib/components/shared/MySelect";
import NoteModal from "@/lib/components/shared/noteModal";
import { SpeechToText } from "@/lib/components/shared/SpeechToText";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETableName, ETransType } from "@/lib/core/enum";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { calculateArea } from "@/lib/core/utils/ant-func";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { IPropRequest, IPropResponse } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import imagesApi from "@/services/api/imagesApi";
import propertyApi from "@/services/api/property/propertyApi";
import { fileServices } from "@/services/api/services/fileServices";
import GeocodeModal from "../../modal/geocode";
import PropPreviewModal from "../../modal/propPreview";
import PropAddressInfo from "./addressInfo";
import ContactZone from "./contact";
import EditInfo from "./editInfo";
import FirstZone from "./firstZone";
import ThirdZone from "./thirdZone";

const { Text } = Typography;
const { TextArea } = Input;

const hiddenFields = [
  "Id",
  "Status",
  ["PropAddress", "Id"],
  "RootId",
  ["PropAddress", "IsOneWay"],
  ["PropAddress", "PlaceId"],
  ["PropAddress", "Lng"],
  ["PropAddress", "Lat"],
  "NoBroker",
  "IsHidePhone",
  "Basement",
  "Floors",
  "Structures",
];

const colFullResponsive = {
  xs: 24,
  lg: 12,
};

const colQuickResponsive = {
  xs: 24,
};

type Props = {
  model?: IPropResponse;
  transType?: ETransType;
  query?: {
    AddressNumber?: string;
    ProvinceId?: string;
    DistrictId?: string;
    WardId?: string;
    StreetId?: string;
  };
  inModal?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
};
const PropAddEdit = ({
  transType,
  model,
  query,
  inModal,
  onClose,
  onSuccess,
}: Props) => {
  const router = useRouter();
  const { smallScreen } = useAdminContext();
  const [form] = Form.useForm<IPropRequest>();
  const [mode, setMode] = useState<"full" | "quick">("full");
  // const [showPhone, setShowPhone] = useState(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [openDeletedImg, setOpenDeletedImg] = useState(false);

  const [preview, setPreview] = useState(false);
  const [openGeocode, setOpenGeocode] = useState(false);
  const [previewData, setPreviewData] = useState<IPropRequest>();

  const transTypeWatch = Form.useWatch("TransType", form);
  const imagesWatch = Form.useWatch("Images", form);

  useEffect(() => {
    if (model?.Id) {
      const fetch = async () => {
        const result = await imagesApi.get({
          ContentId: model.Id,
          TableName: ETableName.Property,
        });

        if (result.data) {
          const images = fileServices.mapFromFileUpload(result.data);
          form.setFieldValue("Images", images);
        }
      };
      fetch();
    }
  }, [model?.Id]);

  useEffect(() => {
    if (query) {
      if (query.AddressNumber) {
        form.setFieldValue(
          ["PropAddress", "AddressNumber"],
          query.AddressNumber
        );
      }

      if (query.ProvinceId) {
        form.setFieldValue(
          ["PropAddress", "ProvinceId"],
          Number(query.ProvinceId)
        );
      }

      if (query.DistrictId) {
        form.setFieldValue(
          ["PropAddress", "DistrictId"],
          Number(query.DistrictId)
        );
      }

      if (query.WardId) {
        form.setFieldValue(["PropAddress", "WardId"], Number(query.WardId));
      }

      if (query.StreetId) {
        form.setFieldValue(["PropAddress", "StreetId"], Number(query.StreetId));
      }
    }
  }, [query, form]);

  useEffect(() => {
    if (transType) {
      form.setFieldValue("TransType", Number(transType));
      form.setFieldValue("PaymentMethod", Number(transType));
    }
    form.setFieldValue("Status", 1);

    const fetch = async () => {
      if (!model?.Id) return;

      const imageResult = await imagesApi.get({
        ContentId: model.Id,
        TableName: ETableName.Property,
      });

      // setCurImg(imageResult.data);

      if (model) {
        const phoneArr = model.CustomerPhone?.toString().split(",");
        // if (phoneArr.length > 1) setShowPhone(true);
        // while (phoneArr.length < 4) {
        //   phoneArr.push('');
        // }
        form.setFieldsValue({
          ...model,
          Images: imageResult.data
            ? fileServices.mapFromFileUpload(imageResult.data)
            : [],
          Video: model.Video ? fileServices.mapFromString(model.Video) : [],
          CustomerLogo: model.CustomerLogo
            ? fileServices.mapFromString(model.CustomerLogo.toString())
            : undefined,
          CustomerPhone: phoneArr,
          PropAddress: {
            ...model.PropAddress,
            EndTimeRent: model.PropAddress?.EndTimeRent?.replace(
              "Năm",
              ""
            ).replace("Tháng", ""),
            EndTimeRentUnit: model.PropAddress?.EndTimeRent?.includes("Năm")
              ? "Năm"
              : "Tháng",
          },
        });
      }
    };
    fetch();
  }, [transType, form, model]);

  const onFinish = async (item: IPropRequest) => {
    console.log("Success:", item);
    setPreview(false);
    setIsSubmit(true);
    // return;
    try {
      // if (images.length > 0) {
      //   item.Images = await fileServices.uploadImages(images, 'Property');
      // }

      if (item.Images) {
        item.Images = fileServices.processFiles(item.Images as UploadFile[]);
      }

      if (item.CustomerLogo && Array.isArray(item.CustomerLogo)) {
        const res = await fileServices.uploadImages(
          item.CustomerLogo,
          "Property"
        );
        item.CustomerLogo = res.toString();
      }

      if (item.Video) {
        const result = fileServices.processFiles(item.Video as UploadFile[]);
        item.Video = result.toString();
      }

      const phones = (item?.CustomerPhone as string[])?.filter(
        (x) => x !== null && x !== "" && x !== undefined
      );
      const result: IPropRequest = {
        ...item,
        CustomerName:
          item.CustomerType.toString() === "7" ? "Tìm chủ" : item.CustomerName,
        CustomerPhone:
          item.CustomerType.toString() === "7" ? ["0000000000"] : phones,
        PropAddress: {
          ...item.PropAddress,
          EndTimeRent: item.PropAddress?.EndTimeRent
            ? `${item.PropAddress.EndTimeRent} ${item.PropAddress.EndTimeRentUnit}`
            : undefined,
        },
      };

      if (result.Id > 0) {
        await propertyApi.update(result);
      } else await propertyApi.add(result);

      mutate(propertyApi.mutateKey);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`${AppRoutes.property.url}?TransType=${transTypeWatch}`);
      }
    } catch {
      setIsSubmit(false);
    } finally {
      setIsSubmit(false);
    }
  };

  const handlePreview = (item: IPropRequest) => {
    if (!model) {
      setPreviewData(item);
      setPreview(true);
    } else {
      onFinish(item);
    }
  };

  let colResponsive = colQuickResponsive;
  let cardWidth;
  if (mode === "full") {
    colResponsive = colFullResponsive;
  } else if (!smallScreen) cardWidth = 700;

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handlePreview}
      disabled={isSubmit}
      onValuesChange={(_: IPropRequest, allValues) => {
        if (_.Length || _.Width) {
          calculateArea(form, allValues);
        }
      }}
      style={
        inModal ? undefined : { display: "flex", justifyContent: "center" }
      }
    >
      {hiddenFields.map((e) => (
        <Form.Item key={e.toString()} name={e} hidden>
          <Input />
        </Form.Item>
      ))}
      <Card bodyStyle={{ width: inModal ? undefined : cardWidth }}>
        {!inModal && (
          <Row justify="space-between">
            <Col>
              <TitlePage
                title={
                  model?.Id
                    ? `Chi tiết bất động sản - Mã: ${model?.Id}`
                    : "Thêm bất động sản mới"
                }
              />
            </Col>
            {model && model.Id > 0 && (
              <Col xs={24} lg={14}>
                <EditInfo model={model} />
              </Col>
            )}
          </Row>
        )}
        {inModal && model && model.Id > 0 && (
          <Row justify="end" style={{ marginBottom: 12 }}>
            <Col xs={24} lg={14}>
              <EditInfo model={model} />
            </Col>
          </Row>
        )}
        <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
          <Col xs={24} lg={18}>
            <Form.Item
              label="Loại giao dịch"
              noStyle
              name="TransType"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Text style={{ padding: 10 }}>Loại giao dịch: </Text>
              <Radio.Group
                value={model?.TransType ?? Number(transType)}
                onChange={(e) => {
                  if (inModal && !model) {
                    form.setFieldValue("TransType", e.target.value);
                    form.setFieldValue("PaymentMethod", e.target.value);
                    return;
                  }
                  router.push(
                    `${AppRoutes.property.url}/add?TransType=${e.target.value}`
                  );
                }}
              >
                <Radio value={ETransType.sell}>Mua bán</Radio>
                <Radio value={ETransType.rent}>Cho thuê</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {!model && (
            <Col xs={24} lg={6}>
              <Radio.Group
                value={mode}
                buttonStyle="solid"
                onChange={(e) => setMode(e.target.value)}
                size="small"
              >
                <Radio.Button value="full">Chi tiết</Radio.Button>
                <Radio.Button value="quick">Ngắn gọn</Radio.Button>
              </Radio.Group>
            </Col>
          )}
          <Col {...colResponsive}>
            <MyCard title="1. Loại hình / Vị trí">
              <FirstZone form={form} model={model} isFull={mode === "full"} />
            </MyCard>
          </Col>
          <Col {...colResponsive}>
            <MyCard
              title="2. Địa chỉ"
              extra={
                <Button
                  size="small"
                  icon={<MapPinnedIcon className="size-4" />}
                  type="primary"
                  style={{ backgroundColor: "orange" }}
                  onClick={() => setOpenGeocode(true)}
                >
                  Xem vị trí{" "}
                  {model?.PropAddress.PlaceId &&
                    `[${model?.PropAddress.Lat},${model?.PropAddress.Lng}]`}
                </Button>
              }
            >
              <PropAddressInfo
                form={form}
                model={model}
                isFull={mode === "full"}
              />
            </MyCard>
          </Col>

          <Col {...colResponsive}>
            <MyCard title="3. Diện tích / Hiện trạng">
              <ThirdZone form={form} isFull={mode === "full"} />
            </MyCard>
          </Col>
          <Col {...colResponsive}>
            <MyCard
              title={`4. Chủ nhà / Giá 
                  ${Number(transType) === ETransType.sell ? "bán" : "thuê"}`}
              extra={
                <Form.Item noStyle name="NoBroker" valuePropName="checked">
                  <Checkbox>Miễn trung gian</Checkbox>
                </Form.Item>
              }
            >
              <ContactZone form={form} model={model} isFull={mode === "full"} />
            </MyCard>
          </Col>
          {mode === "full" && (
            <Col {...colResponsive}>
              <MyCard title="5. Trang thiết bị / Tiện ích">
                <Row gutter={12}>
                  <Col lg={12} xl={8} xs={12}>
                    <Form.Item label="Số phòng" name="Bedroom">
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col lg={12} xl={8} xs={12}>
                    <Form.Item label="Số toilet" name="Bathroom">
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col lg={12} xl={8} xs={24}>
                    <Form.Item
                      label="Lỗi phong thuỷ"
                      name={["PropAddress", "Errors"]}
                    >
                      <ErrorsSelect mode="multiple" />
                    </Form.Item>
                  </Col>
                  <Col lg={12} xl={8} xs={24}>
                    <Form.Item label="Trang thiết bị" name="Equipments">
                      <EquipmentSelect mode="multiple" />
                    </Form.Item>
                  </Col>
                  <Col lg={12} xl={8} xs={24}>
                    <Form.Item label="Tiện ích" name="Utils">
                      <UtilitySelect mode="multiple" />
                    </Form.Item>
                  </Col>
                  <Col lg={12} xl={8} xs={24}>
                    <Form.Item label="Nội thất" name="Furniture">
                      <FurnitureSelect />
                    </Form.Item>
                  </Col>
                </Row>
              </MyCard>
            </Col>
          )}
          <Col {...colResponsive}>
            <MyCard
              title="6. Ghi chú nội bộ"
              extra={
                model && (
                  <NoteModal
                    showTitle
                    title={`Mã BĐS: ${model.Id}`}
                    historyId={model.Id}
                    value={model.Note}
                    handleChange={async (note) => {
                      await propertyApi.quickUpdate({
                        Id: model.Id,
                        Note: note ?? "",
                      });

                      mutate(propertyApi.mutateKey);
                    }}
                  />
                )
              }
            >
              <Row gutter={8} align="middle">
                <Col flex={"auto"}>
                  <Form.Item noStyle name="Note">
                    <TextArea
                      rows={5}
                      placeholder="Được quyền thay đổi, xóa và ghi nhận các thông tin cần thiết liên quan đến nhà đất"
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <SpeechToText
                    onTranscriptChange={(text) => {
                      form.setFieldValue("Note", text);
                    }}
                  />
                </Col>
              </Row>
            </MyCard>
          </Col>
          <Col {...colResponsive}>
            <MyCard
              title={`7. Hình ảnh / tài liệu (${imagesWatch?.length ?? 0}/20)`}
              extra={
                model && (
                  <>
                    <Button type="link" onClick={() => setOpenDeletedImg(true)}>
                      Lịch sử hình ảnh
                    </Button>
                    <DeletedImgModal
                      contentId={model.Id}
                      TableName={ETableName.Property}
                      isOpen={openDeletedImg}
                      onClose={() => setOpenDeletedImg(false)}
                    />
                  </>
                )
              }
            >
              <Form.Item
                label=""
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
                  maxCount={20}
                  accept="image/*"
                  action={imagesApi.uploadUrl}
                  model={{
                    TableName: ETableName.Property,
                    resize: false,
                    watermark: true,
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
            </MyCard>
          </Col>
          <Col {...colResponsive}>
            <MyCard title="8. Video (dung lượng <= 20MB)">
              <Form.Item
                name="Video"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
              >
                <VideoUpload
                  maxCount={1}
                  accept="video/*"
                  action={imagesApi.uploadVideoUrl}
                  model={{
                    TableName: ETableName.Property,
                    Resize: false,
                    Watermark: false,
                  }}
                  showUploadList={false}
                  onDelete={(uid) => {
                    const imagesValue = form.getFieldValue(
                      "Video"
                    ) as IMyUploadFile[];
                    form.setFieldValue(
                      "Video",
                      imagesValue.filter((x) => x.uid !== uid)
                    );
                  }}
                />
              </Form.Item>
            </MyCard>
          </Col>
        </Row>
      </Card>
      {inModal ? (
        <Row
          justify="center"
          style={{
            position: "sticky",
            bottom: 0,
            padding: "12px 0",
            marginTop: 12,
            background: "var(--ant-color-bg-container, #fff)",
            borderTop: "1px solid var(--ant-color-border-secondary, #f0f0f0)",
            zIndex: 1,
          }}
        >
          <Space wrap>
            {onClose && (
              <Button size="large" block={smallScreen} onClick={onClose}>
                Đóng
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              block={smallScreen}
              loading={isSubmit}
              htmlType="submit"
            >
              {model && model.Id > 0 ? "Cập nhật" : "Thêm mới"}
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
                  router.push(`${AppRoutes.feed.url}/add?propId=${model?.Id}`)
                }
              >
                Đăng tin
              </Button>
            )}
          </Space>
        </Row>
      ) : (
        <BottomFixed>
          <Space>
            <Button
              type="primary"
              size="large"
              block={smallScreen}
              loading={isSubmit}
              htmlType="submit"
            >
              {model && model.Id > 0 ? "Cập nhật" : "Thêm mới"}
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
                  router.push(`${AppRoutes.feed.url}/add?propId=${model?.Id}`)
                }
              >
                Đăng tin
              </Button>
            )}
          </Space>
        </BottomFixed>
      )}

      {previewData && (
        <PropPreviewModal
          isModalOpen={preview}
          model={previewData}
          handleCancel={() => setPreview(false)}
          handleOk={() => onFinish(previewData)}
        />
      )}
      <GeocodeModal
        isModalOpen={openGeocode}
        handleCancel={() => setOpenGeocode(false)}
      >
        <EmblededGoong
          form={form}
          address={form.getFieldValue("PropAddress")}
          name={{
            placeId: ["PropAddress", "PlaceId"],
            lng: ["PropAddress", "Lng"],
            lat: ["PropAddress", "Lat"],
          }}
        />
      </GeocodeModal>
    </Form>
  );
};
export default PropAddEdit;
