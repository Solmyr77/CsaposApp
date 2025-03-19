import React, { useContext, useEffect, useState } from 'react';
import { FiClock } from "react-icons/fi";
import { FaShop } from "react-icons/fa6";
import Context from "./Context";

export default function Header() {
    const { user, managerLocation } = useContext(Context);
    const [clockString, setClockString] = useState('');
    const [locationName, setLocationName] = useState('');

    useEffect(() => {
        function updateClock() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');

            setClockString(`${hours}:${minutes}`);

            const nextSecond = 1000 - (now.getTime() % 1000);
            setTimeout(updateClock, nextSecond);
        }

        updateClock();

        return () => clearTimeout(updateClock);
    }, []);

    useEffect(() => {
        if (managerLocation) {
            setLocationName(managerLocation.name);
        }
    }, [managerLocation]);

    return (
        <div className='flex w-full text-white bg-gray-800 text-xl justify-between py-1'>
            <div className='flex justify-center items-center ml-2'>
                <FaShop className='mr-2 size-5' />
                <h3 className='text-lg'>{locationName || "Betöltés . . ."}</h3>
            </div>

            <div className='flex justify-center items-center mr-6'>
                <FiClock className='mr-2 size-5' />
                <h3 className='text-lg'>{clockString}</h3>
            </div>
        </div>
    );
}
