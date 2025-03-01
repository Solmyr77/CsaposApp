import React from "react";
import { LuUsers } from "react-icons/lu";

function TableItem() {
  return (
    <div className="w-full aspect-video bg-dark-grey rounded-lg flex flex-col justify-center items-center gap-1">
      <p className="text-lg">Asztal <span className="text-gray-300">#1</span></p>
      <div className="flex items-center justify-start text-gray-300 gap-1">
        <LuUsers/>
        <p className="text-md font-normal">4 fő</p>
      </div>
    </div>
  )
}

export default TableItem;
