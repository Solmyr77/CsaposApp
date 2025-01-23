import React, { useState, useEffect, useContext } from "react";
import TitleDivider from "./TitleDivider";
import ListItem from "./ListItem";
import BackButton from "./BackButton";
import { Link, useParams } from "react-router-dom";
import img1 from "./img/pub.webp"
import { Rating } from "@mui/material";
import { MapPinIcon, StarIcon } from "@heroicons/react/20/solid";
import MainButton from "./MainButton";
import Context from "./Context";

function Pub() {
  const { locations } = useContext(Context);
  const { name } = useParams();
  const [record, setRecord] = useState({});

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
        <div className="rounded-b-md mb-4 bg-gradient-to-b from-dark-grey pt-0.5 p-4">
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
                        <Rating readOnly value={0} sx={{"& .MuiSvgIcon-root" : { fill: "darkgrey" }}}/>
                        <p>Nincs értékelés</p>
                    </div>
                )
            }
        </div>
        <TitleDivider title={"Leírás"}/>
        <p className="max-w-full text-wrap mb-4">{record.description}</p>
        <TitleDivider title={"Nyitvatartás"}/>
        <ListItem title={"Hétfő - Szombat"} openingHours={"13:30 - 22:00"}/>
        <ListItem title={"Vasárnap"} openingHours={"10:00 - 21:00"}/>
        <div className="mb-4"></div>
        <div className="pt-10 pb-8 flex justify-center">
            <MainButton title={"FOGLALOK"} isActive={record.isOpen ? true : false}/>
        </div>
    </div>
  );
}

export default Pub;
