import React, { useContext, useEffect, useState } from "react";
import { CalendarIcon, ClockIcon }  from "@heroicons/react/24/outline"
import AvatarGroupItem from "./AvatarGroupItem";
import Context from "./Context";
import { Link } from "react-router-dom";

function ReservationItem({ booking }) {
    const { locations, removeBooking } = useContext(Context);
    const [tableGuests, setTableGuests] = useState([]);

    useEffect(() => {
        if (booking.tableGuests) {
            setTableGuests(booking.tableGuests);
            const bookedFrom = new Date(booking.bookedFrom);
            const expiryTime = new Date(bookedFrom);
            expiryTime.setMinutes(bookedFrom.getMinutes() + 20, 0);
            if (new Date().getTime() >= expiryTime.getTime()) removeBooking(booking.id);
            else {
                const timeout = setTimeout(async () => {
                    await removeBooking(booking.id);
                }, expiryTime.getTime() - new Date().getTime());
                return () => clearTimeout(timeout);
            }
        }
    }, [])

    return (
        <Link to={`/reservation/${booking.id}`}>
            <div className="flex items-center w-full h-28 bg-gradient-to-tr from-blue to-sky-400 rounded-md pl-4 pr-5 pt-3 pb-2 select-none">
                <p className="text-lg basis-3/5 line-clamp-2">{locations.length > 0 && locations.find(location => location.id === booking.locationId).name}</p>
                <div className="flex flex-col basis-2/5 h-full justify-between">
                    <div className="flex font-normal text-md gap-x-2 justify-end">
                        <p className="flex flex-nowrap"><CalendarIcon className="w-6 mr-1"/>{booking.bookedFrom.split("-")[1]}.{booking.bookedFrom.split("-")[2].split("T")[0]}.</p>
                        <p className="flex flex-nowrap"><ClockIcon className="w-6 mr-1"/>{String(booking.bookedFrom.split("-")[2].split("T")[1]).substring(0, 5)}</p>
                    </div>
                    <div className="avatar-group -space-x-4 rtl:space-x-reverse justify-end">
                        {
                            tableGuests.length > 0 && Array.from(tableGuests).map((tableGuest, i) => {
                                if (i < 4) return <AvatarGroupItem height="h-10" imageUrl={tableGuest.imageUrl}/>
                                else if (i === 4) return (
                                    <div className="avatar h-10 aspect-square border-2 placeholder">
                                        <div className="bg-neutral text-neutral-content w-12">
                                            <span>+{Number(tableGuests?.length) - 4}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ReservationItem;
