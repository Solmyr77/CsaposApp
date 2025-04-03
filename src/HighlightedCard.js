import React from "react";
import { Rating } from '@mui/material';
import img1 from "./img/pub.webp";
import StatusIndicator from "./StatusIndicator";
import { Link } from "react-router-dom";

function HighlightedCard({ record }) {
  return (
    <Link to={`/pub/${record.name}`}>
      <div className="relative select-none">
        <img src={img1} alt="pub" className="h-full max-h-28 w-full object-cover rounded-md"/>
        <div className={`absolute inset-0 ${record.isOpen ? 'bg-opacity-70' : 'bg-opacity-85'} bg-black flex flex-col rounded-md`}>
          <div className="w-full h-1/3 px-2 flex items-center justify-between">
            {
              record.isOpen ?
              <span className="badge bg-gradient-to-tr from-blue to-sky-400 text-white border-0 text-xs">Nyitva</span>:
              <span className="badge border-2 bg-transparent text-red-500 border-red-500 text-xs">Zárva</span>
            }
            {
              record.rating > 0 &&
              <Rating name="half-rating-read" value={record.rating} precision={0.5} readOnly/>
            }
          </div>
          <p className="absolute top-1/2 -translate-y-1/2 text-lg pl-5">{record.name}</p>
        </div>
      </div>
    </Link>
  );
}

export default HighlightedCard;
