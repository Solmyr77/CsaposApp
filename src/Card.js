import React, { useState, useEffect, useContext } from "react";
import img1 from "./img/pub.webp";
import { Link } from "react-router-dom";
import Context from "./Context";

function Card({ record }) {
  const { getDayOfTheWeek } = useContext(Context);
  const [isOpen, setIsOpen] = useState({});

  //timeouts for closing/opening pub
  function handleBusinessHours() {
    const foundDay = getDayOfTheWeek(record);
    if (foundDay.open) {
      const closeDate = new Date();
      closeDate.setHours(Number(foundDay.close.split(":")[0]), Number(foundDay.close.split(":")[1]), 0);
      const openDate = new Date();
      openDate.setHours(Number(foundDay.open.split(":")[0]), Number(foundDay.open.split(":")[1]), 0);
  
      if (closeDate.getTime() < new Date().getTime() || openDate.getTime() > new Date().getTime()) {
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
  }

  useEffect(() => {
    handleBusinessHours()
  }, [record]);
  

  return (
    <div className="basis-[30%] select-none">
      <Link to={`/pub/${record.name}`}>
        <div className="aspect-square relative drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <img src={`https://assets.csaposapp.hu/assets/images/${record.imgUrl}`} alt="pub" className="h-full object-cover rounded-md" onError={(event) => event.target.src = img1}/>
            <div className={`w-full h-full bg-black absolute inset-0 ${record.isOpen ? "bg-opacity-70" : "bg-opacity-85"} flex flex-col rounded-md text-wrap`}>
                <div className="h-1/4 flex items-center px-1">
                    {
                      isOpen ?
                      <span className="badge bg-gradient-to-tr from-blue to-sky-400 text-white border-0 text-[10px]">Nyitva</span>:
                      <span className="badge border-2 bg-transparent text-red-500 border-red-500 text-[10px]">Zárva</span>
                    }
                </div>
                <p className="px-1 break-words text-md text-center leading-tight absolute top-1/2 -translate-y-1/2 w-full">{record.name}</p>
            </div>
        </div>
      </Link>
    </div>
  )
}

export default Card;
