import React, { useContext, useState } from "react";
import { UserPlusIcon, CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";
import { useNavigate } from "react-router-dom";

function AddFriendItem({ record, plusIcon }) {
  const { tableFriends, setTableFriends, logout } = useContext(Context);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(Boolean(localStorage.getItem(record.displayName)) || false);
  const [isAddedToTable, setIsAddedToTable] = useState(false);
  const navigate = useNavigate();

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

  return (
    !plusIcon ? (
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row justify-center items-center select-none">
            <img src={`https://assets.csaposapp.hu/assets/images/${record.imageUrl}`} alt="kép" className="w-12 aspect-square rounded-full object-cover"/>
            <p className="text-md ml-2 font-normal">{record.displayName}</p>
        </div>
        <div className={`flex items-center ${isFriendRequestSent ? "hover:cursor-default" : "hover:cursor-pointer"}`} onClick={() => !isFriendRequestSent && handleFriendRequest(record.id)}>
          { isFriendRequestSent ? 
            <CheckIcon className="w-6 text-green-500"/> : 
            <UserPlusIcon className="w-6 text-blue p-0"/>
          }
        </div>
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
          if (tableFriends.some(element => element.id === record.id) === false && tableFriends.length < 3) {
            setTableFriends(state => [...state, record]);
          }
          }}>
          { tableFriends.some(element => element.id === record.id) ? 
            <CheckIcon className="w-6 text-green-500"/> : 
            <PlusIcon className="w-6 text-blue p-0"/>
          }
        </div>
      </div>
    )
  )
}

export default AddFriendItem;
