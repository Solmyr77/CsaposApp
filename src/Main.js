import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";
import CardContainer from "./CardContainer";
import Context from "./Context";
import { useLocation } from "react-router-dom";
import ReservationsSwiper from "./ReservationsSwiper";

function Main() {
  const { navState, setMenuState, locations, setPreviousRoutes, bookings, tables } = useContext(Context);
  const location = useLocation();
  const [eventLocation, setEventLocation] = useState({});

  useEffect(() => {
    setMenuState("Main");
    setPreviousRoutes(Array(location.pathname));
    if (bookings.length > 0 && tables.length > 0) {
      bookings.forEach(booking => tables.find(table => table.id === booking.tableId ? locations.forEach(location => location.id === table.locationId ? setEventLocation(location) : null) : null));
    }
  }, [])

  return (
    <div className="bg-grey text-white font-play font-bold">
      <div className="px-4 overflow-auto pb-[12vh]">
        <Navbar/>
        {
          bookings.length > 0 ? 
          <div>
            <TitleDivider title={"Foglalásaim"}/>
            <ReservationsSwiper/>
          </div> : 
          null
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