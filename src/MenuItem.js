import React, { forwardRef, useContext } from "react";
import img1 from "./img/pilsner.png";
import Context from "./Context";
import { LuShoppingCart, LuX } from "react-icons/lu";

const  MenuItem = forwardRef(({ name, description }, ref) => {
  const { order, setOrder } = useContext(Context);
  return (
    <div className="flex flex-row h-20 items-center bg-dark-grey rounded-md">
        <div className="flex items-center basis-4/5 py-2 pl-4 pr-0">
            <img src={img1} alt="" className="h-14 aspect-square rounded-md"/>
            <div className="flex flex-col justify-start items-start px-2 basis-3/4">
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
            <div className="flex self-end w-full justify-end pr-4 basis-1/4">
                <p className="font-normal text-nowrap">450 Ft</p>
            </div>
        </div>
        <div className="flex h-full basis-1/5">
            {
                !order.includes(name) ? 
                <button className="flex justify-center items-center w-full text-sm font-normal bg-gradient-to-tr from-blue to-sky-400 rounded-r-md" 
                onClick={() => {
                    ref.current.inert = true;
                    ref.current.showModal();
                    ref.current.inert = false;
                }
                } ><LuShoppingCart className="w-6 h-6"/></button> :
                <button className="flex justify-center items-center w-full text-sm font-normal bg-red-500 rounded-r-md" 
                onClick={() => setOrder(state => state.filter(item => item !== name))}><LuX className="w-8 h-8"/></button>
            }
        </div>
    </div>
  )
})

export default MenuItem;
