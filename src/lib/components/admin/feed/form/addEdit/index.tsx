import { EyeOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Segmented,
  Select,
  Space,
  Tag,
  Typography,
  UploadFile,
} from "antd";
import dayjs from "dayjs";
import { ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BottomFixed from "@/lib/components/shared/BottomFixed";
import AppUpload from "@/lib/components/shared/components/app-upload";
import VideoUpload from "@/lib/components/shared/components/video-upload";
import MyCard from "@/lib/components/shared/MyCard";
import {
  EquipmentSelect,
  FeedPricingSelect,
  FurnitureSelect,
  UtilitySelect,
} from "@/lib/components/shared/MySelect";
import GoongSearch from "@/lib/components/shared/map/goong-search";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETableName } from "@/lib/core/enum";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import {
  DisabledDate,
  FormatDate,
  FormatDateSubmit,
  FormatNumber,
} from "@/lib/core/utils/myFormat";
import { useFetchImages } from "@/lib/hooks";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { useAdminContext } from "@/lib/stored";
import feedApi from "@/services/api/feed/feedApi";
import { IFeedRequest, IFeedResponse } from "@/services/api/feed/IFeed";
import imagesApi from "@/services/api/imagesApi";
import { fileServices } from "@/services/api/services/fileServices";
import FeedModalPreview from "../../modal/preview";
import { tagColor } from "../../utils";
import FirstCard from "./firstCard";
import SecondCard from "./secondCard";

const BaseMap = dynamic(() => import("@/lib/components/shared/map"), {
  ssr: false,
});

const { TextArea } = Input;
const hiddenFields = [
  "Id",
  "Status",
  "StatusName",
  "Author",
  ["Property", "TransType"],
  ["Property", "Id"],
  ["Property", "RefPropId"],
  ["Property", "AddressNumber"],
  ["Property", "StreetId"],
  ["Property", "WardId"],
  ["Property", "DistrictId"],
  ["Property", "ProvinceId"],
  ["Property", "ShowAddressNumber"],
  ["Property", "DistrictName"],
  ["Property", "WardName"],
  ["Property", "StreetName"],
  ["Property", "PropTypeName"],
  ["Property", "TransTypeName"],
  ["Property", "LocationName"],
  ["Property", "DirectionName"],
  ["Property", "StatusName"],
  ["Property", "IsCorner"],
  ["Property", "Floors"],
  ["Property", "Basement"],
  ["Property", "Structures"],
  ["Property", "PaymentMethod"],
  ["Property", "PlaceId"],
  ["Property", "Lng"],
  ["Property", "Lat"],
];

type Props = {
  model?: IFeedResponse;
};

type FormState = {
  previewItem?: IFeedResponse;
  isSubmit: boolean;
  openPreview: boolean;
  showPropImages: boolean;
};
const AddEditForm = ({ model }: Props) => {
  const { smallScreen } = useAdminContext();
  const router = useRouter();
  const isUpdate = (model?.Id ?? 0) > 0;
  const [state, setState] = useState<FormState>({
    isSubmit: false,
    openPreview: false,
    showPropImages: false,
  });

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const [form] = Form.useForm<IFeedResponse>();
  const { data: session } = useSession();

  const transTypeWatch = Form.useWatch(["Property", "TransType"], form);
  const lngWatch: number | undefined = Form.useWatch(["Property", "Lng"], form);
  const latWatch: number | undefined = Form.useWatch(["Property", "Lat"], form);

  const [showPropImages, setShowPropImages] = useState(false);

  const propImages = useFetchImages({
    contentId: Number(model?.Property?.RefPropId ?? 0),
    TableName: ETableName.Property,
  });

  const handleSelectImages = (uid: string, checked: boolean) => {
    const images: any[] = form.getFieldValue(["Property", "Images"]) ?? [];
    if (checked) {
      const existIndex = images?.findIndex((x) => x.uid === uid);
      const item = propImages.find((x) => x.Id.toString() === uid);
      if (existIndex === -1 && item)
        form.setFieldValue(
          ["Property", "Images"],
          [...images, ...fileServices.mapFromFileUpload([item])]
        );
    } else {
      form.setFieldValue(
        ["Property", "Images"],
        [images?.filter((x) => x.uid !== uid)]
      );
    }
  };

  useEffect(() => {
    if (model) {
      console.log(fileServices.mapFromString(model.Property.Video as string));

      form.setFieldsValue({
        ...model,

        StartDate: model?.StartDate ? dayjs(model?.StartDate) : undefined,
        Title: model?.Title,
        Days: appConst.ARR_DAYS_FEED[4],
        Property: {
          ...model.Property,
          FullPrice: Math.round(model.Property.FullPrice),
          Images: fileServices.mapFromString(model.Property?.Images as []),
          Video: model.Property.Video
            ? fileServices.mapFromString(model.Property.Video.toString())
            : [],
        },
      });
    }
  }, [form, model]);

  const onFinish = async (item: IFeedRequest) => {
    console.log("Success:", item);
    setIsSubmit(true);
    try {
      if (item.Property.Images) {
        item.Property.Images = fileServices.processFiles(
          item.Property.Images as UploadFile[]
        );
      }
      if (item.Property.Video) {
        const result = fileServices.processFiles(
          item.Property.Video as UploadFile[]
        );
        item.Property.Video = result.toString();
      }

      const result: IFeedRequest = {
        ...item,
        StartDate: FormatDateSubmit(item.StartDate?.toString()),
      };
      if (result.Id > 0) {
        await feedApi.update(result);
      } else await feedApi.add(result);

      router.push(AppRoutes.feed.url);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Form
      name="basic"
      disabled={isSubmit}
      onFinish={onFinish}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      initialValues={{
        Property: { TransType: 1, ProvinceId: 1 },
        FeedPricingId: 7,
        Days: appConst.ARR_DAYS_FEED[4],
      }}
      form={form}
      layout="vertical"
    >
      {hiddenFields.map((e) => (
        <Form.Item name={e} hidden key={e.toString()}>
          <Input />
        </Form.Item>
      ))}
      <Row gutter={[12, 12]}>
        <Col lg={16}>
          <Card
            title={
              isUpdate
                ? `Chi tiết tin đăng - Mã tin: ${model?.Id}`
                : "Tạo tin đăng mới"
            }
            extra={
              <Typography.Text type="secondary">
                {model?.ViewCount} lượt xem
              </Typography.Text>
            }
          >
            <Row>
              <Col span={24}>
                <Segmented
                  block
                  options={[
                    { label: "Mua bán", value: 1 },
                    { label: "Cho thuê", value: 2 },
                  ]}
                  value={transTypeWatch}
                  onChange={(val) => {
                    form.setFieldValue(["Property", "TransType"], val);
                  }}
                />
              </Col>
              <Col span={24}>
                <FirstCard form={form} />
              </Col>
              <Col span={24}>
                <SecondCard form={form} />
              </Col>
              <Col span={24}>
                <MyCard title="3. Trang thiết bị / Tiện ích">
                  <Row gutter={12}>
                    <Col lg={8} xl={8} xs={24}>
                      <Form.Item
                        label="Trang thiết bị"
                        name={["Property", "Equipments"]}
                      >
                        <EquipmentSelect mode="multiple" />
                      </Form.Item>
                    </Col>
                    <Col lg={8} xl={8} xs={24}>
                      <Form.Item label="Tiện ích" name={["Property", "Utils"]}>
                        <UtilitySelect mode="multiple" />
                      </Form.Item>
                    </Col>
                    <Col lg={8} xl={8} xs={24}>
                      <Form.Item
                        label="Nội thất"
                        name={["Property", "Furniture"]}
                      >
                        <FurnitureSelect />
                      </Form.Item>
                    </Col>
                  </Row>
                </MyCard>
              </Col>
              <Col span={24}>
                <MyCard title="4. Tiêu đề & Nội dung tin đăng">
                  <Col xs={24}>
                    <Form.Item
                      label="Tiêu đề"
                      name="Title"
                      rules={[{ required: true }]}
                    >
                      <TextArea
                        showCount={{
                          formatter: ({ count, maxLength }) =>
                            `${count} / ${maxLength} kí tự`,
                        }}
                        maxLength={100}
                        minLength={30}
                        placeholder={appConst.DATA_FEED_FAKE.Title}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Nội dung"
                      name="Content"
                      rules={[{ required: true }]}
                    >
                      <TextArea
                        showCount={{
                          formatter: ({ count, maxLength }) =>
                            `${count} / ${maxLength} kí tự`,
                        }}
                        maxLength={2000}
                        minLength={100}
                        rows={5}
                        placeholder={appConst.DATA_FEED_FAKE.Content}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label={
                        <div className="form-item-checkbox">
                          <Row>
                            <Col xs={24} md={12}>
                              <Typography.Text>
                                Vị trí bất động sản
                              </Typography.Text>
                            </Col>
                            <Col xs={24} md={12}>
                              {latWatch && lngWatch ? (
                                <Tag color="success">
                                  Đã lấy được vị trí:{" "}
                                  {`${latWatch},${lngWatch}`}
                                </Tag>
                              ) : (
                                <Tag>Chưa có thông tin</Tag>
                              )}
                            </Col>
                          </Row>
                        </div>
                      }
                      name="GeoItem"
                    >
                      <BaseMap
                        position={
                          latWatch && lngWatch
                            ? { lat: latWatch, lng: lngWatch }
                            : undefined
                        }
                        onPositionChange={({ lat, lng }) => {
                          form.setFieldValue(["Property", "Lat"], lat);
                          form.setFieldValue(["Property", "Lng"], lng);
                        }}
                        searchItem={
                          <GoongSearch
                            handleSearch={(item) => {
                              form.setFieldValue(
                                ["Property", "PlaceId"],
                                item.place_id
                              );
                              form.setFieldValue(
                                ["Property", "Lng"],
                                item.geometry.location.lng
                              );
                              form.setFieldValue(
                                ["Property", "Lat"],
                                item.geometry.location.lat
                              );
                            }}
                          />
                        }
                      />
                    </Form.Item>
                  </Col>
                </MyCard>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={8}>
          <Card
            title="Hình ảnh & Video"
            extra={
              model?.Property?.RefPropId && (
                <>
                  <Button
                    type="primary"
                    onClick={() => setShowPropImages(true)}
                    icon={<ImageIcon className="size-4" />}
                  >
                    Chọn
                  </Button>
                  <Modal
                    maskClosable
                    onCancel={() => setShowPropImages(false)}
                    open={showPropImages}
                    title="Chọn hình ảnh"
                    width={900}
                    footer={null}
                  >
                    <Space wrap align="center">
                      {propImages.map((e) => (
                        <Card
                          key={e.Id}
                          style={{ width: 150 }}
                          cover={
                            <Image
                              src={e.Path}
                              alt={e.Path}
                              height={120}
                              preview={false}
                            />
                          }
                        >
                          <Space align="start">
                            <Checkbox
                              onChange={(i) =>
                                handleSelectImages(
                                  e.Id.toString(),
                                  i.target.checked
                                )
                              }
                            />
                            <Space direction="vertical" size="small">
                              <Typography.Text strong>
                                {e.CreatedBy}
                              </Typography.Text>
                              <Typography.Text type="secondary">
                                {FormatDate(e.CreatedDate)}
                              </Typography.Text>
                            </Space>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                  </Modal>
                </>
              )
            }
          >
            <Col xs={24}>
              <Form.Item
                label="Hình ảnh (3 - 15 ảnh)"
                name={["Property", "Images"]}
                valuePropName="fileList"
                getValueFromEvent={(e: any) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng tải thêm ảnh",
                  },
                  {
                    validator: (_, value) => {
                      if (value && value.length > 2) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("ít nhất 3 ảnh"));
                    },
                  },
                ]}
              >
                <AppUpload
                  multiple
                  maxCount={15}
                  accept="image/*"
                  action={imagesApi.uploadUrl}
                  model={{
                    TableName: ETableName.Feed,
                    watermark: true,
                  }}
                  showUploadList={false}
                  onDelete={(uid) => {
                    const imagesValue = form.getFieldValue([
                      "Property",
                      "Images",
                    ]) as IMyUploadFile[];
                    form.setFieldValue(
                      ["Property", "Images"],
                      imagesValue.filter((x) => x.uid !== uid)
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name={["Property", "Video"]}
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
                    TableName: ETableName.Feed,
                  }}
                  showUploadList={false}
                  onDelete={(uid) => {
                    const values = form.getFieldValue([
                      "Property",
                      "Video",
                    ]) as IMyUploadFile[];
                    form.setFieldValue(
                      ["Property", "Video"],
                      values.filter((x) => x.uid !== uid)
                    );
                  }}
                />
              </Form.Item>
            </Col>
          </Card>
          <Card title="Chi phí đăng tin">
            <Row gutter={12}>
              <Col xs={12}>
                <Form.Item
                  label="Loại tin"
                  name="FeedPricingId"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn loại tin",
                    },
                  ]}
                >
                  <FeedPricingSelect />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  label="Số ngày đăng"
                  name="Days"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn số ngày đăng tin",
                    },
                  ]}
                  initialValue="30"
                >
                  <Select
                    placeholder="Chọn"
                    allowClear
                    options={appConst.ARR_DAYS_FEED.map((e) => ({
                      label: `${e} Ngày`,
                      value: e.toString(),
                    }))}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Row justify="space-between">
                  <Col>
                    <Typography.Text>Chi phí:</Typography.Text>
                  </Col>
                  <Col>
                    <Typography.Text>0 vnđ</Typography.Text>
                  </Col>
                </Row>
              </Col>
              <Divider />
              <Col xs={12}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="StartDate"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn Ngày bắt đầu",
                    },
                  ]}
                >
                  <DatePicker
                    disabledDate={DisabledDate}
                    placeholder="Chọn"
                    format={["DD/MM/YYYY", "DD/MM/YY"]}
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item label="Số lần đăng lại" name="AutoRenew">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item label="Tổng tiền" name="TotalPrice">
                  <InputNumber
                    bordered={false}
                    readOnly
                    formatter={FormatNumber}
                    defaultValue={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Alert
            message={
              <Form.Item
                label="Chọn SĐT hiển thị"
                name="IsCompanyPhone"
                rules={[
                  {
                    required: true,
                  },
                ]}
                initialValue={!!session?.user.CompanyPhone}
              >
                <Radio.Group>
                  <Radio value disabled={!session?.user.CompanyPhone}>{`${
                    session?.user.CompanyPhone ?? appConst.TEXT_DEFAULT
                  } (công ty)`}</Radio>
                  <Radio value={false}>
                    {`${session?.user.Phone} (cá nhân)`}{" "}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            }
            type="info"
            style={{ marginBlock: 10 }}
          />
        </Col>
      </Row>
      {!state.openPreview && (
        <BottomFixed>
          <Space>
            {(model?.Id ?? 0) > 0 && (
              <Tag color={tagColor(model?.StatusName)}>{model?.StatusName}</Tag>
            )}
            <Button
              icon={<EyeOutlined />}
              size="large"
              onClick={async () => {
                if (await form.validateFields()) {
                  const data = form.getFieldsValue();
                  const feedResponse = await feedApi.toFeedResponse({
                    ...data,
                    Property: {
                      ...data.Property,
                      Images: [],
                      Video: data.Property.Video?.toString() || "",
                    },
                  });
                  if (feedResponse) {
                    setState({
                      ...state,
                      openPreview: true,
                      previewItem: {
                        ...feedResponse.data,
                        Author: data.Author,
                        Property: {
                          ...feedResponse?.data?.Property,
                          Images: data.Property.Images,
                          Video: data.Property.Video?.toString() || "",
                        },
                      },
                    });
                  }
                }
              }}
            >
              Xem tin
            </Button>
            {(model?.Id ?? 0) > 0 &&
              ([2, 3].includes(model?.Status ?? 0) ? (
                <Button
                  type="primary"
                  size="large"
                  disabled={
                    !model?.Author?.IsAdmin ||
                    model?.Author?.Id !== session?.user.Id
                  }
                  onClick={() => {
                    Modal.confirm({
                      title: 'Vui lòng chọn lại "Ngày bắt đầu"',
                      content: (
                        <DatePicker
                          onChange={(val) =>
                            form.setFieldValue("StartDate", val)
                          }
                          disabledDate={DisabledDate}
                          placeholder="Chọn"
                          format={["DD/MM/YYYY", "DD/MM/YY"]}
                        />
                      ),
                      onOk: form.submit,
                    });
                  }}
                >
                  Đăng lại tin
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  disabled={
                    !model?.Author?.IsAdmin ||
                    model?.Author?.Id !== session?.user.Id
                  }
                  onClick={form.submit}
                  loading={isSubmit}
                >
                  Cập nhật
                </Button>
              ))}
          </Space>
        </BottomFixed>
      )}

      {state.previewItem && (
        <FeedModalPreview
          data={state.previewItem}
          isModalOpen={state.openPreview}
          handleCancel={() => {
            setState({ ...state, openPreview: false });
            router.back();
          }}
          onSubmit={() => {
            form.submit();
            setState({ ...state, openPreview: false });
          }}
        />
      )}
    </Form>
  );
};

export default AddEditForm;
