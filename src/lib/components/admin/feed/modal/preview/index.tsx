import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { RcFile } from "antd/es/upload";
import { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import BottomFixed from "@/lib/components/shared/BottomFixed";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import {
  CombineStructures,
  ConvertUsdToVnd,
  DisabledDate,
  FormatDate,
  FormatDateSubmit,
} from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import feedApi from "@/services/api/feed/feedApi";
import { IFeedResponse } from "@/services/api/feed/IFeed";
import { fileServices } from "@/services/api/services/fileServices";
import ConsultantContact from "../../../property/consultantContact";

import { tagColor } from "../../utils";
import ImageZone from "./ImageZone";

const { Text, Title } = Typography;
const { TextArea } = Input;
const emptyVal = "Đang cập nhật";
const titleStyle = {
  fontSize: 18,
  fontWeight: 600,
  lineHeight: "40px",
};

type Props = {
  isModalOpen: boolean;
  data: IFeedResponse;
  readOnly?: boolean;
  showEdit?: boolean;
  handleCancel: () => void;
  onSubmit: () => void;
};

// eslint-disable-next-line complexity
const FeedModalPreview = ({
  isModalOpen,
  data,
  readOnly = false,
  showEdit = false,
  handleCancel,
  onSubmit,
}: Props) => {
  const refDate = useRef<Dayjs>();
  const { enumList, managedUsers } = useAdminContext();
  const [reason, setReason] = useState<string>();
  const { data: session } = useSession();
  const isAdminOrModOrManager =
    [1, 2].includes(session?.user?.RoleId ?? 0) ||
    managedUsers.some((x) => x.Id === data.Author?.Id);

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (Array.isArray(data?.Property?.Images)) {
        const promises = data.Property.Images.map((e) => {
          if (typeof e === "string") {
            return e;
          }
          return e.originFileObj
            ? fileServices.getBase64(e.originFileObj as RcFile)
            : e.url ?? "";
        });
        const result = await Promise.all(promises);
        setImages(result);
      } else if (data?.Property?.Images) setImages(data.Property.Images);
    };
    fetch();
  }, [data?.Property?.Images]);

  const handleStatus = async (status: number) => {
    await feedApi.changeStatus({
      Id: data.Id,
      Status: status,
      ReasonDeny: reason,
    });
    handleCancel();
  };
  return (
    <Modal
      title="Xem tin đăng"
      maskClosable={false}
      open={isModalOpen}
      width={1200}
      onCancel={() => {
        handleCancel();
      }}
      footer={null}
    >
      {data.Property && (
        <Row gutter={[12, 12]}>
          <Col lg={18}>
            <Card
              title={
                <div>
                  <ImageZone
                    images={images}
                    video={data.Property.Video?.toString()}
                    position={
                      data.Property.Lat && data.Property.Lng
                        ? {
                            lat: data.Property.Lat,
                            lng: data.Property.Lng,
                          }
                        : undefined
                    }
                  />
                  <Title level={5} style={{ whiteSpace: "initial" }}>
                    <Tag> Mã: {data?.Id}</Tag>
                    {data?.Title}
                  </Title>
                  <Space style={{ alignItems: "end" }}>
                    <Text strong>Giá: </Text>
                    <Title
                      level={4}
                      style={{
                        color: "#167EE6",
                        margin: 0,
                      }}
                    >
                      {data.Property.HiddenPrice
                        ? "Thoả thuận"
                        : data?.Property.DisplayPrice}
                    </Title>
                    {!data.Property.HiddenPrice && (
                      <Text type="secondary">
                        {data.Property.PricePerSquareMeter}
                      </Text>
                    )}
                    <Text type="secondary">
                      {data.Property.PaymentMethod === 4
                        ? `~ ${ConvertUsdToVnd(data.Property.FullPrice)}`
                        : ""}{" "}
                      (thương lượng)
                    </Text>
                  </Space>
                  <Text type="secondary" style={{ float: "inline-end" }}>
                    Ngày đăng:{" "}
                    {data?.StartDate
                      ? FormatDate(data.StartDate?.toString())
                      : undefined}
                  </Text>
                </div>
              }
            >
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Text style={titleStyle}>Thông tin chi tiết</Text>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Vị trí: </Text>
                    <Text>{data.Property.LocationName || emptyVal} </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Diện tích: </Text>
                    <RenderArea
                      area={data?.Property.Area ?? 0}
                      length={data?.Property.Length}
                      width={data?.Property.Width}
                    />
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Pháp lý:</Text>
                    <Text>
                      {
                        enumList.Law.find(
                          (x) => x.Value === Number(data?.Property?.Laws)
                        )?.Name
                      }
                    </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Kêt cấu:</Text>
                    <Text>
                      {CombineStructures(enumList.Structures, {
                        Basement: data?.Property.Basement,
                        Floors: data?.Property.Floors,
                        Structures: data?.Property.Structures,
                      })}
                    </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Hướng:</Text>
                    <Text>{data?.Property.DirectionName ?? emptyVal}</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Nội thất:</Text>
                    <Text>
                      {data?.Property.Furniture
                        ? data?.Property.Furniture
                        : emptyVal}
                    </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Tiện ích:</Text>
                    <Text>
                      {data?.Property?.Utils?.map((e) =>
                        enumList.Utilities.find(
                          (x) => x.Value === e
                        )?.Name.toLowerCase()
                      )?.join(", ") || emptyVal}
                    </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Trang thiết bị:</Text>
                    <Text>
                      {data?.Property?.Equipments?.map((e) =>
                        enumList.Equipments.find(
                          (x) => x.Value === e
                        )?.Name.toLowerCase()
                      )?.join(", ") || emptyVal}
                    </Text>
                  </Space>
                </Col>

                <Col span={24}>
                  <Text style={titleStyle}>Mô tả</Text>
                </Col>
                <Col span={24}>
                  <Text style={{ whiteSpace: "pre-wrap" }}>
                    {data?.Content ? data?.Content : "Không có nội dung mô tả"}
                  </Text>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={24} lg={6}>
            <ConsultantContact data={data} />
          </Col>
          {!readOnly && (
            <BottomFixed>
              <Space>
                {data.Id > 0 && (
                  <Tag color={tagColor(data?.StatusName)}>
                    {data?.StatusName}
                  </Tag>
                )}
                {!data.Id && (
                  <Button type="primary" size="large" onClick={onSubmit}>
                    Đăng tin
                  </Button>
                )}
                {showEdit && (
                  <Button href={`${AppRoutes.feed.url}/${data.Id}`}>
                    Chỉnh sửa
                  </Button>
                )}
                {[2, 3].includes(data.Status) && (
                  <Button
                    type="primary"
                    size="large"
                    disabled={
                      !data?.Author?.IsAdmin ||
                      data?.Author?.Id !== session?.user.Id
                    }
                    onClick={() => {
                      Modal.confirm({
                        title: 'Vui lòng chọn lại "Ngày bắt đầu"',
                        content: (
                          <DatePicker
                            onChange={(val) => {
                              if (val) {
                                refDate.current = val;
                              }
                            }}
                            disabledDate={DisabledDate}
                            placeholder="Chọn"
                            format={["DD/MM/YYYY", "DD/MM/YY"]}
                            allowClear={false}
                          />
                        ),
                        onOk: async () => {
                          if (refDate) {
                            await feedApi.update({
                              ...data,
                              StartDate: FormatDateSubmit(
                                refDate.current?.toString()
                              ),
                              Property: {
                                ...data.Property,
                                Images: images,
                              },
                            });
                            handleCancel();
                          }
                        },
                      });
                    }}
                  >
                    Đăng lại tin
                  </Button>
                )}

                {data?.Id > 0 &&
                  data?.Author?.IsAdmin &&
                  data.Author?.Id === session?.user.Id &&
                  data?.StatusName === "Đang hiển thị" && (
                    <Space>
                      <BtnConfirm
                        type="text"
                        btnType="primary"
                        onOkClick={() => handleStatus(5)}
                        btnText="Đã giao dịch"
                        title="Xác nhận chuyển trạng thái?"
                      />
                      <BtnConfirm
                        type="text"
                        btnType="dashed"
                        danger
                        onOkClick={async () => {
                          await feedApi.hidden(data.Id);
                        }}
                        btnText="Ẩn tin"
                        title="Xác nhận ẩn tin đăng?"
                      />
                    </Space>
                  )}
                {data?.Id > 0 &&
                  isAdminOrModOrManager &&
                  data?.StatusName === "Đang hiển thị" && (
                    <BtnConfirm
                      type="text"
                      btnType="dashed"
                      danger
                      onOkClick={() => {
                        if (reason) handleStatus(3);
                        else throw new Error("Chưa nhập lý do");
                      }}
                      btnText="Huỷ tin"
                      title="Vui lòng nhập lý do?"
                      description={
                        <TextArea
                          placeholder="Lý do"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      }
                    />
                  )}
                {data?.Id > 0 &&
                  isAdminOrModOrManager &&
                  data?.StatusName === "Chờ xử lý" && (
                    <Space>
                      <BtnConfirm
                        type="text"
                        btnType="primary"
                        onOkClick={() => handleStatus(1)}
                        btnText="Duyệt tin"
                        title="Xác nhận duyệt tin?"
                      />
                      <BtnConfirm
                        type="text"
                        btnType="dashed"
                        danger
                        onOkClick={() => {
                          if (reason) handleStatus(3);
                          else throw new Error("Chưa nhập lý do");
                        }}
                        btnText="Từ chối"
                        title="Vui lòng nhập lý do từ chối?"
                        description={
                          <TextArea
                            placeholder="Lý do"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                        }
                      />
                    </Space>
                  )}
              </Space>
            </BottomFixed>
          )}
        </Row>
      )}
    </Modal>
  );
};

export default FeedModalPreview;
