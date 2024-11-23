import React from "react";
import { Rating } from '@mui/material';
import img1 from "./img/pub.jpg";
import StatusIndicator from "./StatusIndicator";


function HighlightedCard() {
  return (
    <div className="relative mt-1 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <img src={img1} alt="pub" className="max-h-[12.7vh] w-full object-cover rounded-md"/>
      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col rounded-md">
        <div className="w-full h-1/3 px-2 flex items-center justify-between">
          <StatusIndicator status={"open"}/>
          <Rating name="half-rating-read" defaultValue={5} precision={0.5} readOnly/>
        </div>
        <p className="absolute top-1/2 -translate-y-1/2 text-lg font-normal pl-5">Félidő söröző</p>
      </div>
    </div>
  );
}

export default HighlightedCard;
