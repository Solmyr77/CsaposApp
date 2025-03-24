import React, { useContext, useState, useEffect } from "react";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";
import { useNavigate } from "react-router-dom";
import { LuPlus, LuUserPlus, LuCheck } from "react-icons/lu";
import UserImage from "./UserImage";

function AddFriendItem({ record, plusIcon }) {
  const { tableFriends, setTableFriends, currentTable, friends, logout } = useContext(Context);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(Boolean(localStorage.getItem(record.displayName)) || false);
  const [isAddedToTable, setIsAddedToTable] = useState(false);
  const navigate = useNavigate();

  //send friendrequest to user
  async function handleFriendRequest(id) {
    try {
      const config = {
        headers : {
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.post(`https://backend.csaposapp.hu/api/friends/request?receiverId=${id}`, {}, config);
      if (response.status === 200) setIsFriendRequestSent(true);
    }
    catch (error) {
      const response = error.response;
      if (response?.status == 400) {
        setIsFriendRequestSent(true);
      }
      else if (response?.status === 401) {
        console.log(error.message);
        if (await getAccessToken()) {
          handleFriendRequest(id);
        }
        else {
          await logout();
          navigate("/login");
        }
      }
    }
  }

  useEffect(() => {
    friends.length > 0 && setIsFriendRequestSent(friends.some(friend => friend.id === record.id));
  }, [friends])

  return (
    !plusIcon ? (
      <div className="w-full flex flex-row justify-between relative">
        <div className="flex flex-row justify-center items-center select-none">
          <UserImage record={record} width={"w-12"}/>
            <p className="text-md ml-2 font-normal">{record.displayName}</p>
        </div>
        <div className={`flex absolute right-0 top-1/2 -translate-y-1/2 items-center ${isFriendRequestSent ? "hover:cursor-default" : "hover:cursor-pointer"}`} onClick={() => !isFriendRequestSent && handleFriendRequest(record.id)}>
          { isFriendRequestSent ?
            <LuCheck className="w-6 h-6 text-green-500"/> : 
            <LuUserPlus className="w-6 h-6 text-sky-500"/>
          }
        </div>
        <svg width="24" height="24">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ) : 
    (
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row justify-center items-center select-none">
            <img src={`https://assets.csaposapp.hu/assets/images/${record.imageUrl}`} alt="kép" className="w-12 aspect-square rounded-full object-cover"/>
            <p className="text-md ml-2 font-normal">{record.displayName}</p>
        </div>
        <div className={`flex items-center ${isAddedToTable ? "hover:cursor-default" : "hover:cursor-pointer"}`} onClick={() => {
          setIsAddedToTable(true);
          if (tableFriends.some(element => element.id === record.id) === false && tableFriends.length < currentTable.capacity - 1) {
            setTableFriends(state => [...state, record]);
          }
          }}>
          { tableFriends.some(element => element.id === record.id) ? 
            <LuCheck className="w-6 h-6 text-green-500"/> : 
            <LuPlus className="w-6 h-6 text-sky-500"/>
          }
        </div>
      </div>
    )
  )
}

export default AddFriendItem;
