import React, { useContext } from "react";
import { Link } from "react-router"
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Context from "./Context";

function Footer() {
  const [navState, setNavState, menuState, setMenuState] = useContext(Context);

  return (
    <div className="w-full h-[10vh] fixed bottom-0 flex justify-evenly items-center font-normal bg-dark-grey pb-2 font-play">
        <Link to="/" className="basis-1/3">
          <div className={`flex flex-col justify-center items-center ${menuState === "Main" ? "text-blue" : "text-white"}`}>
              <GlobeAltIcon className=" h-6"/>
              Felfedezés
          </div>
        </Link>
        <Link to="/search" className="basis-1/3">
          <div className={`flex flex-col justify-center items-center basis-1/3 ${menuState === "Search" ? "text-blue" : "text-white"}`}>
              <MagnifyingGlassIcon className="h-6"/>
              Keresés
          </div>
        </Link>
        <Link to="/profile" className="basis-1/3">
          <div className={`flex flex-col justify-center items-center basis-1/3 ${menuState === "Profile" ? "text-blue" : "text-white"}`}>
              <UserCircleIcon className="h-6"/>
              Profil
          </div>
        </Link>
    </div>
  )
}

export default Footer;
