import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  type DescriptionsProps,
  Input,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import RenderPhone from "@/lib/components/shared/CustomRender/RenderPhone";
import ImagesPreview from "@/lib/components/shared/ImagesPreview";
import { appConst } from "@/lib/core/configs/appConst";
import { FormatDate } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import { fileServices } from "@/services/api/services/fileServices";
import type { IUserWebsiteResponse } from "@/services/api/userWebsite/model";
import userWebsiteApi from "@/services/api/userWebsite/userWebsiteApi";
import UserWebsiteStatus from "../user-status";
import UserWebsiteType from "../user-type";

type Props = {
  data: IUserWebsiteResponse;
};

const { Text } = Typography;

const UseWebsiteDetail = ({ data }: Props) => {
  const { enumList } = useAdminContext();
  const router = useRouter();
  const { Sex } = enumList;
  const demand = data?.UserWebsiteDemand;
  const [note, setNote] = useState<string>();
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Họ tên",
      children: data.FullName,
    },
    {
      key: "2",
      label: "Số điện thoại",
      children: (
        <Space>
          <RenderPhone phones={data.Phone ? [data.Phone] : undefined} />
          <Tag color={data.IsVerifiedPhone ? "success" : "default"}>
            {data.IsVerifiedPhone ? "Đã xác thực" : "Chưa xác thực"}
          </Tag>
        </Space>
      ),
    },
    {
      key: "5",
      label: "Đối tượng",
      children: data.TypeName,
    },
    {
      key: "4",
      label: "Email",
      children: data.Email || appConst.TEXT_DEFAULT,
    },

    {
      key: "3",
      label: "Ngày sinh",
      children: data.Dob
        ? FormatDate(data.Dob?.toString())
        : appConst.TEXT_DEFAULT,
    },
    {
      key: "sex",
      label: "Giới tính",
      children: data.Gender
        ? Sex.find((x) => x.Value === data.Gender)?.Name
        : appConst.TEXT_DEFAULT,
    },

    {
      key: "CCCD",
      label: "CCCD",
      children:
        data.FrontCCCDImg && data.BackCCCDImg ? (
          <ImagesPreview
            imgWidth={100}
            images={
              fileServices.mapFromString([
                data.FrontCCCDImg,
                data.BackCCCDImg,
              ]) || []
            }
          />
        ) : (
          appConst.TEXT_DEFAULT
        ),
      span: 2,
    },
    {
      key: "status",
      label: "Trạng thái",
      children: <UserWebsiteStatus value={data.StatusName} />,
    },
    {
      key: "about",
      label: "Tự giới thiệu",
      children: data.About,
      span: 3,
    },
  ];

  const demandItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Mục đích",
      children: demand?.BasicDemandNames?.join(", "),
    },
    {
      key: "2",
      label: "Tìm bất động sản",
      children:
        demand && (demand?.TransTypes?.length ?? 0) > 0 ? (
          <Space direction="vertical">
            <Text>
              Khu vực:{" "}
              {demand.DistrictNames.length === 0 && !demand?.ProvinceName
                ? appConst.TEXT_DEFAULT
                : `${demand?.DistrictNames?.join(", ")}, ${
                    demand?.ProvinceName
                  }`}
            </Text>
            <Text>
              Khoảng giá mua:{" "}
              {`${demand.PriceSellFrom} - ${demand.PriceSellTo} tỷ`}
            </Text>
            <Text>
              Khoảng giá thuê:{" "}
              {`${demand.PriceRentFrom} - ${demand.PriceRentTo} triệu`}
            </Text>
          </Space>
        ) : (
          appConst.TEXT_DEFAULT
        ),
    },
  ];

  const title = (
    <Row gutter={[12, 12]} justify="space-between">
      <Col>
        <Typography.Title level={5} style={{ marginTop: 10 }}>
          Thông tin khách hàng
        </Typography.Title>
        <Avatar src={data.Avatar} icon={<UserOutlined />} size={64} />
      </Col>
      {data?.StatusName === "Chờ duyệt" && (
        <Col>
          <Space direction="vertical">
            <Typography.Text type="secondary">
              Đã nhận thông tin xác thực
            </Typography.Text>
            <Space>
              <BtnConfirm
                btnText="Duyệt"
                btnType="primary"
                type="text"
                icon={<CheckCircleOutlined />}
                title="Xác nhận duyệt tài khoản?"
                description="Sau khi duyệt, tài khoản sẽ có thể đăng tin bất động sản"
                onOkClick={async () => {
                  if (data.Id) {
                    await userWebsiteApi.approve(data.Id, {
                      IsApproved: true,
                      Note: "",
                    });
                    router.refresh();
                  }
                }}
              />
              <BtnConfirm
                btnText="Từ chối"
                danger
                type="text"
                icon={<CloseCircleOutlined />}
                title="Xác nhận từ chối?"
                onOkClick={async () => {
                  if (data.Id) {
                    if (note) {
                      await userWebsiteApi.approve(data.Id, {
                        IsApproved: false,
                        Note: note,
                      });
                      router.refresh();
                    } else throw new Error("Chưa nhập lý do");
                  }
                }}
                description={
                  <Input.TextArea
                    placeholder="Lý do từ chối"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                }
              />
            </Space>
          </Space>
        </Col>
      )}
    </Row>
  );

  return (
    <UserWebsiteType text={data.TypeName} placement="start">
      <Card>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Descriptions title={title} items={items} />
          </Col>
          <Col span={24}>
            <Descriptions
              layout="vertical"
              title={"Mục đích / Nhu cầu"}
              extra={
                <Tag color={demand?.Status === 1 ? "success" : "default"}>
                  {demand?.StatusName}
                </Tag>
              }
              items={
                demand
                  ? demandItems
                  : [
                      {
                        key: "empty",
                        label: "",
                        children: "Không có dữ liệu",
                      },
                    ]
              }
            />
          </Col>
        </Row>
      </Card>
    </UserWebsiteType>
  );
};

export default UseWebsiteDetail;
