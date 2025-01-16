import React, { useState, useEffect, useContext } from "react";
import TitleDivider from "./TitleDivider";
import ListItem from "./ListItem";
import BackButton from "./BackButton";
import { Link, useParams } from "react-router-dom";
import img1 from "./img/pub.webp"
import { Rating } from "@mui/material";
import { MapPinIcon } from "@heroicons/react/20/solid";
import MainButton from "./MainButton";
import axios from "axios";
import getAccessToken from "./refreshToken";

function Pub() {
  const { name } = useParams();
  const [record, setRecord] = useState({});

  async function getLocations() {
    try {
      const config = {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` },
      };
      const response = await axios.get("https://backend.csaposapp.hu/api/locations", config);
      const data = response.data;
      const record = data.find((record) => record.name === name);

      if (record) {
        setRecord(record);
        return true;
      } 
      else {
        return false;
      }
    }
    catch (error) {
      if (error.response?.status === 401) {
        return false;
      } 
      else {
        console.error("Error fetching locations:", error.message);
        return false;
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      let isSucceeded = await getLocations();
      while (isSucceeded === false) {
        await getAccessToken();
        isSucceeded = await getLocations();
      }
    }
    fetchData();
  }, []);


  return (
    <div className="min-h-screen bg-grey px-4 pt-8 text-white">
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
        <p className="max-w-full text-wrap mb-4"> {record.description}
            <span className="flex flex-row items-center mt-2">
                <MapPinIcon className="h-5 mr-1"/> 9999 Szentjákób, Sárkány utca 888.
            </span>
        </p>
        <TitleDivider title={"Nyitvatartás"}/>
        <ListItem title={"Hétfő - Szombat"} openingHours={"13:30 - 22:00"}/>
        <ListItem title={"Vasárnap"} openingHours={"10:00 - 21:00"}/>
        <div className="mb-4"></div>
        <TitleDivider title={"Értékelés"} />
        <div className="flex flex-row justify-between w-full">
            <Rating readOnly precision={0.5} value={5} />
            <p>1 értékelés</p>
        </div>
        <div className="pt-10 pb-8 flex justify-center">
            <MainButton title={"FOGLALOK"} isActive={record.isOpen ? true : false}/>
        </div>
    </div>
  );
}

export default Pub;
