import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from "swiper/modules";

import img1 from "./img/beeremoji.webp"

function BadgeSwiper() {
  return (
   <Swiper effect="coverflow" centeredSlides slidesPerView={"auto"} 
   coverflowEffect={{
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
   }}
   modules={[EffectCoverflow]}
   className="mySwiper">
    <SwiperSlide className="w-fit">
        <img src={img1} alt="" />
    </SwiperSlide>
   </Swiper>
  )
}

export default BadgeSwiper;
