import React from "react";
import OrderItem from "./OrderItem";

function Order() {
  return (
    <div className="bg-dark-grey w-full rounded-lg px-3 py-2">
        <div className="flex justify-between items-center">
        <p className="text-lg">Rendelés <span className="text-gray-300">#1</span></p>
        <div className="flex items-center gap-2">
            <img src="" alt="" className="h-6 aspect-square rounded-full border-2"/>
            <span className="badge bg-gradient-to-tr from-blue to-sky-400 border-0 text-white">Tejesítve</span>
        </div>
        </div>
        <div className="flex flex-col mt-3">
            <OrderItem isOrdered/>
            <hr className="text-grey bg-grey border-grey my-2 self-end rounded-full" style={{width: "calc(100% - 3rem)"}}/>
            <OrderItem isOrdered/>
            <hr className="text-grey bg-grey border-grey my-2 self-end rounded-full" style={{width: "calc(100% - 3rem)"}}/>
            <OrderItem isOrdered/>
            <hr className="text-grey bg-grey border-grey my-2 self-end rounded-full" style={{width: "calc(100% - 3rem)"}}/>
        </div>
        <span className="text-md">Összesen: 2000 Ft</span>
    </div>
  )
}

export default Order;
