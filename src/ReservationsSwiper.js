import React, { useContext } from "react";
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import styled from "styled-components";
import Context from "./Context";
import ReservationItem from "./ReservationItem";

const StyledSwipers = styled(Swiper)`.swiper-pagination-bullet-active{
    background-color: white;
    }
    .swiper{
        border-radius: .375rem; 
    }`;

function ReservationsSwiper() {
    const { bookings } = useContext(Context);
    
  return (
    <StyledSwipers speed={500} spaceBetween={10} pagination={{dynamicBullets: true}} modules={[Pagination]} className="mySwiper mb-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] max-h-28">
        {
            bookings.length > 0 &&
            bookings.sort((a,b) => new Date(b.bookedFrom) - new Date(a.bookedFrom)).map(booking => <SwiperSlide key={booking.id}><ReservationItem booking={booking}/></SwiperSlide>)
        }
    </StyledSwipers>
  )
}

export default ReservationsSwiper;
