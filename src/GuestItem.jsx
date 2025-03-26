import React, { useContext } from "react";
import TableContext from "./TableProvider";

function GuestItem({ guest }) {
  const { selectedGuest, setSelectedGuest } = useContext(TableContext);

  return (
    <div className={`flex w-full justify-between items-center p-2 rounded-md ${selectedGuest?.id === guest?.id ? "bg-sky-200/75" : "bg-white"} cursor-pointer`} onClick={() => setSelectedGuest(guest)}>
      <div className="flex gap-2 items-center">
        <img src={`https://assets.csaposapp.hu/assets/images/${guest.imageUrl}`} alt="kép" className="w-16 rounded-md"/>
        <div className="flex flex-col">
          <span className="text-lg font-bold">Vendég {guest.number}</span>
          <span className="text-md">{guest.displayName}</span>
        </div>
      </div>
      <div className="badge badge-success text-nowrap font-bold">Fizetett</div>
    </div>
  )
}

export default GuestItem;
