import React from "react";
import { UserIcon } from "@heroicons/react/20/solid";

function TableBookItem({tableNumber}) {
  return (
    <div className="flex flex-row w-full h-20 rounded-md bg-dark-grey">
      <div className="flex flex-row items-center justify-evenly basis-2/3">
        <div className="flex flex-col items-center">
          <p className="text-lg">Asztal{tableNumber}</p>
          <p className="text-green-500 font-normal">Szabad 18:00-tól</p>
        </div>
        <div className="flex flex-row">
          <p className="text-md">4</p>
          <UserIcon className="w-6"/>
        </div>
      </div>
      <button className="basis-1/3 aspect-square max-h-full bg-blue rounded-md text-md">Kiválasztom</button>
    </div>
  )
}

export default TableBookItem;
