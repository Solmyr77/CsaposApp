import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import HighlightedCard from "./HighlightedCard";
import styled from "styled-components";
import 'swiper/css';
import 'swiper/css/pagination';

function StyledSwiper() {
    const StyledSwiper = styled(Swiper)`.swiper-pagination-bullet-active{
    background-color: white;
    } `
  return (
    <StyledSwiper autoplay={{delay: 5000}} speed={1000} pagination={true} modules={[Pagination, Autoplay]} className="mySwiper mb-3">
        <SwiperSlide><HighlightedCard/></SwiperSlide>
        <SwiperSlide><HighlightedCard/></SwiperSlide>
        <SwiperSlide><HighlightedCard/></SwiperSlide>
    </StyledSwiper>
  )
}

export default StyledSwiper;
