import React, { useContext, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import getAccessToken from "./refreshToken";
import axios from "axios";
import Context from "./Context";
import { useNavigate } from "react-router-dom";

function FriendModal({ record, isFriendModalVisible, setIsFriendModalVisible}) {
  const { setFriends, logout } = useContext(Context);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  async function handleUnfriend(id) {
    try {
      const config = {
        headers : {
          Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
          "Cache-Content": "no-cache"
        }
      }
      const response = await axios.delete(`https://backend.csaposapp.hu/api/friends/remove/${id}`, config);
      if (response.status === 200) {
        setMessage("Sikeres törlés!");
        setFriends(state => state.filter(friend => friend.id !== id));
      }
    }
    catch (error) {
      const response = error.response;
      if (response?.status === 401) {
        console.log(error.message);
        if (await getAccessToken()) {
          handleUnfriend(id);
        }
        else {
          await logout();
          navigate("/login");
        }
      }
    }
    setTimeout(() => {
      setMessage("");
      setIsFriendModalVisible(false);
    }, 1000);
  }

  return (
    <div className={`w-full min-h-screen h-full absolute top-0 left-0 bg-opacity-65 bg-black ${isFriendModalVisible ? "flex" : "hidden"} justify-center items-center`}>
      {
        message === "" ?
        <div className="w-80 min-h-80 h-80 bg-grey rounded-xl flex flex-col items-center relative px-4">
          <XMarkIcon className="absolute left-0 top-0 w-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => setIsFriendModalVisible(false)}/>
          <p className="text-md pt-4 text-center mb-6">Barát kezelése</p>
          <div className="flex flex-col items-center">
            <img src={`https://assets.csaposapp.hu/assets/images/${record.imageUrl}?t=${new Date().getTime()}`} className="rounded-full object-cover aspect-square w-28"/>
            <p className="font-bold text-md mt-1">{record.displayName}</p>
            <p className="font-normal text-small mt-2"> Barátod 2024.12.03. óta</p>
          </div>
          <div className="h-full w-full justify-center items-center flex">
            <button className="w-1/2 h-fit bg-dark-grey text-red-500 p-2 rounded-md" onClick={() => handleUnfriend(record.id)}>Barát törlése</button>
          </div>
        </div> :
        <div className="w-80 min-h-80 h-80 bg-grey rounded-xl flex flex-col items-center relative px-4 justify-center">
          <p className="text-green-500">{message}</p>
        </div>
      }
    </div>
  )
}

export default FriendModal;
