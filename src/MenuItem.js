import React, { forwardRef, useContext } from "react";
import img1 from "./img/pilsner.png";
import Context from "./Context";
import { LuShoppingCart, LuX } from "react-icons/lu";

const  MenuItem = forwardRef(({ product }, ref) => {
  const { order, setOrder, setSelectedProduct } = useContext(Context);
  return (
    <div className="flex flex-row h-20 items-center bg-dark-grey rounded-md">
        <div className="flex items-center h-full basis-4/5 py-2 pl-4 pr-0">
            <img src={img1} alt="" className="h-14 aspect-square rounded-md"/>
            <div className="flex flex-col h-full justify-start items-start px-2 basis-3/4">
                <p className="text-sm line-clamp-1">{product.name}</p>
                <p className="text-gray-300 font-normal">{product?.description}</p>
            </div>
            <div className="flex self-end w-full justify-end pr-4 basis-1/4">
                <p className="font-normal text-nowrap">{product.price} Ft</p>
            </div>
        </div>
        <div className="flex h-full basis-1/5">
            {
                !Array.from(order).some(item => item.id === product.id) ? 
                <button className="flex justify-center items-center w-full text-sm font-normal bg-gradient-to-tr from-blue to-sky-400 rounded-r-md" 
                onClick={() => {
                    product.quantity = 1;
                    setSelectedProduct(product);
                    ref.current.inert = true;
                    ref.current.showModal();
                    ref.current.inert = false;
                }
                } ><LuShoppingCart className="w-6 h-6"/></button> :
                <button className="flex justify-center items-center w-full text-sm font-normal bg-red-500 rounded-r-md" 
                onClick={() => setOrder(state => state.filter(item => item.id !== product.id))}><LuX className="w-8 h-8"/></button>
            }
        </div>
    </div>
  )
})

export default MenuItem;
