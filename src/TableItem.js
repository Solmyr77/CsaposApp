import React, { useContext } from "react";
import { UserIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import Context from "./Context";

function TableItem({ name, record }) {
  const { setPreviousRoutes } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex flex-row w-full h-20 rounded-md bg-dark-grey">
      <div className="flex flex-row items-center justify-evenly basis-2/3">
        <div className="flex flex-col items-center">
          <p className="text-lg">Asztal {record.number}</p>
          {
            !record.isBooked ? 
            <div>
              <p className="text-green-500 font-normal">Szabad</p>
            </div> :
            <div>
              <p className="text-red-500 font-normal">Foglalt</p>
            </div>
          }
        </div>
        <div className="flex flex-row">
          <p className="text-md">{record.capacity}</p>
          <UserIcon className="w-6"/>
        </div>
      </div>
      <button className="basis-1/3 aspect-square max-h-full bg-blue rounded-md text-md" onClick={() => {
        setPreviousRoutes((state) => {
          if (!state.includes(location.pathname)) return [...state, location.pathname];
          return state;
        });
        navigate(`/reservetable/${name}/table/${record.number}`);
      }}>Kiválasztom</button>
    </div>
  )
}

export default TableItem;
