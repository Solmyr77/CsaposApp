import React, { useState, useContext, useEffect } from "react";
import { EnvelopeIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Context from "./Context";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import getAccessToken from "./refreshToken";

function NotificationItem({ record, isFriendRequest }) {
  const { getProfile, friendRequests, setFriendRequests, setFriends, setPreviousRoutes, logout } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAccepted, setIsAccepted] = useState(null);
  const [Icon, setIcon] = useState(null);
  const [isRead, setIsRead] = useState(null);
  const [profile, setProfile] = useState({});

  const importIcon = async() => {
    if (isAccepted === true) {
      return await import("@heroicons/react/20/solid/CheckCircleIcon");
    }
    return await import("@heroicons/react/20/solid/XCircleIcon");
  }

  async function handleAccept(id) {
    try {
      const config = {
        headers : {
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.post(`https://backend.csaposapp.hu/api/friends/accept/${id}`, {}, config);
      if (response.status === 200) {
        setIsAccepted(true);
        setTimeout(() => {
          setFriends(state => state.filter(friend => friend.id !== profile.id));
          setFriendRequests(state => state.filter(friendRequest => friendRequest.id !== record.id));
        }, 2000);
      }
    }
    catch (error) {
      const response = error.response;
      if (response?.status === 401) {
        console.log(error.message);
        if (await getAccessToken()) {
          handleAccept(id);
        }
        else {
          await logout();
          navigate("/login");
        }
      }
    }
  }

  async function handleReject(id) {
    try {
      const config = {
        headers : {
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.post(`https://backend.csaposapp.hu/api/friends/reject/${id}`, {}, config);
      if (response.status === 200) {
        setIsAccepted(false);
        setTimeout(() => {
          setFriends(state => state.filter(friend => friend.id !== profile.id));
          setFriendRequests(state => state.filter(friendRequest => friendRequest.id !== record.id));
        }, 2000);
      }
    }
    catch (error) {
      const response = error.response;
      if (response?.status === 401) {
        console.log(error.message);
        if (await getAccessToken()) {
          handleReject(id);
        }
        else {
          await logout();
          navigate("/login");
        }
      }
    }
  }
  
  useEffect(() => {
    const run = async () => {
      setIcon((await importIcon()).default);
      if (isFriendRequest) {
        console.log(await getProfile(record.userId1));
        setProfile(await getProfile(record.userId1));
      }
    }
    run();
  }, [isAccepted, record]);

  if (isFriendRequest === true) {
    return(
      <div className="w-full h-16 bg-dark-grey rounded-md flex flex-row items-center p-4">
        <img src={`https://assets.csaposapp.hu/assets/images/${profile.imageUrl}`} alt="" className="h-10 aspect-square rounded-full object-cover"/>
        <div className="flex flex-row w-full pl-2 items-center">
          <p className="flex flex-row items-center text-sm text-left text-nowrap basis-4/5"><span className="truncate inline-block max-w-20 mr-1 font-bold">{profile.displayName}</span> barátnak jelölt!</p>
          {
            isAccepted === null ? 
            <div className="flex flex-row gap-x-1 basis-1/5">
                <CheckCircleIcon className="h-10 text-green-500 hover:cursor-pointer" onClick={async () => await handleAccept(record.id)}/>
                <XCircleIcon className="h-10 text-red-500 hover:cursor-pointer" onClick={async () => await handleReject(record.id)}/>
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
