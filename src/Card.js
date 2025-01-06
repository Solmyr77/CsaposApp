import React from "react";
import img1 from "./img/pub.webp";
import StatusIndicator from "./StatusIndicator";
import { Link } from "react-router-dom";

function Card({ record }) {
  return (
    <div className="basis-[30%]">
      <Link to={`/pub/${record.name}`}>
        <div className="aspect-square relative drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <img src={img1} alt="pub" className="h-full object-cover rounded-md"/>
            <div className={`w-full h-full bg-black absolute inset-0 ${record.status == "open" ? "bg-opacity-70" : "bg-opacity-85"} flex flex-col rounded-md text-wrap`}>
                <div className="h-1/4 flex items-center px-2">
                    <StatusIndicator status={record.status}/>
                </div>
                <p className="font-normal px-1 break-words text-md text-center leading-tight absolute top-1/2 -translate-y-1/2 w-full">{record.name}</p>
            </div>
        </div>
      </Link>
    </div>
  )
}

export default Card;
