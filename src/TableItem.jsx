import { React, useContext, useEffect, useState } from 'react';
import { LuUsers, LuClock } from "react-icons/lu";
import Context from "./Context";
import { Link } from "react-router-dom";

export default function TableItem({ table }) {
    const { bookings } = useContext(Context);
    const [currentBooking, setCurrentBooking] = useState({});

    // Find the booking associated with this table
    useEffect(() => {
        if (bookings.length > 0 && table.id) {
            const foundBooking = bookings.find(booking => booking.tableId === table.id);
            setCurrentBooking(foundBooking);
        }
    }, [bookings, table]);

    // Function to format ISO time to HH:MM
    const formatTime = (isoString) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <Link to={`/tables/${table.number}`}>
            <div className={`flex flex-col aspect-square bg-white border-[3px] shadow gap-4 rounded-lg p-4 justify-between`}>
                <div className='flex justify-between items-center w-full'>
                    <h1 className={`text-center text-5xl font-bold`}>{table.number}</h1>
                    <div className="badge badge-success badge-lg font-bold">
                        Foglalható
                    </div>
                </div>

                <div className='flex flex-col flex-grow justify-center items-center'>
                    <h2 className="flex justify-start items-center text-center text-xxl text-gray-500 w-full ml-4">
                        <LuUsers className='mr-4' /> {currentBooking?.tableGuests?.length ?? "0"}/{table.capacity}
                    </h2>

                    {currentBooking ? (
                        <h2 className="flex justify-start items-center text-center text-xxl text-gray-500 w-full ml-4 my-2">
                            <LuClock className='mr-4' /> {formatTime(currentBooking.bookedFrom)}
                        </h2>
                    ) : (
                        <h2 className="flex justify-start items-center text-center text-xxl text-gray-500 w-full ml-4 my-2">
                            <LuClock className='mr-4 mt-[0.4rem]' /> -
                        </h2>
                    )}

                </div>
                
                <span className="flex justify-start font-bold items-center text-xl w-full ml-4">
                    Fogyasztás: 10.000 Ft
                </span>
            </div>
        </Link>
    );
}
