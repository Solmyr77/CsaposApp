import React from "react";
import img1 from "./img/pub.jpg"

function HighlightedCard() {
  return (
    <div className="relative mt-1">
      <img src={img1} alt="pub" className="max-h-[12.7vh] w-full object-cover rounded-md"/>
      <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center rounded-md">
        <p className="text-lg">Félidő söröző</p>
      </div>
    </div>
  );
}

export default HighlightedCard;
