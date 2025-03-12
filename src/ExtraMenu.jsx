import React, { useContext, useEffect, useState } from 'react'
import Header from './Header'
import Context from "./Context";

export default function ExtraMenu() {
    const { setMenuState } = useContext(Context);

    useEffect(() => {
        setMenuState("Extra");
    }, []);

    return (
        <div className='bg-grey min-h-screen w-full'>
            <Header />
        </div>
    )
}
