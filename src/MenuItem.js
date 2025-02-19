import React from "react";
import { useState } from "react";
import img1 from "./img/pilsner.png";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "@heroicons/react/20/solid";

function MenuItem({name, description}) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="flex flex-row h-20 items-center bg-dark-grey rounded-md shadow-md">
        <div className="flex items-center basis-4/5 py-2 pl-4 pr-0">
            <img src={img1} alt="" className="h-14 aspect-square rounded-md"/>
            <div className="flex flex-col justify-start items-start px-2">
                <p className="text-sm line-clamp-1">{name}</p>
                <p className="text-gray-300 font-normal">{description}</p>
            </div>
            {/* <div className="flex flex-grow justify-center gap-x-2">
                <div className="flex justify-center items-center h-8 aspect-square rounded-full bg-grey" onClick={() => quantity - 1 > 0 && setQuantity(state => state - 1)}>
                    <MinusIcon className="w-6 text-gray-300"/>
                </div>
                <div className="flex justify-center items-center h-8 aspect-square rounded-md bg-grey">
                    <p className="text-white text-md">{quantity}</p>
                </div>
                <div className="flex justify-center items-center h-8 aspect-square rounded-full bg-grey" onClick={() => setQuantity(state => state + 1)}>
                    <PlusIcon className="w-6 text-gray-300"/>
                </div>
            </div> */}
        </div>
        <div className="flex h-full basis-1/5">
            <button className="flex justify-center items-center w-full text-sm font-normal bg-blue rounded-r-md shadow-black shadow-[-8px_0px_10px_-10px_rgba(0_0_0_0)]"><ShoppingCartIcon className="w-6"/></button>
        </div>
    </div>
  )
}

export default MenuItem;
