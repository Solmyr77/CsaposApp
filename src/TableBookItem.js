import React from "react";

function TableBookItem({tableNumber}) {
  return (
    <div className="flex flex-row w-full min-h-28 rounded-md bg-dark-grey">
        <div className="flex flex-col items-center justify-evenly basis-2/3">
            <p className="text-lg">Asztal{tableNumber}</p>
            <p>4 személyes</p>
            <p className="text-green-500">Szabad 18:00-tól</p>
        </div>
        <button className="basis-1/3 h-full bg-blue rounded-md text-md">Kiválasztom</button>
    </div>
  )
}

export default TableBookItem;
