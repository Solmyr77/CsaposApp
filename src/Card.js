import React from "react";
import img1 from "./img/pub.jpg";
import StatusIndicator from "./StatusIndicator";

function Card({status, title}) {

  return (
    <div className="basis-[30%] aspect-square relative drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        <img src={img1} alt="pub" className="h-full object-cover rounded-md"/>
        <div className={`w-full h-full bg-black absolute inset-0 ${status == "open" ? "bg-opacity-65" : "bg-opacity-85"} flex flex-col rounded-md`}>
            <div className="h-1/4 flex items-center px-2">
                <StatusIndicator status={status}/>
            </div>
            <p className="font-normal text-wrap text-md text-center leading-tight absolute top-1/2 -translate-y-1/2 w-full">{title}</p>
        </div>
    </div>
  )
}

export default Card;
