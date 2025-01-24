import React, { useState, useEffect, useContext } from "react";
import TitleDivider from "./TitleDivider";
import ListItem from "./ListItem";
import BackButton from "./BackButton";
import { Link, useParams } from "react-router-dom";
import img1 from "./img/pub.webp"
import img2 from "./img/azahriah.jpg";
import { Rating } from "@mui/material";
import { ChevronRightIcon, MapPinIcon } from "@heroicons/react/20/solid";
import MainButton from "./MainButton";
import Context from "./Context";

function Pub() {
  const { locations } = useContext(Context);
  const { name } = useParams();
  const [record, setRecord] = useState({});
  const [isBusinessHoursVisible , setIsBusinessHoursVisible] = useState(false);

  useEffect(() => {
    if (locations.length > 0) {
        setRecord(locations.find((record) => record.name === name));
    }
  }, [locations]);

  return (
    <div className="min-h-screen bg-grey px-4 pt-8 text-white">
        <Link to={"/"} className="flex w-fit">
            <BackButton/>
        </Link>
        <div className="w-full h-fit relative mt-4">
            <img src={img1} alt="kep" className="rounded-md w-full h-40 object-cover"/>
            <div className="w-full h-full bg-gradient-to-t from-dark-grey via-15% via-dark-grey bg-opacity-65 absolute inset-0 flex flex-col rounded-t-md text-wrap">
                <p className="font-bold text-xl px-1 break-words text-center leading-tight absolute bottom-0 w-full">{record.name}</p>
            </div>
        </div>
        <div className="rounded-b-md bg-gradient-to-b from-dark-grey pt-0.5 p-4">
            <div className="flex flex-row justify-center items-center mb-2">
                <MapPinIcon className="h-[14px] mr-1"/>
                <p className="text-center text-[14px]">3599 Sajószöged, Petőfi út 2.</p>
            </div>
            {
                Number(record.rating) > 0 ?
                (
                    <div className="flex flex-row justify-between w-full" onLoad={()=> console.log(record.rating)}>
                        <Rating readOnly precision={0.5} value={Number(record.rating)}/>
                        <p>1 értékelés</p>
                    </div>
                ) :
                (
                    <div className="flex flex-row justify-between w-full">
                        <Rating readOnly value={0} sx={{"& .MuiSvgIcon-root" : { fill: "grey" }}}/>
                        <p>Nincs értékelés</p>
                    </div>
                )
            }
        </div>
        <div className="flex flex-row justify-between items-center max-w-full mb-2 px-4">
            <div className="flex flex-row items-center">
                <div className={`w-3 aspect-square rounded-full ${record.isOpen ? "bg-green-500" : "bg-red-500"} mr-1`}/>
                <p className="leading-none"><span className="font-bold">{record.isOpen ? "Nyitva" : "Zárva"}</span> 23:00-ig</p>
            </div>
            <ChevronRightIcon className={`w-6 ${isBusinessHoursVisible ? "rotate-90" : "rotate-0"}`} onClick={() => setIsBusinessHoursVisible((state) => !state)}/>
        </div>
        <div className={`flex flex-col transition-opacity max-w-full mb-2 px-4 ${isBusinessHoursVisible ? "" : "hidden"}`}>
            <ListItem title={"Hétfő"} openingHours={"13:30 - 22:00"}/>
            <ListItem title={"Kedd"} openingHours={"13:30 - 22:00"}/>
            <ListItem title={"Szerda"} openingHours={"13:30 - 22:00"}/>
            <ListItem title={"Csütörtök"} openingHours={"13:30 - 22:00"}/>
            <ListItem title={"Péntek"} openingHours={"13:30 - 22:00"}/>
            <ListItem title={"Szombat"} openingHours={"13:30 - 22:00"}/>
            <ListItem title={"Vasárnap"} openingHours={"13:30 - 22:00"}/>
        </div>
        <TitleDivider title={"Leírás"}/>
        <p className="max-w-full text-wrap mb-4">{record.description}</p>
        <TitleDivider title={"Események"}/>
        <Link to={"/event"}>
            <div className="relative drop-shadow-sm select-none">
                <img src={img2} alt="pub" className="h-full max-h-20 w-full object-cover rounded-md"/>
                <div className={`absolute inset-0 ${true ? 'bg-opacity-70' : 'bg-opacity-85'} bg-black flex flex-col rounded-md`}>
                <p className="absolute top-1/2 -translate-y-1/2 text-lg font-normal pl-5">Azahriah a Félidőben!</p>
                </div>
            </div>
        </Link>
        <div className="mb-4"></div>
        <div className="pt-10 pb-8 flex justify-center">
            <MainButton title={"FOGLALOK"} isActive={record.isOpen ? true : false}/>
        </div>
    </div>
  );
}

export default Pub;
