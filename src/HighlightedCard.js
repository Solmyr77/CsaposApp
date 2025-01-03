import React from "react";
import { Rating } from '@mui/material';
import img1 from "./img/pub.jpg";
import StatusIndicator from "./StatusIndicator";
import { Link } from "react-router-dom";

function HighlightedCard({ record }) {
  return (
    <Link to={"/pub"} state={{record : record}}>
      <div className="relative drop-shadow-sm">
        <img src={img1} alt="pub" className="h-full max-h-[12.7vh] w-full object-cover rounded-md"/>
        <div className={`absolute inset-0 ${record.status == 'open' ? 'bg-opacity-70' : 'bg-opacity-85'} bg-black flex flex-col rounded-md`}>
          <div className="w-full h-1/3 px-2 flex items-center justify-between">
            <StatusIndicator status={record.status}/>
            <Rating name="half-rating-read" defaultValue={5} precision={0.5} readOnly/>
          </div>
          <p className="absolute top-1/2 -translate-y-1/2 text-lg font-normal pl-5">{record.name}</p>
        </div>
      </div>
    </Link>
  );
}

export default HighlightedCard;
