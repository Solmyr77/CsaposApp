import React, { useContext, useEffect, useRef, useState } from "react";
import { Rating } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Context from "./Context"
import getAccessToken from "./refreshToken";
import axios from "axios";
import { LuCheck } from "react-icons/lu";

function ReservationEnded() {
  const { locations, allBookings, logout } = useContext(Context);
  const [currentLocation, setCurrentLocation] = useState({});
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const modalRef = useRef();

  //function for rating a location
  async function handleRateLocation() {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.post(`https://backend.csaposapp.hu/api/ratings`, {
        locationId: currentLocation.id,
        rating: rating
      }, config);
      const data = response.data;
      if (response.status === 201) {
        console.log(data);
        modalRef.current.inert = true;
        modalRef.current.showModal();
        modalRef.current.inert = false;
        setTimeout(() => {
          modalRef.current.close();
          navigate("/");
        }, 1000);
      } 
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await handleRateLocation();
        }
        else {
          await logout();
          navigate("/login");
        }
      } 
    }
  }

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
        <Rating sx={{"& .MuiSvgIcon-root" : { width: "2.5rem", height: "2.5rem" }}} onChange={(event) => setRating(event.target.value)}/>
        <button className="btn bg-gradient-to-tr from-blue to-sky-400 border-0 text-xl text-white w-56 h-20" onClick={() => handleRateLocation()}>Értékelem</button>
        <button className="btn border-0 text-white w-fit text-md min-h-0 h-12 bg-dark-grey hover:bg-dark-grey" onClick={() => navigate("/")}><span className="bg-gradient-to-tr leading-normal from-blue opacity-85 to-sky-400 bg-clip-text text-transparent">Értékelés kihagyása</span></button>
      </div>
      <dialog className="modal" ref={modalRef}>
        <div className="modal-box flex flex-col items-center bg-grey">
          <p className="bg-gradient-to-t from-blue to-sky-400 text-transparent bg-clip-text text-lg font-bold">Sikeres értékelés!</p>
          <LuCheck className="fill-none stroke-[url(#gradient)] h-12 w-12"/>
        </div>
      </dialog>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default ReservationEnded;
