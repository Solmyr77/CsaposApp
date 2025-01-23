import React from "react";

function TitleDivider({ title, isNormal }) {
  return (
    <div className="w-full flex flex-col mb-2">
      <p className={`${isNormal ? "font-normal" : "font-bold"} text-white text-lg mb-1`}>{title}</p>
      <hr className="h-[3px] bg-black opacity-25 rounded-full border-0"/>
    </div>
  )
}

export default TitleDivider;
