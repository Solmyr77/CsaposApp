import React, { forwardRef, useContext, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import getAccessToken from "./refreshToken";
import axios from "axios";
import Context from "./Context";
import { useNavigate } from "react-router-dom";

const FriendModal = forwardRef(({ record }, ref) => {
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
      ref.current.close();
    }, 1000);
  }

  return (
    <dialog className="modal overflow-y-scroll" ref={ref}>
      {
        message === "" ?
        <div className="w-80 h-80 bg-grey rounded-xl flex flex-col items-center sticky modal-box py-2 px-4">
          <XMarkIcon className="absolute left-0 top-0 w-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => ref.current.close()}/>
          <p className="text-md text-center mb-6">Barát kezelése</p>
          <div className="flex flex-col items-center">
            <img src={`https://assets.csaposapp.hu/assets/images/${record.imageUrl}`} className="rounded-full object-cover aspect-square w-28"/>
            <p className="font-bold text-md mt-1">{record.displayName}</p>
            <p className="font-normal text-sm text-gray-300 mt-1"> Barátod 2024.12.03. óta</p>
          </div>
          <div className="h-full w-full justify-center items-center flex">
            <button className="btn bg-dark-grey text-red-500 border-0 hover:bg-dark-grey shadow-[0px_2px_2px_rgba(0,0,0,.5)]" onClick={() => handleUnfriend(record.id)}>Barát törlése</button>
          </div>
        </div> :
        <div className="w-80 min-h-80 h-80 bg-grey rounded-xl flex flex-col items-center sticky top-1/2 -translate-y-1/2 px-4 justify-center">
          <p className="text-green-500">{message}</p>
        </div>
      }
      <form method="dialog" className="modal-backdrop"><button></button></form>
    </dialog>
  )
})

export default FriendModal;
