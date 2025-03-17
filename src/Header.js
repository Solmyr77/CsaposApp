import React, { useContext } from 'react';
import Context from './Context';
import { Link } from 'react-router-dom';
import { LuMail } from "react-icons/lu"

function Header() {
  const { user, newNotification } = useContext(Context);

  return (
    <div className="w-full flex flex-row justify-between items-center pt-8 font-play font-bold px-4">
      <div className="flex flex-row items-center">
          <Link to={"/profile"}>
            <img src={user.imageUrl} alt="avatar" className="w-12 object-cover aspect-square rounded-full"/>
          </Link>
          <p className="ml-3 text-lg text-white">Szia {user.displayName}!</p>
      </div>
      <Link to={"/notifications"}>
        <div className="p-2 bg-dark-grey rounded-md">
          <div className="relative">
            <LuMail className="text-white h-6 w-6 bg-dark-grey"/>
            {
              newNotification === true && <div className="absolute bg-red-500 top-0 -right-[.125rem] w-2 h-2 rounded-full"></div>
            }
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Header;