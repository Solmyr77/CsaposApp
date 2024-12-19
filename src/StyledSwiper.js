import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import HighlightedCard from "./HighlightedCard";
import styled from "styled-components";
import records from "./records";
import 'swiper/css';
import 'swiper/css/pagination';

function StyledSwiper() {
    const StyledSwiper = styled(Swiper)`.swiper-pagination-bullet-active{
    background-color: white;
    } `
  return (
    <StyledSwiper autoplay={{delay: 5000}} speed={500} pagination={true} modules={[Pagination, Autoplay]} className="mySwiper mb-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        {
          records.map(record => <SwiperSlide><HighlightedCard record={record}/></SwiperSlide>)
        }
    </StyledSwiper>
  )
}

export default StyledSwiper;
