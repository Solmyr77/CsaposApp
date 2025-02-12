import React, { useContext } from "react";
import { UserIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import Context from "./Context";

function TableItem({ record, tableNumber }) {
  const { setPreviousRoutes } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex flex-row w-full h-20 rounded-md bg-dark-grey">
      <div className="flex flex-row items-center justify-evenly basis-2/3">
        <div className="flex flex-col items-center">
          <p className="text-lg">Asztal {tableNumber}</p>
          <p className="text-green-500 font-normal">Szabad 18:00-tól</p>
        </div>
        <div className="flex flex-row">
          <p className="text-md">4</p>
          <UserIcon className="w-6"/>
        </div>
      </div>
      <button className="basis-1/3 aspect-square max-h-full bg-blue rounded-md text-md" onClick={() => {
        setPreviousRoutes((state) => {
          if (!state.includes(location.pathname)) return [...state, location.pathname];
          return state;
        });
        navigate(`/reservetable/${record.name}/table/${tableNumber}`);
      }}>Kiválasztom</button>
    </div>
  )
}

export default TableItem;
