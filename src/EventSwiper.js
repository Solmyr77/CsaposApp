import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import EventCard from "./EventCard";
import styled from "styled-components";

const StyledSwipers = styled(Swiper)`.swiper-pagination-bullet-active{
background-color: white;
}`;

function EventSwiper() {
  return (
    <StyledSwipers pagination={{dynamicBullets: true}} modules={[Pagination, Autoplay]} spaceBetween={10} className="mySwiper mb-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] w-full">
        <SwiperSlide><EventCard/></SwiperSlide>
        <SwiperSlide><EventCard/></SwiperSlide>
        <SwiperSlide><EventCard/></SwiperSlide>
        <SwiperSlide><EventCard/></SwiperSlide>
        <SwiperSlide><EventCard/></SwiperSlide>
        <SwiperSlide><EventCard/></SwiperSlide>
        <SwiperSlide><EventCard/></SwiperSlide>
        <SwiperSlide><EventCard/></SwiperSlide>
    </StyledSwipers>
  );
}

export default EventSwiper;
