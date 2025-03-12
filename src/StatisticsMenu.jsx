import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Context from "./Context";

export default function StatisticsMenu() {
    const { setMenuState } = useContext(Context);

    useEffect(() => {
        setMenuState("Statistics");
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
