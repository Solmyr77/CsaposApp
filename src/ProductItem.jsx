import React, { useContext } from "react";
import { forwardRef } from "react";
import TableContext from "./TableProvider";

const ProductItem = forwardRef(({ product }, ref) => {
  const { setSelectedProduct } = useContext(TableContext);

    return (
      <div className="flex bg-sky-200/75 w-full aspect-square rounded flex-col p-2 gap-1 cursor-pointer" onClick={() => {
        setSelectedProduct(product);
        ref.current.inert = true; 
        ref.current.showModal();
        ref.current.inert = false;
      }}>
          <img src={`https://assets.csaposapp.hu/assets/images/${product.imgUrl}?t=${new Date().getTime()}`} alt="kép" className='rounded p-2 bg-white w-full'/>
          <div className="flex flex-col">
            <span className='font-bold text-lg truncate'>{product.name}</span>
            <span className='text-md'>{product.description}</span>
          </div>
      </div>
    )
})

export default ProductItem;
