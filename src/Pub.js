import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import TitleDivider from "./TitleDivider";
import ListItem from "./ListItem";
import BackButton from "./BackButton";
import { Link, useParams } from "react-router-dom";
import img1 from "./img/pub.webp"
import { Rating } from "@mui/material";
import records from "./records";

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
        <TitleDivider title={"Nyitvatartás"}/>
        <ListItem title={"Hétfő - Szombat"} openingHours={"13:30 - 22:00"}/>
        <ListItem title={"Vasárnap"} openingHours={"10:00 - 21:00"}/>
        <TitleDivider title={"Értékelés"} />
        <div className="flex flex-row justify-between w-full">
            <Rating precision={0.5} value={rating} onChange={(event) => {
                setRating(event.target.value);
                localStorage.setItem(`${record.name}-rating`, event.target.value);
                }}/>
            <p>{rating > 0 ? "1 értékelés" : "0 értékelés"}</p>
        </div>
        <div className="absolute bottom-10 left-[50%] -translate-x-[50%]">
            <div className="w-64 h-20 bg-blue rounded flex justify-center items-center">
                <p className="font-bold text-lg">FOGLALOK</p>
            </div>
        </div>
    </div>
  );
}

export default Pub;
