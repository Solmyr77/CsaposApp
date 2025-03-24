import { React, useContext } from 'react';
import { BsPeople } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { RiBeerFill } from "react-icons/ri";
import Context from "./Context";
import { Link } from "react-router-dom";

export default function TableItem({ table }) {
    const { bookings } = useContext(Context);

    // Find the booking associated with this table
    const booking = bookings.find(booking => booking.tableId === table.id);

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
            <div className={`flex flex-col aspect-square basis-1/5 bg-white border-[3px] ${table.isBooked ? 'border-blue' : 'border-emerald-600'} gap-4 rounded-lg`}>
                <div className='flex justify-around items-center w-full py-4'>
                    <h1 className={`text-center text-5xl font-bold text-black ${table.isBooked ? '' : ''}`}>{table.number}</h1>

                    {table.isBooked ? (
                        <h3 className='text-blue ring-blue px-3 py-1 ring-1 rounded-full bg-blue bg-opacity-15'>
                            Foglalt
                        </h3>
                    ) : (
                        <h3 className='text-emerald-600 ring-emerald-600 px-3 py-1 ring-1 rounded-full bg-emerald-600 bg-opacity-15'>
                            Elérhető
                        </h3>
                    )}
                </div>

                <div className='flex flex-col justify-center items-center px-5'>
                    <h2 className="flex justify-start items-center text-center text-xxl text-gray-500 w-full ml-4">
                        <BsPeople className='mr-4' /> {table.isBooked ? table.tableGuests.length + 1 : table.tableGuests.length}/{table.capacity}
                    </h2>

                    {booking ? (
                        <h2 className="flex justify-start items-center text-center text-xxl text-gray-500 w-full ml-4 my-2">
                            <FiClock className='mr-4' /> {formatTime(booking.bookedFrom)}
                        </h2>
                    ) : (
                        <h2 className="flex justify-start items-center text-center text-xxl text-gray-500 w-full ml-4 my-2">
                            <FiClock className='mr-4 mt-[0.4rem]' /> -
                        </h2>
                    )}

                    <h2 className="flex justify-start items-center text-center text-xxl text-black w-full ml-4">
                        <RiBeerFill className='mr-4' /> {"16.000 Ft"}
                    </h2>
                </div>
            </div>
        </Link>
    );
}
