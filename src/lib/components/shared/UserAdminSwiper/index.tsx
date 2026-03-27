import { MessageOutlined, PhoneOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { IStaff } from "@/services/api/website/publicInfo/IStaff";
import publicInfoApi from "@/services/api/website/publicInfo/publicInfoApi";
import { baseFilter } from "../../../core/configs/appConst";

const { Meta } = Card;

const UserAdminSwiper = () => {
  const [data, setData] = useState<IStaff[]>();

  useEffect(() => {
    const fetch = async () => {
      const result = await publicInfoApi.getStaff({
        ...baseFilter,
        pageSize: 100,
      });
      setData(result.data);
    };
    fetch();
  }, []);

  return (
    data && (
      <Swiper
        navigation
        spaceBetween={30}
        breakpoints={{
          768: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 2,
          },
          1440: {
            slidesPerView: 4,
          },
          1500: {
            slidesPerView: 5,
          },
          2000: {
            slidesPerView: 7,
          },
        }}
        // autoplay={{
        //   delay: 1500,
        //   disableOnInteraction: false,
        // }}
        modules={[Navigation, Autoplay]}
        // className="mySwiper2"
      >
        {data.map((e) => (
          <SwiperSlide style={{ backgroundColor: "transparent" }}>
            <Row justify="center">
              <Col span={24}>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <Avatar
                    src={e.Avatar}
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  />
                </div>
              </Col>
              <Card
                style={{
                  width: 250,
                  backgroundColor: "#F4F4F5",
                  marginTop: -30,
                }}
                actions={[
                  <Typography.Link href={`tel:${e.CompanyPhone}`}>
                    <Button icon={<PhoneOutlined />}>Liên hệ</Button>
                  </Typography.Link>,
                  <Button icon={<MessageOutlined />}>Nhắn tin</Button>,
                ]}
              >
                <Meta
                  style={{ paddingTop: 20 }}
                  title={e.Name}
                  description={e.RoleName}
                />
              </Card>
            </Row>
          </SwiperSlide>
        ))}
      </Swiper>
    )
  );
};

export default UserAdminSwiper;
