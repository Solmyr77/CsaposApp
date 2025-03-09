import React, { useContext } from "react";
import img1 from "./img/pilsner.png";
import { LuX, LuPlus, LuMinus } from "react-icons/lu";
import Context from "./Context";

function OrderItem({ product }) {
  const { setOrder } = useContext(Context);

  return (
    <div className="flex items-center justify-between select-none">
        <div className="flex gap-2">
            <img src={img1} alt="kép" className="h-10 aspect-square bg-white p-1 rounded-md"/>
            <div className="flex flex-col">
              <span className="leading-none">{product.name}</span>
              <span className="text-gray-300 font-normal">{product.description}</span>
            </div>
        </div>
        <div className="flex items-center text-gray-300 justify-end h-full flex-grow gap-2">
          <span className="text-md font-normal">x{product.quantity}</span>
          <div className="flex h-full items-center gap-2">
            <LuMinus className={`h-6 w-6 p-1 rounded-md bg-grey ${product.quantity === 1 ? "opacity-50 cursor-default" : "cursor-pointer"}`} onClick={() => {
              if (product.quantity > 1) {
                setOrder(state => {
                  const foundProduct = state.find(item => item.id === product.id);
                  foundProduct.quantity -= 1;
                  return [...state];
                })
              }
            }}/>
            <LuPlus className="h-6 w-6 p-1 rounded-md bg-grey font-normal cursor-pointer" onClick={() => {
              setOrder(state => {
                const foundProduct = state.find(item => item.id === product.id);
                foundProduct.quantity += 1;
                return [...state];
              })
            }}/>
            <LuX className="h-6 w-6 rounded-sm text-red-500 cursor-pointer" onClick={() => {
              setOrder(state => state.filter(item => item.id !== product.id));
            }}/>
          </div>
        </div>
    </div>
  )
}

export default OrderItem;
