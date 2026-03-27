// Import Swiper styles
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

type Props = {
  images: string[];
};

const MySwiper = ({ images }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  return (
    <>
      <Swiper
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {images.map((e) => (
          <SwiperSlide>
            <img src={e} alt={e} key={e} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={(val) => setThumbsSwiper(val)}
        spaceBetween={10}
        slidesPerView={2}
        freeMode
        watchSlidesProgress
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {images.map((e) => (
          <SwiperSlide>
            <img src={e} alt={e} key={e} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default MySwiper;
