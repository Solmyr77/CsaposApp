import React, { useContext } from 'react';
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Context from './Context';
import { Link } from 'react-router-dom';

function Header({ notification }) {
  const { user } = useContext(Context);

  return (
    <div className="w-full flex flex-row justify-between items-center pt-8 font-play font-bold px-4">
      <div className="flex flex-row items-center">
          <Link to={"/profile"}><img src={user.image} alt="avatar" className="w-12 object-cover aspect-square rounded-full"/></Link>
          <p className="ml-3 text-lg text-white">Szia {user.name}!</p>
      </div>
      <div className="relative">
      <Link to={"/notifications"}>
        <EnvelopeIcon className="text-white h-6"></EnvelopeIcon>
      </Link>
      {
        notification == true && <div className="absolute bg-red-500 top-0 -right-[.125rem] w-2 h-2 rounded-full"></div>
      }
      </div>
    </div>
  )
}

export default Header;