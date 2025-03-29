import { React, useEffect, useState } from 'react';
import { LuUsers, LuClock } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function TableItem({ table }) {
    const [currentBooking, setCurrentBooking] = useState({});
    const [isActive, setIsActive] = useState(false);
    
    // Function to format ISO time to HH:MM
    const formatTime = (isoString) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    //setting timout for state update
    function setIsActiveTimeout(foundBooking) {
        const currentTime = new Date().getTime();
        const bookedFromTime = new Date(foundBooking.bookedFrom).getTime();
        const timeout = setTimeout(() => {
            setIsActive(true);
        }, bookedFromTime - currentTime);

        return () => clearTimeout(timeout);
    }

    //find todays booking if there is any
    useEffect(() => {
        if (table.bookings?.length > 0) {
            const foundBooking = table.bookings.find(booking => new Date(booking.bookedFrom).getDate() === new Date().getDate());
            if (foundBooking) {
                setCurrentBooking(foundBooking);
                if (new Date(foundBooking.bookedFrom).getTime() < new Date().getTime()) setIsActive(true);
                else setIsActiveTimeout(foundBooking);
            }
        }
    }, []);


    return (
        <Link to={`/tables/${table.number}`} className='flex'>
            <div className={`flex flex-col aspect-square bg-white border-[3px] w-full shadow gap-4 rounded-lg p-4 justify-between`}>
                <div className='flex justify-between items-center w-full'>
                    <h1 className={`text-center text-5xl font-bold`}>{table.number}</h1>
                    {
                        currentBooking.id ?
                        (
                            isActive ?
                            <div className="badge badge-success badge-lg font-bold">
                                Aktív
                            </div> :
                            <div className="badge badge-warning badge-lg font-bold">
                                Foglalt
                            </div>

                        ) :
                        <div className="badge badge-soft badge-success badge-lg font-bold">
                            Foglalható
                        </div>
                    }
                </div>

                <div className='flex flex-col flex-grow justify-center items-center'>
                    <h2 className="flex justify-start items-center text-center text-xxl text-gray-500 w-full ml-4">
                        <LuUsers className='mr-4' /> {currentBooking?.tableGuests?.length ?? "0"}/{table.capacity}
                    </h2>

                    {table?.bookings ? (
                        <h2 className="flex justify-start items-center text-center text-xxl text-gray-500 w-full ml-4 my-2">
                            <LuClock className='mr-4' /> {formatTime(currentBooking?.bookedFrom)}
                        </h2>
                    ) : (
                        <h2 className="flex justify-start items-center text-center text-xxl text-gray-500 w-full ml-4 my-2">
                            <LuClock className='mr-4 mt-[0.4rem]' /> -
                        </h2>
                    )}

                </div>
                
                <div className="flex flex-col">
                    <span className="font-bold text-xl">
                        Fogyasztás:
                    </span>
                    <span className="font-bold text-xl">
                        {table.total} Ft
                    </span>
                </div>
            </div>
        </Link>
    );
}
