import React, { useContext, useEffect, useState } from "react";
import img1 from "./img/pilsner.png";
import { LuX, LuPlus, LuMinus } from "react-icons/lu";
import Context from "./Context";

function OrderItem({ product, isOrdered }) {
  const { setOrder, locationProducts } = useContext(Context);
  const [currentProduct, setCurrentProduct] = useState({}); 
  
  useEffect(() => {
    if (locationProducts) {
      setCurrentProduct(locationProducts.find(locationProduct => locationProduct.id === product.productId));
    }
  }, [locationProducts])

  return (
    !isOrdered ?
    <div className="flex flex-col">
      <div className="flex items-center justify-between select-none">
        <div className="flex gap-2">
          <img src={img1} alt="kép" className="h-16 aspect-square bg-white p-1 rounded-md"/>
          <div className="flex flex-col">
            <span className="leading-none">{product.name}</span>
            <span className="text-gray-300 font-normal">{product.description}</span>
            <span>{product.price} Ft</span>
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
      <hr className="text-grey bg-grey border-grey my-2 self-end rounded-full" style={{width: "calc(100% - 4.5rem)"}}/>
    </div> :

    <div className="flex flex-col">
      <div className="flex items-center justify-between select-none">
        <div className="flex gap-2">
          <img src={img1} alt="kép" className="h-10 aspect-square bg-white p-1 rounded-md"/>
          <div className="flex flex-col">
            <span className="leading-none">{currentProduct?.name}</span>
            <span className="text-gray-300 font-normal">{currentProduct?.description}</span>
          </div>
        </div>
        <div className="flex items-center justify-evenly h-full flex-grow gap-2">
          <span>{product.unitPrice} Ft</span> 
          <span className="text-md font-normal self-end text-gray-300">x{product.quantity}</span>
        </div>
      </div>
      <hr className="text-grey bg-grey border-grey my-2 self-end rounded-full" style={{width: "calc(100% - 3rem)"}}/>
    </div>
  )
}

export default OrderItem;
