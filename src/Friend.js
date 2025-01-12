import React, { useState } from "react";
import { UserPlusIcon, CheckIcon } from "@heroicons/react/20/solid";

function Friend( { isVertical, name, image} ) {
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);

  return (
    isVertical ?
    <div className="flex flex-col items-center min-w-16 mx-2 select-none">
        <img src={image} alt="avatar" className="w-16 object-cover aspect-square rounded-full"/>
        <p className="text-sm font-normal">{name.length <= 10 ? `${name}` : `${name.slice(0, 7)}...`}</p>
    </div> : 
    <div className="w-full flex flex-row justify-between">
      <div className="flex flex-row justify-center items-center select-none">
          <img src={image} alt="kép" className="w-12 aspect-square rounded-full object-cover"/>
          <p className="text-md ml-2 font-normal">{name}</p>
      </div>
      <div className={`flex items-center ${isFriendRequestSent ? "hover:cursor-default" : "hover:cursor-pointer"}`} onClick={() => setIsFriendRequestSent(true)}>
        { isFriendRequestSent ? 
          <CheckIcon className="w-6 text-green-500"/> : 
          <UserPlusIcon className="w-6 text-blue p-0"/>
        }
      </div>
    </div>
  )
}

export default Friend;
