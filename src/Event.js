import React, { useContext, useState, useEffect, useRef } from "react";
import BackButton from "./BackButton";
import { Link, useLocation } from "react-router-dom";
import img1 from "./img/azahriah.jpg";
import img2 from "./img/pub.jpg";
import TitleDivider from "./TitleDivider";
import Context from "./Context";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { LuCheck, LuX } from "react-icons/lu";

function Event() {
  const { previousRoutes, setPreviousRoutes } = useContext(Context);
  const [isAttending, setIsAttending] = useState(false);
  const [isDescriptionWrapped, setIsDescriptionWrapped] = useState(true);  
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef(null);
  const location = useLocation();
  
  const checkIfClamped = () => {
    const element = textRef.current;
    if (element) {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const linesVisible = Math.floor(element.clientHeight / lineHeight);
      const totalLines = Math.ceil(element.scrollHeight / lineHeight);
      setIsClamped(totalLines > linesVisible);
    }
  };

  useEffect(() => {
    checkIfClamped();
    window.addEventListener('resize', checkIfClamped);
    return () => window.removeEventListener('resize', checkIfClamped);
  }, []);

  return (
    <div className="min-h-screen bg-grey pb-8 text-white">
      <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
        <BackButton isInset/>
      </Link>
      <div className="w-full h-fit relative">
        <img src={img1} alt="kep" className="w-full h-40 object-cover"/>
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
          <button className={`btn group transition-all duration-150 min-h-0 h-8 border-green-500 border-2 text-green-500 text-sm ${isAttending ? "bg-green-500 text-white hover:bg-green-500 hover:border-green-500" : "bg-transparent hover:bg-transparent hover:border-green-500"} overflow-hidden`} onClick={() => setIsAttending(state => !state)}>
            Igen
            <LuCheck className={`${isAttending ? "block" : "hidden"}`}/>
          </button>
        </div>
      </div>
      <TitleDivider title={"Leírás"}/>
      <p ref={textRef} className={`max-w-full ${isDescriptionWrapped ? "line-clamp-[8]" : "line-clamp-none"}`}>
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet...
        Lorem ipsum dolor sit amet
      </p>
      <div className="flex w-full justify-center">
        <ChevronRightIcon className={`w-10 ${isDescriptionWrapped ? "rotate-90" : "-rotate-90"} ${isClamped ? "flex" : "hidden"} `} onClick={() => setIsDescriptionWrapped((state) => !state)}/>
      </div>
      <TitleDivider title={"Helyszín"}/>
      <Link to={`/pub/${"Félidő Söröző"}`}>
        <div className="relative shadow-dark-grey shadow-md rounded-md select-none" onClick={() => setPreviousRoutes((state) => {
          if (!state.includes(location.pathname)) return [...state, location.pathname];
          return state;
        })}>
          <img src={img2} alt="pub" className="h-full max-h-20 w-full object-cover rounded-md"/>
          <div className={`absolute inset-0 ${true ? 'bg-opacity-70' : 'bg-opacity-85'} bg-black flex flex-col rounded-md`}>
            <p className="absolute top-1/2 -translate-y-1/2 text-lg font-bold pl-5">Félidő Söröző</p>
          </div>
        </div>
      </Link>      
      </div>
    </div>
  )
}

export default Event;
