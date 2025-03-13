import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import TitleDivider from "./TitleDivider";
import ListItem from "./ListItem";
import BackButton from "./BackButton";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import img1 from "./img/pub.webp"
import { Rating } from "@mui/material";
import Context from "./Context";
import EventSwiper from "./EventSwiper";
import { LuMapPin, LuChevronRight } from "react-icons/lu";

function Pub() {
  const { locations, previousRoutes, setPreviousRoutes } = useContext(Context);
  const { name } = useParams();
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState({});
  const [currentDay, setCurrentDay] = useState({});
  const [isBusinessHoursVisible, setIsBusinessHoursVisible] = useState(false);
  const [isDescriptionWrapped, setIsDescriptionWrapped] = useState(true);
  const [isClamped, setIsClamped] = useState(false);
  const [isOpen, setIsOpen] = useState(null);
  const textRef = useRef(null);
  const navigate = useNavigate();

  const checkIfClamped = () => {
    const element = textRef.current;
    if (element) {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const linesVisible = Math.floor(element.clientHeight / lineHeight);
      const totalLines = Math.ceil(element.scrollHeight / lineHeight);
      setIsClamped(totalLines > linesVisible);
    }
  };

  function getDayOfTheWeek(foundLocation) {
    switch (new Date().getDay()) {
      case 1:
        return {open: foundLocation.businessHours.mondayOpen, close: foundLocation.businessHours.mondayClose};
      
      case 2:
        return {open: foundLocation.businessHours.tuesdayOpen, close: foundLocation.businessHours.tuesdayClose};
        
      case 3:
        return {open: foundLocation.businessHours.wednesdayOpen, close: foundLocation.businessHours.wednesdayClose};
      
      case 4:
        return {open: foundLocation.businessHours.thursdayOpen, close: foundLocation.businessHours.thursdayClose};
      
      case 5:
        return {open: foundLocation.businessHours.fridayOpen, close: foundLocation.businessHours.fridayClose};

      case 6:
        return {open: foundLocation.businessHours.saturdayOpen, close: foundLocation.businessHours.saturdayClose};

      case 0:
        return {open: foundLocation.businessHours.sundayOpen, close: foundLocation.businessHours.sundayClose};
    }
  }

  function handleBusinessHours(foundLocation) {
    const foundDay = getDayOfTheWeek(foundLocation);
    setCurrentDay(foundDay);
    const closeDate = new Date();
    closeDate.setHours(Number(foundDay.close.split(":")[0]), Number(foundDay.close.split(":")[1]), 0);
    const openDate = new Date();
    openDate.setHours(Number(foundDay.open.split(":")[0]), Number(foundDay.open.split(":")[1]), 0);

    if (closeDate.getTime() < new Date().getTime()) {
      setIsOpen(false);
      const timeout = setTimeout(() => {
          setIsOpen(true);
      }, openDate.getTime() - new Date().getTime());
      return () => clearTimeout(timeout);
    }
    else {
      setIsOpen(true);
      const timeout = setTimeout(() => {
          setIsOpen(false);
      }, closeDate.getTime() - new Date().getTime());
      return () => clearTimeout(timeout);
    }
  }

  useEffect(() => {
    if (locations.length > 0) {
      const foundLocation = locations.find(location => location.name === name);
      if (foundLocation) {
        setCurrentLocation(foundLocation);
        foundLocation?.businessHours && handleBusinessHours(foundLocation);
      } 
      else navigate("/");
    }
    checkIfClamped();
    window.addEventListener('resize', checkIfClamped);
    return () => window.removeEventListener('resize', checkIfClamped);
  }, [locations]);

  return (
    <div className="min-h-screen bg-grey text-white flex flex-col">
        <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
            <BackButton isInset/>
        </Link>
        <div className="w-full h-fit relative">
            <img src={img1} alt="kep" className="w-full h-48 object-cover"/>
            <div className="w-full h-full bg-gradient-to-t from-dark-grey via-15% via-dark-grey bg-opacity-65 absolute inset-0 flex flex-col justify-end text-wrap">
                <p className="font-bold text-xl px-1 break-words text-center leading-tight w-full">{currentLocation?.name}</p>
            </div>
        </div>
        <div className="rounded-b-md bg-gradient-to-b from-dark-grey pt-0.5 px-4">
            <div className="flex flex-row justify-center items-center mb-2 text-gray-300">
                <LuMapPin className="h-[14px] w-[14px] mr-1 cursor-pointer"/>
                <p className="text-center text-[14px]">3599 Sajószöged, Petőfi út 2.</p>
            </div>
            {
                Number(currentLocation?.rating) > 0 ?
                (
                    <div className="flex flex-row justify-between w-full">
                        <Rating readOnly precision={0.5} value={Number(currentLocation?.rating)}/>
                        <p>1 értékelés</p>
                    </div>
                ) :
                (
                    <div className="flex flex-row justify-between w-full">
                        <Rating readOnly value={0} sx={{"& .MuiSvgIcon-root" : { fill: "#d1d5db" }}}/>
                        <p className="text-gray-300">Nincs értékelés</p>
                    </div>
                )
            }
            <div className="flex flex-row justify-between items-center max-w-full mb-2 pt-2">
                <div className="flex flex-row items-center">
                  {
                    (isOpen !== null ? isOpen : currentLocation?.isOpen) ?
                    <p className="flex items-center gap-1 leading-none"><span className="badge bg-gradient-to-tr from-blue to-sky-400 border-0 text-white font-bold">Nyitva</span> {currentDay?.close?.slice(0, 5) || "20:00"}-ig</p> :
                    <p className="flex items-center gap-1 leading-none"><span className="badge bg-transparent border-2 border-red-500 text-red-500 font-bold">Zárva</span> {currentDay?.open?.slice(0, 5) || "13:00"}-ig</p>
                  }
                </div>
                <LuChevronRight className={`w-6 h-6 ${isBusinessHoursVisible ? "rotate-90" : "rotate-0"} cursor-pointer`} onClick={() => setIsBusinessHoursVisible((state) => !state)}/>
            </div>
            <div className={`flex flex-col transition-opacity max-w-full mb-2 ${isBusinessHoursVisible ? "" : "hidden"}`}>
                <ListItem title={"Hétfő"} openingHours={currentLocation?.businessHours ? `${currentLocation.businessHours.mondayOpen.slice(0, 5)} - ${currentLocation.businessHours.mondayClose.slice(0, 5)}` : "13:00 - 20:00"}/>
                <ListItem title={"Kedd"} openingHours={currentLocation?.businessHours ? `${currentLocation.businessHours.tuesdayOpen.slice(0, 5)} - ${currentLocation.businessHours.tuesdayClose.slice(0, 5)}` : "13:00 - 20:00"}/>
                <ListItem title={"Szerda"} openingHours={currentLocation?.businessHours ? `${currentLocation.businessHours.wednesdayOpen.slice(0, 5)} - ${currentLocation.businessHours.wednesdayClose.slice(0, 5)}` : "13:00 - 20:00"}/>
                <ListItem title={"Csütörtök"} openingHours={currentLocation?.businessHours ? `${currentLocation.businessHours.thursdayOpen.slice(0, 5)} - ${currentLocation.businessHours.thursdayClose.slice(0, 5)}` : "13:00 - 20:00"}/>
                <ListItem title={"Péntek"} openingHours={currentLocation?.businessHours ? `${currentLocation.businessHours.fridayOpen.slice(0, 5)} - ${currentLocation.businessHours.fridayClose.slice(0, 5)}` : "13:00 - 20:00"}/>
                <ListItem title={"Szombat"} openingHours={currentLocation?.businessHours ? `${currentLocation.businessHours.saturdayOpen.slice(0, 5)} - ${currentLocation.businessHours.saturdayClose.slice(0, 5)}` : "13:00 - 20:00"}/>
                <ListItem title={"Vasárnap"} openingHours={currentLocation?.businessHours ? `${currentLocation.businessHours.sundayOpen.slice(0, 5)} - ${currentLocation.businessHours.sundayClose.slice(0, 5)}` : "13:00 - 20:00"}/>
            </div>
            <TitleDivider title={"Leírás"}/>
            <p ref={textRef} className={`max-w-full text-wrap ${isDescriptionWrapped ? "line-clamp-5" : "line-clamp-none"} mb-2`}>{currentLocation?.description}</p>            
            <div className="flex w-full justify-center">
                <LuChevronRight className={`w-10 h-10 ${isDescriptionWrapped ? "rotate-90" : "-rotate-90"} ${isClamped ? "flex" : "hidden"}`} onClick={() => setIsDescriptionWrapped((state) => !state)}/>
            </div>
            <TitleDivider title={"Események"}/>
            <div className="flex flex-col gap-y-2">
                <EventSwiper/>
            </div>
            <div className="flex justify-center items-center self-center h-full py-10">
                <button className={`btn bg-gradient-to-tr from-blue to-sky-400 text-white border-0 w-56 h-20 hover:bg-blue disabled:bg-blue disabled:text-white disabled:opacity-50 shadow-[0_4px_4px_rgba(0,0,0,.25)]`} disabled={isOpen !== null ? !isOpen : !currentLocation?.isOpen} onClick={() => {
                    if (isOpen !== null ? isOpen : currentLocation?.isOpen) {
                        setPreviousRoutes((state) => {
                            if (!state.includes(location.pathname)) return [...state, location.pathname];
                            return state;
                          });
                        navigate(`/reservetable/${name}`);
                    }
                }}>
                    <p className="font-bold text-xl">Foglalok</p>
                </button>
            </div>
        </div>
    </div>
  );
}

export default Pub;
