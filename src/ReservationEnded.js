import React, { useContext, useEffect, useState } from "react";
import { Rating } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Context from "./Context"

function ReservationEnded() {
  const { locations, allBookings } = useContext(Context);
  const [currentLocation, setCurrentLocation] = useState({});
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (locations.length > 0 && allBookings.length > 0) {
      const foundBooking = allBookings.find(booking => booking.id === id);
      if (foundBooking) {
        const foundLocation = locations.find(location => location.id === foundBooking.locationId);
        foundLocation && setCurrentLocation(foundLocation);
        console.log(foundLocation)
      }
      else {
        navigate("/");
      }
    }
  }, [locations, allBookings])

  return (
    <div className="w-full min-h-screen bg-grey text-white p-4 pt-16 flex flex-col gap-6 items-center select-none">
      <div className="flex flex-col items-center">
        <span className="text-xxl font-bold text-center leading-tight bg-gradient-to-tr from-blue to-sky-400 bg-clip-text text-transparent">Foglalás sikeresen lezárva!</span>
        <img src={`https://assets.csaposapp.hu/assets/images/${currentLocation?.imgUrl}`} alt="kép" className="rounded-md mt-8 w-1/2 shadow-dark-grey shadow-md"/>
        <span className="font-bold text-wrap text-center text-lg mt-2 max-w-[66%]">{currentLocation?.name}</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Rating sx={{"& .MuiSvgIcon-root" : { width: "3rem", height: "3rem" }}} onChange={(event) => setRating(event.target.value)}/>
        <button className="btn bg-gradient-to-tr from-blue to-sky-400 border-0 text-xl text-white w-56 h-20" onClick={() => navigate("/")}>Értékelem</button>
        <button className="btn border-0 text-white w-fit text-md min-h-0 h-12 bg-dark-grey" onClick={() => navigate("/")}><span className="bg-gradient-to-tr leading-normal from-blue opacity-85 to-sky-400 bg-clip-text text-transparent">Értékelés kihagyása</span></button>
      </div>
    </div>
  )
}

export default ReservationEnded;
