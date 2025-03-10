import React, { useContext, useEffect, useState } from "react";
import AvatarGroupItem from "./AvatarGroupItem";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import Context from "./Context";
import Order from "./Order";

function Table() {
  const { bookings, previousRoutes } = useContext(Context);
  const navigate = useNavigate();
  const { name, id } = useParams();
  const [currentBooking, setCurrentBooking] = useState({});

  useEffect(() => {
    const foundBooking = bookings.find(booking => booking.id === id);
    if (foundBooking) {
        setCurrentBooking(foundBooking);
    }
  }, [bookings]);
  

  return (
    <div className="flex flex-col max-h-screen h-screen overflow-y-hidden bg-grey text-white font-bold">
      <div className="flex flex-col px-4 shadow-lg pb-2 mb-4 bg-gradient-to-t pt-4">
        <button className="btn min-h-0 h-8 w-fit mb-2 bg-dark-grey text-sky-400 border-0 hover:bg-dark-grey" onClick={() => navigate(previousRoutes[previousRoutes.length - 1])}><LuArrowLeft/>Rendelés</button>
        <p className="text-xl">Asztalom</p>
        <div className="flex justify-between items-center">
            <p className="text-md">Asztal <span className="text-gray-300">#1</span></p>
            <div className="avatar-group -space-x-4">
                <AvatarGroupItem height={"h-10"}/>
                <AvatarGroupItem height={"h-10"}/>
                <AvatarGroupItem height={"h-10"}/>
            </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-4">
        <Order/>
      </div>
    </div>
  )
}

export default Table;
