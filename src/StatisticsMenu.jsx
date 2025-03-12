import React, { useContext, useEffect, useState } from 'react'
import Header from './Header'
import Context from "./Context";

export default function StatisticsMenu() {
    const { setMenuState } = useContext(Context);

    useEffect(() => {
        setMenuState("Statistics");
    }, []);

    return (
        <div className='bg-grey min-h-screen w-full'>
            <Header />
        </div>
    )
}
