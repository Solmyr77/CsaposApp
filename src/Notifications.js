import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import { CheckCircleIcon, EnvelopeIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Context from "./Context";

function Notifications() {
  const [isAccepted, setIsAccepted] = useState(null);
  const [Icon, setIcon] = useState(null);
  const { user } = useContext(Context);

  const importIcon = async() => {
    if (isAccepted === true) {
        return await import("@heroicons/react/20/solid/CheckCircleIcon");
    }
    return await import("@heroicons/react/20/solid/XCircleIcon");
  }
  
  useEffect(() => {
    const run = async() => {
        setIcon((await importIcon()).default);
    }
    run();
  }, [isAccepted]);
  

  return (
    <div className="w-full min-h-screen h-full bg-grey py-8 px-4 text-white">
        <Link to={"/"}><BackButton/></Link>
        <p className="text-xl font-bold text-center">Értesítések</p>
        <div className="flex flex-col items-center mt-8 overflow-y-scroll gap-y-2 pb-2">
            <div className="w-full h-16 bg-dark-grey rounded-md flex flex-row items-center p-4">
                <EnvelopeIcon className="h-10"/>
                <div className="flex flex-col w-full pl-4">
                    <p className="text-sm font-bold text-left">Azahriah koncert a Félidőben!</p>
                    <p className="w w line-clamp-1">A magyarországon világhírű énekes meghódítja a sajószögedi Félidő sörözőt.</p>
                </div>
            </div>
            <div className="w-full h-16 bg-dark-grey rounded-md flex flex-row items-center p-4">
                <img src={user.image} alt="" className="h-12 aspect-square rounded-full object-cover"/>
                <div className="flex flex-row w-full pl-2 items-center">
                    <p className="flex flex-row items-center text-sm font-bold text-left basis-4/5"><span className="truncate inline-block max-w-20 mr-1">Azahriah</span> barátnak jelölt!</p>
                    {
                        isAccepted === null ? 
                        <div className="flex flex-row gap-x-1 basis-1/5">
                            <CheckCircleIcon className="h-10 text-green-500" onClick={() => setIsAccepted(true)}/>
                            <XCircleIcon className="h-10 text-red-500" onClick={() => setIsAccepted(false)}/>
                        </div> :
                        <div className="flex flex-row gap-x-1 basis-1/5">
                            <Icon className={`h-10 text-green-500 ${isAccepted ? "visible" : "invisible"}`}/>
                            <Icon className={`h-10 text-red-500 ${isAccepted ? "invisible" : "visible"}`}/>
                        </div>  
                    }
                </div>
            </div>
        </div>
    </div>
  );
}

export default Notifications;
