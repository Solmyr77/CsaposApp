import React, { useState, useContext, useEffect } from "react";
import { EnvelopeIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Context from "./Context";
import { useLocation, useNavigate } from "react-router-dom";

function NotificationItem({ isFriendRequest }) {
  const [isAccepted, setIsAccepted] = useState(null);
  const [Icon, setIcon] = useState(null);
  const [isRead, setIsRead] = useState(null);
  const { user, setPreviousRoutes } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

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

  if (isFriendRequest === true) {
    return(
      <div className="w-full h-16 bg-dark-grey rounded-md flex flex-row items-center p-4">
        <img src={user.imageUrl} alt="" className="h-10 aspect-square rounded-full object-cover"/>
        <div className="flex flex-row w-full pl-2 items-center">
          <p className="flex flex-row items-center text-sm text-left text-nowrap basis-4/5"><span className="truncate inline-block max-w-20 mr-1 font-bold">Azahriah</span> barátnak jelölt!</p>
          {
            isAccepted === null ? 
            <div className="flex flex-row gap-x-1 basis-1/5">
                <CheckCircleIcon className="h-10 text-green-500 hover:cursor-pointer" onClick={() => setIsAccepted(true)}/>
                <XCircleIcon className="h-10 text-red-500 hover:cursor-pointer" onClick={() => setIsAccepted(false)}/>
            </div> :
            <div className="flex flex-row gap-x-1 basis-1/5">
                <Icon className={`h-10 text-green-500 ${isAccepted ? "visible" : "invisible"}`}/>
                <Icon className={`h-10 text-red-500 ${isAccepted ? "invisible" : "visible"}`}/>
            </div>  
          }
        </div>
      </div>
    )
  }
  return (
    <div className="w-full h-16 bg-dark-grey rounded-md flex flex-row items-center p-4 hover:cursor-pointer" onClick={() => {
      setIsRead(true);
      setPreviousRoutes((state) => {
        if (!state.includes(location.pathname)) return [...state, location.pathname];
        return state;
      });
      navigate("/event");
      }}>
        <div className="relative">
            <EnvelopeIcon className="h-10"/>
            <div className={`absolute top-0.5 -right-[.125rem] rounded-full w-3 aspect-square bg-red-500 ${isRead ? "invisible" : "visible"}`}></div>
        </div>
        <div className="flex flex-col w-full pl-4">
            <p className="text-sm font-bold text-left">Azahriah koncert a Félidőben!</p>
            <p className="w w line-clamp-1">A magyarországon világhírű énekes meghódítja a sajószögedi Félidő sörözőt.</p>
        </div>
    </div>
  );
  
}

export default NotificationItem;
