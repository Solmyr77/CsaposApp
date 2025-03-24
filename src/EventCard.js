import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Context from "./Context";

function EventCard({ record }) {
  const { setPreviousRoutes } = useContext(Context);
  const location = useLocation();

  return (
    <Link to={`/event/${record.id}`}>
      <div className="relative drop-shadow-sm select-none" onClick={() => setPreviousRoutes((state) => {
        if (!state.includes(location.pathname)) return [...state, location.pathname];
        return state;
      })}>
        <img src={`https://assets.csaposapp.hu/assets/images/${record.imgUrl}`} alt="pub" className="h-full max-h-20 w-full object-cover rounded-md"/>
        <div className={`absolute inset-0 ${true ? 'bg-opacity-70' : 'bg-opacity-85'} bg-black flex flex-col rounded-md`}>
          <p className="absolute top-1/2 -translate-y-1/2 text-lg font-bold pl-5">{record.name}</p>
        </div>
      </div>
    </Link>
  )
}

export default EventCard;
