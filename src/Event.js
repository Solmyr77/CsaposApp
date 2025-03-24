import React, { useContext, useState, useEffect, useRef } from "react";
import BackButton from "./BackButton";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import TitleDivider from "./TitleDivider";
import Context from "./Context";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { LuCheck } from "react-icons/lu";
import axios from "axios";
import getAccessToken from "./refreshToken";

function Event() {
  const { previousRoutes, setPreviousRoutes, events, locations, logout } = useContext(Context);
  const [isAttending, setIsAttending] = useState(false);
  const [isDescriptionWrapped, setIsDescriptionWrapped] = useState(true);  
  const [isClamped, setIsClamped] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});
  const [currentLocation, setCurrentLocation] = useState({});
  const [formattedTime, setFormattedTime] = useState("");
  const textRef = useRef(null);
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  async function handleAcceptEvent() {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.put(`https://backend.csaposapp.hu/api/event-attendances/accept/${id}`, {}, config);
      const data = response.data;
      if (response.status === 201) {
        console.log(data);
        setIsAttending(true);
      } 
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await handleAcceptEvent();
        }
        else {
          await logout();
          navigate("/login");
        }
      } 
    }
  }

  async function handleRejectEvent() {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.put(`https://backend.csaposapp.hu/api/event-attendances/reject/${id}`, {}, config);
      const data = response.data;
      if (response.status === 201) {
        console.log(data);
        setIsAttending(false);
      } 
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await handleRejectEvent();
        }
        else {
          await logout();
          navigate("/login");
        }
      } 
    }
  }
  
  const checkIfClamped = () => {
    const element = textRef.current;
    if (element) {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const linesVisible = Math.floor(element.clientHeight / lineHeight);
      const totalLines = Math.ceil(element.scrollHeight / lineHeight);
      setIsClamped(totalLines > linesVisible);
    }
  };

  function formatTime(timefrom, timeto) {
    const currentTimeFrom = new Date(timefrom);
    const currentTimeTo = new Date(timeto);
    const [fromDate, fromTime] = currentTimeFrom.toISOString().split("T");
    const [toDate, toTime] = currentTimeTo.toISOString().split("T");

    if (currentTimeFrom.getDate() === currentTimeTo.getDate()) {
      return `${fromDate.replaceAll("-", ".")}. ${fromTime.slice(0, 5)} - ${toTime.slice(0, 5)}`;
    }

    return `${fromDate.replaceAll("-", ".")}. ${fromTime.slice(0, 5)} - ${toDate.replaceAll("-", ".")}. ${toTime.slice(0, 5)}`;
  }

  useEffect(() => {
    if (events.length > 0 && id && locations.length > 0) {
      const foundEvent = events.find(event => event.id === id);
      const foundLocation = locations.find(location => location.id === foundEvent?.locationId);
      if (foundEvent && foundLocation) {
        setCurrentEvent(foundEvent);
        setCurrentLocation(foundLocation);
        setFormattedTime(formatTime(foundEvent.timefrom, foundEvent.timeto));
      }
      else {
        navigate("/");
        return;
      }
      checkIfClamped();
      window.addEventListener('resize', checkIfClamped);
    }
    return () => window.removeEventListener('resize', checkIfClamped);
  }, [events, id]);

  return (
    <div className="min-h-screen bg-grey pb-8 text-white">
      <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
        <BackButton isInset/>
      </Link>
      <div className="w-full h-fit relative">
        <img src={`https://assets.csaposapp.hu/assets/images/${currentEvent?.imgUrl}`} alt="kep" className="w-full h-40 object-cover"/>
        <div className="w-full h-full bg-gradient-to-t from-dark-grey via-15% via-dark-grey bg-opacity-65 absolute inset-0 flex flex-col rounded-t-md text-wrap">
          <p className="font-bold text-xl px-1 break-words text-center leading-tight absolute bottom-0 w-full">{currentEvent.name}</p>
        </div>
      </div>
      <div className="rounded-b-md mb-4 bg-gradient-to-b from-dark-grey pt-1 p-4">
        <p className="text-center text-[14px] leading-none">{formattedTime}</p>
        <p className="text-center text-[14px] leading-snug mb-4"><span className="font-bold">{currentLocation.name}</span> eseménye</p>
        <div className="flex flex-row justify-between items-center w-full gap-x-2">
          <p className="text-md font-bold pb-0.5">Ott leszel?</p>
         <div className="flex flex-row gap-2">
          <button className={`btn group transition-all duration-150 min-h-0 h-8 border-2 text-sm ${isAttending ? "bg-gradient-to-t from-blue to-sky-400 text-white hover:border-sky-400" : "bg-gradient-to-t from-blue to-sky-400 bg-clip-text text-transparent"} overflow-hidden border-sky-400 hover:border-sky-400`} onClick={() => {
            !isAttending ?
            handleAcceptEvent() : handleRejectEvent();
          }}>
            Igen
            <LuCheck className={`${isAttending ? "block" : "hidden"}`}/>
          </button>
        </div>
      </div>
      <TitleDivider title={"Leírás"}/>
      <p ref={textRef} className={`max-w-full mb-2 ${isDescriptionWrapped ? "line-clamp-[8]" : "line-clamp-none"}`}>{currentEvent.description}</p>
      <div className="flex w-full justify-center">
        <ChevronRightIcon className={`w-10 ${isDescriptionWrapped ? "rotate-90" : "-rotate-90"} ${isClamped ? "flex" : "hidden"} `} onClick={() => setIsDescriptionWrapped((state) => !state)}/>
      </div>
      <TitleDivider title={"Helyszín"}/>
      <Link to={`/pub/${"Félidő Söröző"}`}>
        <div className="relative shadow-dark-grey shadow-md rounded-md select-none" onClick={() => setPreviousRoutes((state) => {
          if (!state.includes(location.pathname)) return [...state, location.pathname];
          return state;
        })}>
          <img src={`https://assets.csaposapp.hu/assets/images/${currentLocation.imgUrl}`} alt="pub" className="h-full max-h-20 w-full object-cover rounded-md"/>
          <div className={`absolute inset-0 ${true ? 'bg-opacity-70' : 'bg-opacity-85'} bg-black flex flex-col rounded-md`}>
            <p className="absolute top-1/2 -translate-y-1/2 text-lg font-bold pl-5">{currentLocation.name}</p>
          </div>
        </div>
      </Link>      
      </div>
    </div>
  )
}

export default Event;
