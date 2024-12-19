import React from "react";
import {Link} from "react-router"
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";

function Footer({mainActive, searchActive, profileActive}) {
  return (
    <div className="w-full h-[10vh] fixed bottom-0 flex justify-evenly items-center font-normal bg-dark-grey pb-2">
        <Link to="/" className="basis-1/3">
          <div className={`flex flex-col justify-center items-center ${mainActive ? "text-blue" : "text-white"}`}>
              <GlobeAltIcon className=" h-6"/>
              Felfedezés
          </div>
        </Link>
        <Link to="/search" className="basis-1/3">
          <div className={`flex flex-col justify-center items-center basis-1/3 ${searchActive ? "text-blue" : "text-white"}`}>
              <MagnifyingGlassIcon className="h-6"/>
              Keresés
          </div>
        </Link>
        <div className={`flex flex-col justify-center items-center basis-1/3 ${profileActive ? "text-blue" : "text-white"}`}>
            <UserCircleIcon className="text-white h-6"/>
            Profil
        </div>
    </div>
  )
}

export default Footer;
