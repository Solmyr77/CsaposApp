import React, { useContext } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import HighlightedCard from "./HighlightedCard";
import styled from "styled-components";
import 'swiper/css';
import 'swiper/css/pagination';
import Context from "./Context";

const StyledSwipers = styled(Swiper)`.swiper-pagination-bullet-active{
  background-color: white;
  } `;

function StyledSwiper() {
  const { locations } = useContext(Context);
  const highlightedLocations = locations.sort((a, b) => b.isOpen - a.isOpen === 0 ? a.name.localeCompare(b.name) : b.isOpen - a.isOpen).slice(0, 3);

  return (
    <StyledSwipers autoplay={{delay: 5000}} speed={500} pagination={{dynamicBullets: true}} modules={[Pagination, Autoplay]} className="mySwiper mb-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      {
        highlightedLocations.map(record => <SwiperSlide><HighlightedCard key={record.id} record={record}/></SwiperSlide>)
      }
    </StyledSwipers> 
  )
}

export default StyledSwiper;
