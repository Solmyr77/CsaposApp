import React, { useState, useContext, useEffect } from "react";
import { EnvelopeIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Context from "./Context";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import getAccessToken from "./refreshToken";

function NotificationItem({ record, isFriendRequest }) {
  const { getProfile, setFriendRequests, setFriends, setPreviousRoutes, logout } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAccepted, setIsAccepted] = useState(null);
  const [isRead, setIsRead] = useState(null);
  const [profile, setProfile] = useState({});

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
        setTimeout(async() => {
          const friendProfile = await getProfile(record.userId1);
          setFriends(state => [...state, friendProfile]);
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
      if (record) {
        console.log(await getProfile(record.userId1));
        setProfile(await getProfile(record.userId1));
      }
    }
    run();
  }, [isAccepted, record]);

  if (isFriendRequest === true) {
    return(
      <div className="w-full min-h-16 bg-dark-grey rounded-md flex flex-col p-4 pb-2">
        <div className="flex flex-row basis-2/3 items-center">
          <img src={`https://assets.csaposapp.hu/assets/images/${profile.imageUrl}`} alt="" className="h-10 aspect-square rounded-full object-cover mr-2"/>
          <p className="flex flex-row items-center text-sm text-left text-nowrap basis-4/5"><span className="truncate inline-block max-w-20 mr-1 font-bold">{profile.displayName}</span> barátnak jelölt!</p>
        </div>
        <div className="flex flex-row justify-end gap-2 basis-1/3 h-24 items-end">
          <button className={`bg-green-500 px-4 py-1 rounded-md h-8 ${isAccepted !== null && "invisible"}`} onClick={() => handleAccept(record.id)}>Elfogadás</button>
          <button className={`bg-red-500 px-4 py-1 rounded-md h-8 ${isAccepted !== null && "invisible"}`} onClick={() => handleReject(record.id)}>Elutasítás</button>
          <button className={`bg-green-500 px-4 py-1 rounded-md h-8 ${isAccepted === true ? "flex" : "hidden"}`}>Elfogadva <CheckIcon/></button>
          <button className={`bg-red-500 px-4 py-1 rounded-md h-8 ${isAccepted === false ? "flex" : "hidden"}`}>Elutasításva <XMarkIcon/></button>
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
