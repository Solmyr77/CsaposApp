import React from "react";

function Friend({ name, image}) {
  return (
    <div className="flex flex-col items-center min-w-16 mx-2 select-none">
        <img src={image} alt="avatar" className="w-16 object-cover aspect-square rounded-full"/>
        <p className="text-sm font-normal">{name.length <= 10 ? `${name}` : `${name.slice(0, 7)}...`}</p>
    </div>
  )
}

export default Friend;
