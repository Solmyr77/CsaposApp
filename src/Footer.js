import React, { useContext } from "react";
import { Link } from "react-router-dom"
import Context from "./Context";
import { LuCircleUser, LuEarth, LuSearch } from "react-icons/lu"

function Footer() {
  const { menuState } = useContext(Context);

  return (
    <div className="w-full h-[10vh] fixed bottom-0 flex justify-evenly items-center font-bold bg-dark-grey py-2 font-play select-none">
        <Link to="/" className="basis-1/3">
          <div className={`flex flex-col justify-center items-center ${menuState === "Main" ? "" : "text-white"}`}>
            <LuEarth className={`h-6 w-6 ${menuState === "Main" ? "fill-none stroke-[url(#gradient)]" : ""}`}/>
            <p className={`${menuState === "Main" ? "bg-gradient-to-t from-blue to-sky-400 text-transparent inline-block bg-clip-text" : ""}`}>Felfedezés</p>
          </div>
        </Link>
        <Link to="/search" className="basis-1/3">
          <div className={`flex flex-col justify-center items-center basis-1/3 ${menuState === "Search" ? "" : "text-white"}`}>
            <LuSearch className={`h-6 w-6 ${menuState === "Search" ? "fill-none stroke-[url(#gradient)]" : ""}`}/>
            <p className={`${menuState === "Search" ? "bg-gradient-to-t from-blue to-sky-400 text-transparent inline-block bg-clip-text" : ""}`}>Keresés</p>
          </div>
        </Link>
        <Link to="/profile" className="basis-1/3">
          <div className={`flex flex-col justify-center items-center basis-1/3 ${menuState === "Profile" ? "" : "text-white"}`}>
            <LuCircleUser className={`h-6 w-6 ${menuState === "Profile" ? "fill-none stroke-[url(#gradient)]" : ""}`}/>
            <p className={`${menuState === "Profile" ? "bg-gradient-to-t from-blue to-sky-400 text-transparent inline-block bg-clip-text" : ""}`}>Profil</p>
          </div>
        </Link>
        <svg width="0" height="0">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
    </div>
  )
}

export default Footer;
