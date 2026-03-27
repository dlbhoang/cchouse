import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Space, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import RenderPhone from "@/lib/components/shared/CustomRender/RenderPhone";
import ImagesPreview from "@/lib/components/shared/ImagesPreview";
import MyCard from "@/lib/components/shared/MyCard";
import { appConst } from "@/lib/core/configs/appConst";
import { ETableName, ETransType } from "@/lib/core/enum";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import imagesApi from "@/services/api/imagesApi";

const { Text } = Typography;

type Prop = {
  data: IPropResponse;
};

const PropMapDetail = ({ data }: Prop) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [images, setImages] = useState<IMyUploadFile[]>([]);
  const { smallScreen: isMobile } = useAdminContext();

  useEffect(() => {
    const fetchData = async () => {
      const result = await imagesApi.get({
        ContentId: Number(data.Id),
        TableName: ETableName.Property,
      });
      setImages(
        result.data.map((e) => ({
          uid: e.Id.toString(),
          name: e.FileName,
          url: e.Path,
          createdBy: e.CreatedBy,
          createdDate: e.CreatedDate,
          type: "image/png",
        }))
      );
    };
    fetchData();
  }, [data.Id]);
  return (
    <Card
      style={{
        overflow: "auto",
        height: isMobile ? "90vh" : "85vh",
        minWidth: 400,
        maxWidth: 450,
      }}
    >
      <Space>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        />
        <Tag
          style={{
            color: "#ffffff",
            backgroundColor: appConst.PROP_STATUS_COLORS[data.Status - 1],
          }}
        >
          {`Mã: ${data.Id}`}
        </Tag>
        <Text strong>{CombineAddress({ ...data.PropAddress })}</Text>
      </Space>
      <MyCard title="1. Loại hình / Vị trí">
        <Descriptions layout="vertical" column={2} size="small">
          <Descriptions.Item label="Loại BĐS">
            {data.PropAddress.PropTypeName}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái giao dịch">
            {data.StatusName}
          </Descriptions.Item>

          <Descriptions.Item label="Vị trí">
            {data.PropAddress.LocationName}
          </Descriptions.Item>
          <Descriptions.Item label="Đặc điểm vị trí">
            {data.PropAddress.LocationFeatureName}
          </Descriptions.Item>
          <Descriptions.Item label="Độ rộng đường (m)">
            {data.PropAddress.StreetWidth}
          </Descriptions.Item>
          <Descriptions.Item label="Hướng">
            {data.PropAddress.DirectionName}
          </Descriptions.Item>
        </Descriptions>
      </MyCard>
      <MyCard title="2. Diện tích / Hiện trạng">
        <Descriptions layout="vertical" column={2} size="small">
          <Descriptions.Item label="Chiều rộng (m)">
            {data.Width}
          </Descriptions.Item>
          <Descriptions.Item label="Chiều dài (m)">
            {data.Length}
          </Descriptions.Item>
          <Descriptions.Item label="Diện tích">
            <RenderArea
              area={data.Area}
              length={data.Length}
              width={data.Width}
              backSide={data.BackSide}
            />
          </Descriptions.Item>

          <Descriptions.Item label="Tổng DT sàn (m2)">
            {data.FloorArea}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Hầm">{data.Basement}</Descriptions.Item> */}
          <Descriptions.Item label="Kết cấu">
            {data.CustomDisplayStructures}
          </Descriptions.Item>
        </Descriptions>
      </MyCard>
      <MyCard
        title={`3. Chủ nhà / Giá ${
          data.TransType === ETransType.sell ? "bán" : "thuê"
        }`}
      >
        <Descriptions layout="vertical" column={2} size="small">
          <Descriptions.Item label="Nhận diện KH">
            {data.CustomerTypeName}
          </Descriptions.Item>
          <Descriptions.Item
            label="Tên liên hệ"
            style={{ textTransform: "capitalize" }}
          >
            {data.CustomerName}
          </Descriptions.Item>
          <Descriptions.Item label="Tình trạng nhà">
            {data.PropAddress.StatusUsageName}
          </Descriptions.Item>

          <Descriptions.Item label="Giá bán">
            {data.DisplayPrice}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Điện thoại">
            {[1, 2].includes(session?.user.RoleId ?? 0) ||
            session?.user.Id === data?.UserAdminId ||
            !data?.IsHidePhone ? (
              <RenderPhone phones={data?.CustomerPhone.toString().split(",")} />
            ) : (
              <span>SĐT đang bị ẩn, vui lòng liên hệ quản lý</span>
            )}
          </Descriptions.Item>
        </Descriptions>
      </MyCard>
      <MyCard
        title={`4. Trang thiết bị / Tiện ích ${
          data.TransType === ETransType.sell ? "bán" : "thuê"
        }`}
      >
        <Descriptions layout="vertical" column={2} size="small">
          <Descriptions.Item label="Số phòng">{data.Bedroom}</Descriptions.Item>
          <Descriptions.Item label="Số toilet">
            {data.Bathroom}
          </Descriptions.Item>
          <Descriptions.Item label="Trang thiết bị">
            {data.DisplayEquipments}
          </Descriptions.Item>
          <Descriptions.Item label="Tiện ích">
            {data.DisplayUtilities}
          </Descriptions.Item>
        </Descriptions>
      </MyCard>
      <MyCard title="5. Ghi chú nội bộ">{data.Note}</MyCard>
      <MyCard title="6. Hình ảnh / tài liệu">
        <ImagesPreview images={images} imgWidth={30} />
      </MyCard>
      <MyCard title="7. Video">
        {data.Video && (
          <ReactPlayer width={isMobile ? 350 : 600} url={data.Video} controls />
        )}
      </MyCard>
    </Card>
  );
};
export default PropMapDetail;
