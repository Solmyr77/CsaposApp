import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import TitleDivider from "./TitleDivider";
import ListItem from "./ListItem";
import BackButton from "./BackButton";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import img1 from "./img/pub.webp"
import { Rating } from "@mui/material";
import Context from "./Context";
import EventSwiper from "./EventSwiper";
import axios from "axios";
import getAccessToken from "./refreshToken";
import { LuMapPin, LuChevronRight } from "react-icons/lu";

function Pub() {
  const { locations, previousRoutes, setPreviousRoutes, logout } = useContext(Context);
  const { name } = useParams();
  const location = useLocation();
  const [isBusinessHoursVisible, setIsBusinessHoursVisible] = useState(false);
  const [isDescriptionWrapped, setIsDescriptionWrapped] = useState(true);
  const [isClamped, setIsClamped] = useState(false);
  const [businessHours, setBusinessHours] = useState({});
  const textRef = useRef(null);
  const navigate = useNavigate();

  async function getBusinessHours(id) {
    try {
      const config = {
        headers: { 
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.get(`https://backend.csaposapp.hu/api/business-hours/${id}`, config);
      const data = await response.data;
      if (response.status === 200) setBusinessHours(data);
    }
    catch (error) {
      if (error.response?.status === 401) {
        if (await getAccessToken()) {
          await getBusinessHours(id);
        }
        else {
          await logout();
          window.location.reload();
          return false;
        }
      } 
      else {
        return false;
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

  const currentLocation = useMemo(() => locations.find(location => location.name === name), [locations, name]);

  useEffect(() => {
    if (currentLocation) {
      const run = async () => {
        Object.hasOwn(currentLocation, "id") && await getBusinessHours(currentLocation.id);
      }
      run();
    }
    checkIfClamped();
    window.addEventListener('resize', checkIfClamped);
    return () => window.removeEventListener('resize', checkIfClamped);
  }, [currentLocation]);

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
                    currentLocation?.isOpen ?
                    <p className="flex items-center gap-1 leading-none"><span className="badge bg-gradient-to-tr from-blue to-sky-400 border-0 text-white font-bold">Nyitva</span> 23:00-ig</p> :
                    <p className="flex items-center gap-1 leading-none"><span className="badge bg-transparent border-2 border-red-500 text-red-500 font-bold">Zárva</span> 23:00-ig</p>
                  }
                </div>
                <LuChevronRight className={`w-6 h-6 ${isBusinessHoursVisible ? "rotate-90" : "rotate-0"}`} onClick={() => setIsBusinessHoursVisible((state) => !state)}/>
            </div>
            <div className={`flex flex-col transition-opacity max-w-full mb-2 ${isBusinessHoursVisible ? "" : "hidden"}`}>
                <ListItem title={"Hétfő"} openingHours={Object.hasOwn(businessHours, "id") ? `${Object.values(businessHours)[1].substring(0, 5)} - ${Object.values(businessHours)[2].substring(0, 5)}` : "13:00 - 20:00"}/>
                <ListItem title={"Kedd"} openingHours={Object.hasOwn(businessHours, "id") ?`${Object.values(businessHours)[3].substring(0, 5)} - ${Object.values(businessHours)[4].substring(0, 5)} ` : "13:00 - 20:00"}/>
                <ListItem title={"Szerda"} openingHours={Object.hasOwn(businessHours, "id") ?`${Object.values(businessHours)[5].substring(0, 5)} - ${Object.values(businessHours)[6].substring(0, 5)} ` : "13:00 - 20:00"}/>
                <ListItem title={"Csütörtök"} openingHours={Object.hasOwn(businessHours, "id") ? `${Object.values(businessHours)[7].substring(0, 5)} - ${Object.values(businessHours)[8].substring(0, 5)} ` : "13:00 - 20:00"}/>
                <ListItem title={"Péntek"} openingHours={Object.hasOwn(businessHours, "id") ? `${Object.values(businessHours)[9].substring(0, 5)} - ${Object.values(businessHours)[10].substring(0, 5)} ` : "13:00 - 20:00"}/>
                <ListItem title={"Szombat"} openingHours={Object.hasOwn(businessHours, "id") ? `${Object.values(businessHours)[11].substring(0, 5)} - ${Object.values(businessHours)[12].substring(0, 5)} ` : "13:00 - 20:00"}/>
                <ListItem title={"Vasárnap"} openingHours={Object.hasOwn(businessHours, "id") ? `${Object.values(businessHours)[13].substring(0, 5)} - ${Object.values(businessHours)[14].substring(0, 5)} ` : "13:00 - 20:00"}/>
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
                <button className={`btn bg-gradient-to-tr from-blue to-sky-400 text-white border-0 w-56 h-20 hover:bg-blue disabled:bg-blue disabled:text-white disabled:opacity-50 shadow-[0_4px_4px_rgba(0,0,0,.25)]`} disabled={!currentLocation?.isOpen} onClick={() => {
                    if (currentLocation?.isOpen) {
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
