import React, { useContext, useEffect, useState } from "react";
import AvatarGroupItem from "./AvatarGroupItem";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import Context from "./Context";
import Order from "./Order";

function Table() {
  const { bookings, previousRoutes, getOrdersByTable, tableOrders, locationProducts, getProductsByLocation, currentBooking, setCurrentBooking } = useContext(Context);
  const navigate = useNavigate();
  const { name, id } = useParams();

  useEffect(() => {
    const foundBooking = bookings.find(booking => booking.id === id);
    if (foundBooking) {
      const run = async () => {
        await getOrdersByTable(foundBooking.tableId);
        locationProducts.length === 0 &&
        await getProductsByLocation(foundBooking.locationId);
      } 
      run();
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
            <div className={`avatar-group -space-x-3 ${!currentBooking?.tableGuests?.some(friend => friend.status === "accepted") && "hidden"}`}>
              {
                currentBooking?.tableGuests?.map(friend => friend.status === "accepted" && <AvatarGroupItem height={"h-10"} imageUrl={friend.imageUrl}/>)
              }
            </div>
        </div>
      </div>
      <div className="flex h-full flex-col gap-3 overflow-auto px-4 pb-4">
        {
          tableOrders?.length > 0 ?
          tableOrders.map((order, i) => <Order record={order} num={i}/>) :
          <div className="flex h-full flex-grow justify-center items-center">
            <span className="text-gray-300 font-normal">Itt jelennek meg a rendelések.</span>
          </div>
        }
      </div>
    </div>
  )
}

export default Table;
