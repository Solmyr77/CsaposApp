import React, { useState } from "react";
import BackButton from "./BackButton";
import { Link } from "react-router-dom";
import img1 from "./img/azahriah.jpg";
import img2 from "./img/pub.jpg";
import TitleDivider from "./TitleDivider";

function Event() {
  const [isAttending, setIsAttending] = useState(null);

  return (
    <div className="min-h-screen bg-grey px-4 pt-8 pb-8 text-white">
      <Link to={"/notifications"} className="flex w-fit">
        <BackButton/>
      </Link>
      <div className="w-full h-fit relative mt-4">
        <img src={img1} alt="kep" className="rounded-md w-full h-40 object-cover"/>
        <div className="w-full h-full bg-gradient-to-t from-dark-grey via-15% via-dark-grey bg-opacity-65 absolute inset-0 flex flex-col rounded-t-md text-wrap">
          <p className="font-bold text-xl px-1 break-words text-center leading-tight absolute bottom-0 w-full">Azahriah a Félidőben!</p>
        </div>
      </div>
      <div className="rounded-b-md mb-4 bg-gradient-to-b from-dark-grey pt-1 p-4">
        <p className="text-center text-[14px] leading-none">2025. 02. 19. 19:30 - 21:00</p>
        <p className="text-center text-[14px] leading-snug mb-4"><span className="font-bold">Félidő Söröző</span> eseménye</p>
        <div className="flex flex-row justify-between items-center w-full gap-x-2">
          <p className="text-md font-bold pb-0.5">Ott leszel?</p>
          <div className="flex flex-row gap-2">
            <div className={`${isAttending === true ? "bg-green-500" : "bg-transparent text-green-500"} border-green-500 border-[1px] basis-1/2 flex justify-center items-center  rounded-md px-3 text-md hover:cursor-pointer select-none`} onClick={() => setIsAttending(true)}>
              Igen
            </div>
            <div className={`${isAttending === false ? "bg-red-500" : "bg-transparent text-red-500"} border-red-500 border-[1px] basis-1/2 flex justify-center items-center  rounded-md px-3 text-md hover:cursor-pointer select-none`} onClick={() => setIsAttending(false)}>
              Nem
            </div>
          </div>
        </div>
      </div>
      <TitleDivider title={"Leírás"}/>
      <p className="max-w-full text-wrap mb-4">
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
      </p>
      <TitleDivider title={"Helyszín"}/>
      <Link to={`/pub/${"Félidő Söröző"}`}>
        <div className="relative drop-shadow-sm select-none">
          <img src={img2} alt="pub" className="h-full max-h-20 w-full object-cover rounded-md"/>
          <div className={`absolute inset-0 ${true ? 'bg-opacity-70' : 'bg-opacity-85'} bg-black flex flex-col rounded-md`}>
            <p className="absolute top-1/2 -translate-y-1/2 text-lg font-normal pl-5">Félidő Söröző</p>
          </div>
        </div>
      </Link>      
    </div>
  )
}

export default Event;
