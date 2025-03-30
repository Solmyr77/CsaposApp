import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";
import CardContainer from "./CardContainer";
import Context from "./Context";
import { useLocation } from "react-router-dom";
import ReservationsSwiper from "./ReservationsSwiper";

function Main() {
  const { navState, setMenuState, locations, setPreviousRoutes, bookings, bookingsContainingUser, user } = useContext(Context);
  const location = useLocation();

  useEffect(() => {
    setMenuState("Main");
    setPreviousRoutes(Array(location.pathname));
    console.log(bookings, bookingsContainingUser)
  }, [bookings, bookingsContainingUser])

  return (
    <div className="bg-grey text-white font-play font-bold">
      <div className="px-4 overflow-auto pb-[12vh]">
        <Navbar/>
        {
          bookings.concat(bookingsContainingUser?.filter(booking => (booking.userAccepted === true || booking.tableGuests.find(guest => guest.id === user.id)?.status === "accepted"))).length > 0 &&
          <div>
            <TitleDivider title={"Foglalásaim"}/>
            <ReservationsSwiper/>
          </div>
        }
        <TitleDivider title={"Kiemelt"}/>
        <StyledSwiper/>
        <TitleDivider title={navState}/>
        <CardContainer records={locations} cardsToShow={navState}/>
      </div>
    </div>
  );
}

export default Main;