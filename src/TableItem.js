import React, { useContext } from "react";
import { LuUsers } from "react-icons/lu";
import Context from "./Context";

function TableItem({ table, time }) {
  const { selectedTable, setSelectedTable } = useContext(Context);

  return (
    <div className={`w-full aspect-video ${selectedTable?.id === table.id ? "bg-gradient-to-tr from-blue to-sky-400" : "bg-dark-grey"} rounded-lg flex flex-col justify-center items-center gap-1 hover:cursor-pointer`} onClick={() => {
      time && setSelectedTable(table);
    }}>
      <p className="text-lg">Asztal <span className="text-gray-300">#{table.number}</span></p>
      <div className="flex items-center justify-start text-gray-300 gap-1">
        <LuUsers/>
        <p className="text-md font-normal">{table.capacity} fő</p>
      </div>
    </div>
  )
}

export default TableItem;
