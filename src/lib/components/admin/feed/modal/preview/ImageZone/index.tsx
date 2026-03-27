import { Col, Empty, Image, Row, Segmented } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import ReactPlayer from "react-player";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { ImageIcon, MapPinIcon, VideoIcon } from "lucide-react";
import { FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { useAdminContext } from "@/lib/stored";

const BaseMap = dynamic(() => import("@/lib/components/shared/map"), {
  ssr: false,
});
type Props = {
  images: string[];
  video?: string;
  position?: { lat: number; lng: number };
};

const ImageZone = ({ images, video, position }: Props) => {
  const { smallScreen } = useAdminContext();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass>();
  const [value, setValue] = useState<"image" | "video" | "map">("image");
  const options = [
    {
      label: (
        <div style={{ padding: 4 }}>
          <ImageIcon className="size-4" />
          <div>Hình ảnh</div>
        </div>
      ),
      value: "image",
    },
    {
      label: (
        <div style={{ padding: 4 }}>
          <VideoIcon className="size-4" />
          <div>Video</div>
        </div>
      ),
      value: "video",
    },
    {
      label: (
        <div style={{ padding: 4 }}>
          <MapPinIcon className="size-4" />
          <div>Bản đồ</div>
        </div>
      ),
      value: "map",
    },
  ];

  if (value === "map")
    return (
      <Row gutter={[12, 12]} align={"middle"} justify={"center"}>
        <Col span={24}>
          <Swiper
            spaceBetween={10}
            navigation
            pagination={{ type: "fraction" }}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs, Pagination]}
            className="mySwiper2"
          >
            <SwiperSlide>
              {position ? (
                <BaseMap position={position} />
              ) : (
                <Empty description="Chưa có thông tin 'Vị trí'" />
              )}
            </SwiperSlide>
          </Swiper>
        </Col>
        <Col xs={0} md={12} lg={12}>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={3}
            freeMode
            watchSlidesProgress
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper"
          >
            {/* <SwiperSlide>
              <img src="/home.jpg" alt="default_video" />
            </SwiperSlide> */}
          </Swiper>
        </Col>
        <Col md={12} lg={12} xs={24}>
          <Segmented
            block
            value={value}
            options={options}
            onChange={(val) => setValue(val.toString() as any)}
          />
        </Col>
      </Row>
    );

  if (value === "video")
    return (
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Swiper
            spaceBetween={10}
            navigation
            pagination={{ type: "fraction" }}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs, Pagination]}
            className="mySwiper2"
          >
            <SwiperSlide>
              {video ? (
                <ReactPlayer url={video} controls width="100%" height="100%" />
              ) : (
                <Empty description="Chưa có thông tin video" />
              )}
            </SwiperSlide>
          </Swiper>
        </Col>
        <Col xs={0} md={12} lg={12}>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={3}
            freeMode
            watchSlidesProgress
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper"
          >
            {/* <SwiperSlide>
              <img src="/home.jpg" alt="default_video" />
            </SwiperSlide> */}
          </Swiper>
        </Col>
        <Col md={12} lg={12} xs={24}>
          <Segmented
            block
            value={value}
            options={options}
            onChange={(val) => setValue(val.toString() as any)}
          />
        </Col>
      </Row>
    );

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Swiper
          spaceBetween={10}
          navigation
          pagination={{ type: "fraction" }}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs, Pagination]}
        >
          {images.length > 0 ? (
            images.map((e) => (
              <SwiperSlide key={e}>
                <Image
                  src={e}
                  alt={e}
                  height={smallScreen ? 250 : 400}
                  preview={false}
                />
                {/* <img src={e} /> */}
              </SwiperSlide>
            ))
          ) : (
            <Empty description="Chưa có thông tin hình ảnh" />
          )}
        </Swiper>
      </Col>
      <Col xs={0} md={12} lg={12}>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={3}
          freeMode
          watchSlidesProgress
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper"
        >
          {images.map((e) => (
            <SwiperSlide key={e}>
              <Image
                src={e}
                alt={e}
                height={70}
                width={100}
                preview={false}
                style={{ objectFit: "contain" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Col>
      <Col md={12} lg={12} xs={24}>
        <Segmented
          block
          value={value}
          options={options}
          onChange={(val) => {
            setValue(val.toString() as any);
          }}
        />
      </Col>
    </Row>
  );
};

export default ImageZone;
