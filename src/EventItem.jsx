import React from "react";

function EventItem({ event }) {
  return (
    <div className="card bg-base-100 w-96 shadow-lg h-fit">
        <figure className="max-h-52">
            <img
            src={`https://assets.csaposapp.hu/assets/images/${event.imgUrl}`}
            alt="Shoes" 
            className="object-cover"/>
        </figure>
        <div className="card-body">
            <h2 className="card-title">{event.name}</h2>
            <p className="truncate">{event.description}</p>
            <div className="card-actions justify-end">
                <button className="btn btn-lg btn-info">Módosítás</button>
            </div>
        </div>
    </div>
  )
}

export default EventItem;
