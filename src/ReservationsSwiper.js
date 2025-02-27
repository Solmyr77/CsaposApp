import React, { useContext, useEffect } from "react";
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
    const { bookings, bookingsContainingUser } = useContext(Context);

    return (
        <StyledSwipers speed={500} spaceBetween={10} pagination={{dynamicBullets: true}} modules={[Pagination]} className="mySwiper mb-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] max-h-32">
            {
                (bookings.length > 0 || bookingsContainingUser.length > 0) &&
                bookings.concat(bookingsContainingUser).sort((a,b) => new Date(a.bookedFrom) - new Date(b.bookedFrom)).map(booking => <SwiperSlide key={booking.id}><ReservationItem booking={booking} isGuest={!bookings.some(record => record.id === booking.id)}/></SwiperSlide>)
            }
        </StyledSwipers>
    )
}

export default ReservationsSwiper;
