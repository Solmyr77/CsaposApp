import React, { forwardRef, useContext } from "react";
import StateContext from "./StateProvider";
import { LuUsers } from "react-icons/lu";

const EventItem = forwardRef(({ event }, ref) => {
  const { setSelectedEvent } = useContext(StateContext);

  return (
    <div className="card bg-base-100 w-96 shadow-lg h-fit">
        <figure className="max-h-52 relative">
            <img
            src={`https://assets.csaposapp.hu/assets/images/${event.imgUrl}`}
            alt="kép" 
            className="object-cover"/>
            <span className="badge badge-lg badge-neutral absolute top-2 right-2">
                <LuUsers />
                {event.attendees ?? 0}
            </span>
        </figure>
        <div className="card-body">
            <h2 className="card-title">{event.name}</h2>
            <p className="truncate">{event.description}</p>
            <div className="card-actions justify-end">
                <button className="btn btn-lg btn-info" onClick={() => {
                    setSelectedEvent(event);
                    ref.current.inert = true;
                    ref.current.showModal();
                    ref.current.inert = false;
                }}>Módosítás</button>
            </div>
        </div>
    </div>
  )
})

export default EventItem;
