import React from 'react';
import userAvatar from "./img/avatar.png";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

function Header({notification}) {
  return (
    <div className="w-full flex flex-row justify-between items-center pt-16 font-play font-bold px-4">
      <div className="flex flex-row items-center">
          <img src={userAvatar} alt="avatar" className="w-12 h-12 rounded-full"/>
          <p className="ml-3 text-lg text-white">Szia Lajos!</p>
      </div>
      <div className="relative">
      <EnvelopeIcon className="text-white h-6"></EnvelopeIcon>
      {
        notification == true && <div className="absolute bg-red-500 top-0 -right-[.125rem] w-2 h-2 rounded-full"></div>
      }
      </div>
    </div>
  )
}

export default Header;