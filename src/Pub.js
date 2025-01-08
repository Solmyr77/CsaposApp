import React, { useState, useEffect } from "react";
import TitleDivider from "./TitleDivider";
import ListItem from "./ListItem";
import BackButton from "./BackButton";
import { Link, useParams } from "react-router-dom";
import img1 from "./img/pub.webp"
import { Rating } from "@mui/material";
import records from "./records";
import { MapPinIcon } from "@heroicons/react/20/solid";
import MainButton from "./MainButton";

function Pub() {
  const { name } = useParams();
  const [rating, setRating] = useState(null);
  const record = records.find(record => record.name === name);

  useEffect(() => {
    try {
        setRating(localStorage.getItem(`${record.name}-rating`));
    } 
    catch (error) {
        console.log(error);
    }
  }, []);
  

  return (
    <div className="min-h-screen w-screen bg-grey px-4 pt-8 text-white">
        <Link to={"/"}>
            <BackButton/>
        </Link>
        <div className="w-full h-fit relative my-4">
            <img src={img1} alt="" className="rounded-md w-full h-40 object-cover"/>
            <div className="w-full h-full bg-black bg-opacity-65 absolute inset-0  flex flex-col rounded-md text-wrap">
                <p className="font-bold text-3xl px-1 break-words text-center leading-tight absolute top-1/2 -translate-y-1/2 w-full">{record.name}</p>
            </div>
        </div>
        <TitleDivider title={"Leírás"}/>
        <p className="max-w-full text-wrap mb-4">Üdvözlünk ez itt a {record.name}, ahol a jó hangulat sosem hagy cserben!
            Nálunk a csapolt sör hideg, a házi pálinka tüzes, és a barátságos légkör garantált. 
            Gyere be egy körre, maradj egy estére – itt minden történetnek helye van!
            <span className="flex flex-row items-center mtangol mt-2">
                <MapPinIcon className="h-5 mr-1"/> 9999 Szentjákób, Sárkány utca 888.
            </span>
        </p>
        <TitleDivider title={"Nyitvatartás"}/>
        <ListItem title={"Hétfő - Szombat"} openingHours={"13:30 - 22:00"}/>
        <ListItem title={"Vasárnap"} openingHours={"10:00 - 21:00"}/>
        <div className="mb-4"></div>
        <TitleDivider title={"Értékelés"} />
        <div className="flex flex-row justify-between w-full">
            <Rating readOnly precision={0.5} value={5} onChange={(event) => {/*{
                setRating(event.target.value);
                localStorage.setItem(`${record.name}-rating`, event.target.value);
                }*/}}/>
            <p>1 értékelés</p>
        </div>
        <div className="pt-10 pb-8 flex justify-center">
            <MainButton title={"FOGLALOK"} isActive={record.status === "open" ? true : false}/>
        </div>
    </div>
  );
}

export default Pub;
