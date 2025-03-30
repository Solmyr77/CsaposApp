import React from "react";
import { forwardRef } from "react";

const ProductItem = forwardRef(({props}, ref) => {
    return (
      <div className="flex bg-sky-200/75 w-full aspect-square rounded flex-col p-2 gap-1 cursor-pointer" onClick={() => {
        ref.current.inert = true; 
        ref.current.showModal();
        ref.current.inert = false;
      }}>
          <img src="https://thispersondoesnotexist.com" alt="kép" className='rounded p-2 bg-white'/>
          <div className="flex flex-col">
              <span className='font-bold text-lg'>Pilsner Urquell</span>
              <span className='text-md'>0.4cl</span>
          </div>
      </div>
    )
})

export default ProductItem;
