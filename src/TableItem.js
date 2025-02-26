import React, { useContext } from "react";
import { ChevronRightIcon, UsersIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import Context from "./Context";
import { MdOutlineTableRestaurant } from "react-icons/md"

function TableItem({ name, record }) {
  const { setPreviousRoutes } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className={`flex flex-row w-full h-20 rounded-md bg-dark-grey shadow-[0_4px_4px_rgba(0,0,0,.5)] ${record.isBooked && "opacity-50"}`}>
      <div className="flex flex-row basis-4/5 pr-2">
        <div className="flex h-full items-center justify-center basis-1/4">
          <MdOutlineTableRestaurant className="h-10 w-10"/>
        </div>
        <div className="flex flex-col basis-2/4 justify-evenly">
          <p className="text-md">Asztal <span className="text-gray-300 font-normal">#{record.number}</span></p>
          <div className="flex">
            <p className="text-md mr-1">{record.capacity}</p>
            <UsersIcon className="w-5"/>
          </div>
        </div>
        {
          !record.isBooked ?
          <span className="mt-2 ml-2 badge bg-green-500 border-0 text-white basis-1/4">Szabad</span> :
          <span className="mt-2 ml-2 badge bg-red-500 border-0 text-white basis-1/4">Foglalt</span> 
        }
      </div>
      <button className="basis-1/5 aspect-square max-h-full bg-blue rounded-r-md text-md px-1 flex items-center justify-center shadow-black shadow-[-8px_0px_10px_-10px_rgba(0_0_0_0)] disabled:opacity-50" disabled={record.isBooked} onClick={() => {
        setPreviousRoutes((state) => {
          if (!state.includes(location.pathname)) return [...state, location.pathname];
          return state;
        });
        navigate(`/reservetable/${name}/table/${record.number}`);
      }}><ChevronRightIcon className="w-8"/></button>
    </div>
  )
}

export default TableItem;
