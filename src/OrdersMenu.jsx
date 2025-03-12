import React, { useContext, useEffect, useState } from 'react'
import Header from './Header'
import Context from "./Context";

export default function OrdersMenu() {
    const { setMenuState } = useContext(Context);

    useEffect(() => {
        setMenuState("Orders");
    }, []);

    return (
        <div className='bg-grey min-h-screen w-full'>
            <Header />
        </div>
    )
}
