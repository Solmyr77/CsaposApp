import React, { useContext, useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import Context from "./Context";

function TableItem({ table, date, time }) {
  const { selectedTable, setSelectedTable } = useContext(Context);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    console.log(table.number, isBooked);
    setIsBooked(false);
    if (table.bookings) {
      Object.values(table.bookings).map(value => new Date(value).getDate() === new Date(date).getDate() && setIsBooked(true));
    }
  }, [date, time])

  return (
    <div className={`w-full aspect-video ${selectedTable?.id === table.id ? "bg-gradient-to-tr from-blue to-sky-400" : "bg-dark-grey"} rounded-lg ${isBooked && "opacity-50 cursor-default"} flex flex-col justify-center items-center gap-1 hover:cursor-pointer`} onClick={() => {
      (time && !isBooked) && setSelectedTable(table);
    }}>
      <p className="text-lg">Asztal <span className="text-gray-300">#{table.number}</span></p>
      <div className="flex flex-col">
        <div className="flex items-center justify-start text-gray-300 gap-1">
          <LuUsers/>
          <p className="text-md font-normal">{table.capacity} fő</p>
        </div>
        <p className={`font-normal text-red-500 ${!isBooked && "hidden"}`}>Foglalt</p>
      </div>
    </div>
  )
}

export default TableItem;
