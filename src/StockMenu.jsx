import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Context from "./Context";

export default function StockMenu() {
    const { setMenuState } = useContext(Context);

    useEffect(() => {
        setMenuState("Stock");
    }, []);

    return (
        <div className='bg-grey min-h-screen w-full flex'>

        </div>
    )
}
