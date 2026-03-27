/* eslint-disable react/no-unstable-nested-components */
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  QRCode,
  Row,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { SquarePenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import UserAdminEdit from "@/lib/components/admin/userAdmin/modal/userAdminEdit";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { FormatNumber } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import { IUserAdminResponse } from "@/services/api/userAdmin/IUserAdmin";

const UserAdminInfo = ({ data }: { data: IUserAdminResponse }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const { districts, managers } = useAdminContext();

  const { UserAccess } = data;
  return (
    <Card title="Thông tin nhân viên" bodyStyle={{ padding: 10 }}>
      <Row gutter={[12, 12]}>
        <Col xs={24} style={{ display: "flex", justifyContent: "center" }}>
          <Space direction="vertical" align="center">
            {data && (
              <Avatar
                size={120}
                src={
                  <Image
                    height="100%"
                    src={data.Avatar?.toString()}
                    fallback="/user.jpg"
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                  />
                }
              />
            )}
          </Space>
        </Col>
        <Col span={24}>
          <Row align="middle" gutter={12}>
            <Col span={8}>
              <QRCode
                size={80}
                errorLevel="Q"
                value="https://cchouse.vn/"
                icon="/logo.png"
                iconSize={15}
              />
            </Col>
            <Col span={16}>
              <Space>
                <Descriptions layout="horizontal" size="small" column={1}>
                  <Descriptions.Item label="Mã">{data?.Code}</Descriptions.Item>
                  <Descriptions.Item label="Họ và tên">
                    {data?.Name}
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={24}>
          <Descriptions bordered layout="horizontal" size="small" column={1}>
            <Descriptions.Item label="Chức vụ">
              {data?.RoleName}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Badge status="processing" text={data?.StatusName} />
            </Descriptions.Item>
            <Descriptions.Item label="Quản lý bởi">
              {data.ManagedBy &&
                managers.find((x) => x.Id === data.ManagedBy)?.Name}
            </Descriptions.Item>
            <Descriptions.Item label="ĐT cá nhân">
              {data?.Phone}
            </Descriptions.Item>
            <Descriptions.Item label="ĐT Công ty">
              {data?.CompanyPhone ?? "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Hoa hồng">
              {data?.Commission ? `${data?.Commission}%` : "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Lương">
              {data?.Salary ? `${FormatNumber(data.Salary)} VNĐ` : "Không có"}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày vào làm">
              {dayjs(UserAccess?.DateStart).format(appConst.DATE_FORMAT)}
            </Descriptions.Item>
            <Descriptions.Item label=" Giờ làm việc">
              {dayjs(UserAccess?.TimeFrom, appConst.TIME_FORMAT).format(
                appConst.TIME_FORMAT
              )}{" "}
              -{" "}
              {dayjs(UserAccess?.TimeTo, appConst.TIME_FORMAT).format(
                appConst.TIME_FORMAT
              )}{" "}
              (giờ)
            </Descriptions.Item>

            <Descriptions.Item label="Loại giao dịch">
              {UserAccess?.DisplayTransTypes?.join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="Vị trí">
              {UserAccess?.DisplayLocations?.join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="Quận hoạt động">
              <Typography.Paragraph
                ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
              >
                Bán:{" "}
                {UserAccess?.DistrictIds.length === districts.length
                  ? "Tất cả"
                  : Array.from(UserAccess?.DistrictIds ?? [])
                      .map(
                        (e) => districts.find((x) => x.Id === Number(e))?.Name
                      )
                      ?.join(", ")}
              </Typography.Paragraph>
              <Typography.Paragraph
                ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
              >
                Thuê:{" "}
                {UserAccess?.DistrictRentIds?.length === districts.length
                  ? "Tất cả"
                  : Array.from(UserAccess?.DistrictRentIds ?? [])
                      .map(
                        (e) => districts.find((x) => x.Id === Number(e))?.Name
                      )
                      ?.join(", ")}
              </Typography.Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Khung giá">
              Bán: {UserAccess?.PriceFrm} - {UserAccess?.PriceTo} (tỷ)
              <br />
              Thuê: {UserAccess?.PriceRentFrm} - {UserAccess?.PriceRentTo}{" "}
              (triệu)
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={24}>
          {session?.user.Id === data.Id && session?.user.RoleId === 3 ? (
            <Button
              block
              type="primary"
              icon={<SquarePenIcon className="size-4" />}
              onClick={() => setOpenModalEdit(true)}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Button
              block
              type="primary"
              icon={<SquarePenIcon className="size-4" />}
              onClick={() =>
                router.push(`${AppRoutes.userAdmin.url}/edit/${data.Id}`)
              }
            >
              Chỉnh sửa
            </Button>
          )}
        </Col>
      </Row>
      {data && (
        <UserAdminEdit
          isModalOpen={openModalEdit}
          handleCancel={() => setOpenModalEdit(false)}
          model={data}
        />
      )}
    </Card>
  );
};

export default UserAdminInfo;
