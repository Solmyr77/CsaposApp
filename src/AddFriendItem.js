import React, { useState, useEffect, useRef } from "react";
import { UserPlusIcon, CheckIcon } from "@heroicons/react/20/solid";


function AddFriendItem({ name, image }) {
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(Boolean(localStorage.getItem(name)) || false);

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="flex flex-row justify-center items-center select-none">
          <img src={image} alt="kép" className="w-12 aspect-square rounded-full object-cover"/>
          <p className="text-md ml-2 font-normal">{name}</p>
      </div>
      <div className={`flex items-center ${isFriendRequestSent ? "hover:cursor-default" : "hover:cursor-pointer"}`} onClick={() => {
        setIsFriendRequestSent(true);
        localStorage.setItem(name, true);
        }}>
        { localStorage.getItem(name) == "true" ? 
          <CheckIcon className="w-6 text-green-500"/> : 
          <UserPlusIcon className="w-6 text-blue p-0"/>
        }
      </div>
    </div>
  )
}

export default AddFriendItem;
