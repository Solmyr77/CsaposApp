import React from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";

function Footer() {
  return (
    <div className="w-full h-[10vh] absolute bottom-0 flex justify-evenly items-center font-normal bg-[rgba(0,0,0,0.2)] pb-2">
        <div className="flex flex-col justify-center items-center text-blue basis-1/3">
            <GlobeAltIcon className=" h-6"/>
            Felfedezés
        </div>
        <div className="flex flex-col justify-center items-center basis-1/3">
            <MagnifyingGlassIcon className="text-white h-6"/>
            Keresés
        </div>
        <div className="flex flex-col justify-center items-center basis-1/3">
            <UserCircleIcon className="text-white h-6"/>
            Profil
        </div>
    </div>
  )
}

export default Footer;
