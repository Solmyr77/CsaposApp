import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Context from "./Context";

export default function ReceiptsMenu() {
    const { setMenuState } = useContext(Context);

    useEffect(() => {
        setMenuState("Receipts");
    }, []);

    return (
        <div className='bg-grey min-h-screen w-full flex'>
            <div className='basis-1/12'>
                <Sidebar />
            </div>

            <div className='basis-11/12'>

            </div>
        </div>
    )
}
