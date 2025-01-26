import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import img2 from "./img/azahriah.jpg";
import Context from "./Context";

function EventCard() {
  const { setPreviousRoutes } = useContext(Context);
  const location = useLocation();
  return (
    <Link to={"/event"}>
      <div className="relative drop-shadow-sm select-none" onClick={() => setPreviousRoutes((state) => {
        if (!state.includes(location.pathname)) return [...state, location.pathname];
        return state;
      })}>
        <img src={img2} alt="pub" className="h-full max-h-20 w-full object-cover rounded-md"/>
        <div className={`absolute inset-0 ${true ? 'bg-opacity-70' : 'bg-opacity-85'} bg-black flex flex-col rounded-md`}>
        <p className="absolute top-1/2 -translate-y-1/2 text-lg font-normal pl-5">Azahriah a Félidőben!</p>
        </div>
      </div>
    </Link>
  )
}

export default EventCard;
