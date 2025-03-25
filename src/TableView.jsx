import React from "react";
import { useParams } from "react-router-dom";

function TableView() {
  const { number } = useParams();
  return (
    <div className="flex flex-col flex-grow p-4 gap-5">
      <span className="text-5xl font-bold">Asztal {number}</span>
      <div className="grid grid-cols-2">
        <div className="flex flex-col border-2 rounded-md p-2 gap-4">
          <span className="text-xl font-bold">Vendégek</span>
          <div className="flex flex-col gap-4">
            //Guest items
            <div className="flex w-full gap-2 items-center">
              <img src="https://assets.csaposapp.hu/assets/images/28c9767c-cc7c-4948-836a-512a749df074.webp" alt="kép" className="w-16 rounded-md"/>
              <div className="flex flex-col">
                <span className="text-lg font-bold">Vendég 1</span>
                <span className="text-md">admin</span>
              </div>
              
            </div>
            <div className="flex w-full gap-2 items-center">
              <img src="https://assets.csaposapp.hu/assets/images/28c9767c-cc7c-4948-836a-512a749df074.webp" alt="kép" className="w-16 rounded-md"/>
              <div className="flex flex-col">
                <span className="text-lg font-bold">Vendég 1</span>
                <span className="text-md">admin</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex"></div>
      </div>
    </div>
  )
}

export default TableView;
