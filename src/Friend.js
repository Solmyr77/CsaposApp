import React from "react";

function Friend( { image, name } ) {
  return (
    <div className="flex flex-col items-center min-w-16">
        <img src={image} alt="avatar" className="w-16 h-16 rounded-full"/>
        <p className="text-sm font-normal">{name.length <= 10 ? `${name}` : `${name.slice(0, 7)}...`}</p>
    </div>
  )
}

export default Friend;
