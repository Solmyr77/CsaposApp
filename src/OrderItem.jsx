import React from "react";

function OrderItem({ item }) {
  return (
    <div className="flex justify-between items-center px-2" key={item.id}>
        <div className="flex items-center gap-2">
        <img src={`https://assets.csaposapp.hu/assets/images/${item.imgUrl}`} alt="kép" className="w-16 rounded-md bg-white p-2"/>
        <div className="flex flex-col">
            <span className="text-lg font-bold">{item.name}</span>
            <span>{item.description}</span>
        </div>
        </div>
        <span className="font-bold">{item.price} Ft</span>
        <span className="text-lg font-bold">{item.quantity} DB</span>
    </div>
  )
}

export default OrderItem;
