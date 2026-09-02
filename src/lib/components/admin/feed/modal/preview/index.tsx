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

  // Dữ liệu "sống" dùng để render (mặc định lấy theo prop, sẽ được
  // thay bằng bản mới nhất lấy từ server ngay khi mở modal).
  const [liveData, setLiveData] = useState<IFeedResponse>(data);

  useEffect(() => {
    setLiveData(data);
  }, [data]);

  // Khi mở modal, luôn lấy lại trạng thái mới nhất từ server thay vì
  // tin vào dữ liệu cũ trong danh sách (list có thể đã lỗi thời nếu
  // tin vừa được đổi trạng thái ở nơi khác/tab khác).
  useEffect(() => {
    const refetch = async () => {
      if (isModalOpen && data?.Id) {
        try {
          const res = await feedApi.getById(data.Id);
          if (res?.data) setLiveData(res.data);
        } catch {
          // nếu lấy lỗi thì vẫn dùng data cũ, không chặn việc xem tin
        }
      }
    };
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, data?.Id]);

  useEffect(() => {
    const fetch = async () => {
      if (Array.isArray(liveData?.Property?.Images)) {
        const promises = liveData.Property.Images.map((e) => {
          if (typeof e === "string") {
            return e;
          }
          return e.originFileObj
            ? fileServices.getBase64(e.originFileObj as RcFile)
            : e.url ?? "";
        });
        const result = await Promise.all(promises);
        setImages(result);
      } else if (liveData?.Property?.Images) setImages(liveData.Property.Images);
    };
    fetch();
  }, [liveData?.Property?.Images]);

  const handleStatus = async (status: number) => {
    try {
      await feedApi.changeStatus({
        Id: liveData.Id,
        Status: status,
        ReasonDeny: reason,
      });
    } finally {
      // Luôn đóng modal + mutate lại danh sách, kể cả khi lỗi
      // (vd: tin đã được đổi trạng thái ở nơi khác trước đó),
      // để không giữ lại một tin đã "chết" trong cache list.
      handleCancel();
    }
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
      {liveData.Property && (
        <Row gutter={[12, 12]}>
          <Col lg={18}>
            <Card
              title={
                <div>
                  <ImageZone
                    images={images}
                    video={liveData.Property.Video?.toString()}
                    position={
                      liveData.Property.Lat && liveData.Property.Lng
                        ? {
                            lat: liveData.Property.Lat,
                            lng: liveData.Property.Lng,
                          }
                        : undefined
                    }
                  />
                  <Title level={5} style={{ whiteSpace: "initial" }}>
                    <Tag> Mã: {liveData?.Id}</Tag>
                    {liveData?.Title}
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
                      {liveData.Property.HiddenPrice
                        ? "Thoả thuận"
                        : liveData?.Property.DisplayPrice}
                    </Title>
                    {!liveData.Property.HiddenPrice && (
                      <Text type="secondary">
                        {liveData.Property.PricePerSquareMeter}
                      </Text>
                    )}
                    <Text type="secondary">
                      {liveData.Property.PaymentMethod === 4
                        ? `~ ${ConvertUsdToVnd(liveData.Property.FullPrice)}`
                        : ""}{" "}
                      (thương lượng)
                    </Text>
                  </Space>
                  <Text type="secondary" style={{ float: "inline-end" }}>
                    Ngày đăng:{" "}
                    {liveData?.StartDate
                      ? FormatDate(liveData.StartDate?.toString())
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
                    <Text>{liveData.Property.LocationName || emptyVal} </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Diện tích: </Text>
                    <RenderArea
                      area={liveData?.Property.Area ?? 0}
                      length={liveData?.Property.Length}
                      width={liveData?.Property.Width}
                    />
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Pháp lý:</Text>
                    <Text>
                      {
                        enumList.Law.find(
                          (x) => x.Value === Number(liveData?.Property?.Laws)
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
                        Basement: liveData?.Property.Basement,
                        Floors: liveData?.Property.Floors,
                        Structures: liveData?.Property.Structures,
                      })}
                    </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Hướng:</Text>
                    <Text>{liveData?.Property.DirectionName ?? emptyVal}</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Nội thất:</Text>
                    <Text>
                      {liveData?.Property.Furniture
                        ? liveData?.Property.Furniture
                        : emptyVal}
                    </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space wrap align="center">
                    <Text type="secondary">Tiện ích:</Text>
                    <Text>
                      {liveData?.Property?.Utils?.map((e) =>
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
                      {liveData?.Property?.Equipments?.map((e) =>
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
                    {liveData?.Content ? liveData?.Content : "Không có nội dung mô tả"}
                  </Text>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={24} lg={6}>
            <ConsultantContact data={liveData} />
          </Col>
          {!readOnly && (
            <BottomFixed>
              <Space>
                {liveData.Id > 0 && (
                  <Tag color={tagColor(liveData?.StatusName)}>
                    {liveData?.StatusName}
                  </Tag>
                )}
                {!liveData.Id && (
                  <Button type="primary" size="large" onClick={onSubmit}>
                    Đăng tin
                  </Button>
                )}
                {showEdit && (
                  <Button href={`${AppRoutes.feed.url}/${liveData.Id}`}>
                    Chỉnh sửa
                  </Button>
                )}
                {[2, 3].includes(liveData.Status) && (
                  <Button
                    type="primary"
                    size="large"
                    disabled={
                      !liveData?.Author?.IsAdmin ||
                      liveData?.Author?.Id !== session?.user.Id
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
                              ...liveData,
                              StartDate: FormatDateSubmit(
                                refDate.current?.toString()
                              ),
                              Property: {
                                ...liveData.Property,
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

                {liveData?.Id > 0 &&
                  liveData?.Author?.IsAdmin &&
                  liveData.Author?.Id === session?.user.Id &&
                  liveData?.StatusName === "Đang hiển thị" && (
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
                          try {
                            await feedApi.hidden(liveData.Id);
                          } finally {
                            handleCancel();
                          }
                        }}
                        btnText="Ẩn tin"
                        title="Xác nhận ẩn tin đăng?"
                      />
                    </Space>
                  )}
                {liveData?.Id > 0 &&
                  isAdminOrModOrManager &&
                  liveData?.StatusName === "Đang hiển thị" && (
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
                {liveData?.Id > 0 &&
                  isAdminOrModOrManager &&
                  liveData?.StatusName === "Chờ xử lý" && (
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