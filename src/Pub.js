import React, { useState, useEffect, useContext, useRef } from "react";
import TitleDivider from "./TitleDivider";
import ListItem from "./ListItem";
import BackButton from "./BackButton";
import { Link, useParams } from "react-router-dom";
import img1 from "./img/pub.webp"
import { Rating } from "@mui/material";
import { ChevronRightIcon, MapPinIcon } from "@heroicons/react/20/solid";
import MainButton from "./MainButton";
import Context from "./Context";
import EventSwiper from "./EventSwiper";

function Pub() {
  const { locations, previousRoutes } = useContext(Context);
  const { name } = useParams();
  const [record, setRecord] = useState({});
  const [isBusinessHoursVisible, setIsBusinessHoursVisible] = useState(false);
  const [isDescriptionWrapped, setIsDescriptionWrapped] = useState(true);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef(null);

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
    if (locations.length > 0) {
        setRecord(locations.find((record) => record.name === name));
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
            <img src={img1} alt="kep" className="rounded-md w-full h-48 object-cover"/>
            <div className="w-full h-full bg-gradient-to-t from-dark-grey via-15% via-dark-grey bg-opacity-65 absolute inset-0 flex flex-col justify-end rounded-t-md text-wrap">
                <p className="font-bold text-xl px-1 break-words text-center leading-tight w-full">{record.name}</p>
            </div>
        </div>
        <div className="rounded-b-md bg-gradient-to-b from-dark-grey pt-0.5 px-4">
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
            <div className="flex flex-row justify-between items-center max-w-full mb-2 pt-2">
                <div className="flex flex-row items-center">
                    <div className={`w-3 aspect-square rounded-full ${record.isOpen ? "bg-green-500" : "bg-red-500"} mr-1`}/>
                    <p className="leading-none"><span className="font-bold">{record.isOpen ? "Nyitva" : "Zárva"}</span> 23:00-ig</p>
                </div>
                <ChevronRightIcon className={`w-6 ${isBusinessHoursVisible ? "rotate-90" : "rotate-0"}`} onClick={() => setIsBusinessHoursVisible((state) => !state)}/>
            </div>
            <div className={`flex flex-col transition-opacity max-w-full mb-2 ${isBusinessHoursVisible ? "" : "hidden"}`}>
                <ListItem title={"Hétfő"} openingHours={"13:30 - 22:00"}/>
                <ListItem title={"Kedd"} openingHours={"13:30 - 22:00"}/>
                <ListItem title={"Szerda"} openingHours={"13:30 - 22:00"}/>
                <ListItem title={"Csütörtök"} openingHours={"13:30 - 22:00"}/>
                <ListItem title={"Péntek"} openingHours={"13:30 - 22:00"}/>
                <ListItem title={"Szombat"} openingHours={"13:30 - 22:00"}/>
                <ListItem title={"Vasárnap"} openingHours={"13:30 - 22:00"}/>
            </div>
            <TitleDivider title={"Leírás"}/>
            <p ref={textRef} className={`max-w-full text-wrap ${isDescriptionWrapped ? "line-clamp-5" : "line-clamp-none"} `}>Fedezd fel a város legmenőbb pubját, ahol az ízek és a hangulat találkoznak! Exkluzív kézműves sörök, különleges koktélok és prémium italok várnak rád, hogy minden estéd felejthetetlen legyen. Élő zene és DJ-estek gondoskodnak arról, hogy mindig vibráló legyen a hangulat, miközben a legjobb street food ételeink – burger, nachos és pizza – kényeztetik az ízlelőbimbóidat. Modern, stílusos belső tér vár rád, ahol a barátságos kiszolgálás és a fiatalos környezet garantálja, hogy jól érezd magad. Ha szereted a sportot, nézd a kedvenc csapataid meccseit óriáskivetítőinken egy hideg sör mellett. Hozd el a barátaidat, hiszen együtt még jobb élmény minden! Szülinapi bulit, céges rendezvényt vagy csak egy spontán estét tervezel? Nálunk minden adott, hogy különleges legyen az alkalom. Kövess minket a közösségi médián, mert sosem maradhatsz le a legfrissebb akciókról és eseményekről. Ha pedig csak egy jó italra és egy emlékezetes estére vágysz, akkor a mi pubunk a tökéletes választás – nálunk minden pillanat egy élmény! 🍹🍔🎶</p>            
            <div className="flex w-full justify-center">
                <ChevronRightIcon className={`w-10 ${isDescriptionWrapped ? "rotate-90" : "-rotate-90"} ${isClamped ? "flex" : "hidden"}`} onClick={() => setIsDescriptionWrapped((state) => !state)}/>
            </div>
            <TitleDivider title={"Események"}/>
            <div className="flex flex-col gap-y-2">
                <EventSwiper/>
            </div>
            <div className="flex justify-center items-center self-center h-full py-10">
                <MainButton title={"FOGLALOK"} isActive={record.isOpen ? true : false}/>
            </div>
        </div>
    </div>
  );
}

export default Pub;
