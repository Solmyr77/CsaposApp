import React from 'react';
import userAvatar from "./img/avatar.png";
import {EnvelopeIcon} from "@heroicons/react/24/outline";

function Header() {
  return (
    <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
            <img src={userAvatar} alt="avatar" className="w-12 h-12 rounded-full"/>
            <p className="ml-3 text-lg text-white">Szia Lajos!</p>
        </div>
        <EnvelopeIcon className="text-white h-6"></EnvelopeIcon>
    </div>
  )
}

export default Header;