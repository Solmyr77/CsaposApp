import React, { useContext, useEffect } from 'react'
import Context from "./Context";
import ProductItem from './ProductItem';
import { useRef } from 'react';

export default function ProductsMenu() {
    const { setMenuState } = useContext(Context);
    const modalRef = useRef();

    useEffect(() => {
        setMenuState("Products");
    }, []);

    return (
        <div className='w-full grow flex flex-col p-4 gap-8' style={{height: "calc(100vh - 6rem)"}}>
            <div className="flex justify-between items-center">
                <span className='text-5xl font-bold'>Termékek</span>
                <button className='btn btn-info btn-lg'>Új termék</button>
            </div>
            <div className="grid grid-cols-8 justify-items-center gap-4 overflow-auto">
                <ProductItem ref={modalRef}/>
                <ProductItem ref={modalRef}/>
                <ProductItem ref={modalRef}/>
                <ProductItem ref={modalRef}/>
                <ProductItem ref={modalRef}/>
            </div>

            <dialog className='modal' ref={modalRef}>
                <div className="modal-box">
                    
                </div>
                <form method='dialog' className='modal-backdrop'><button></button></form>
            </dialog>
        </div>
    )
}
