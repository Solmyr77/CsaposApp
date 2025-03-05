import React, { useContext, useEffect, useMemo, useState } from "react";
import AvatarGroupItem from "./AvatarGroupItem";
import Context from "./Context";
import { Link } from "react-router-dom";
import { LuCalendar, LuClock, LuMapPin, LuUsers } from "react-icons/lu"

function ReservationItem({ booking, isGuest }) {
    const { locations, removeBooking, setBookings, friends } = useContext(Context);
    const [tableGuests, setTableGuests] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({});

    const bookerProfile = useMemo(() => friends.find(friend => friend.id === booking.bookerId), [friends]);

    useEffect(() => {
        if (locations.length > 0) setCurrentLocation(locations.find(location => location.id === booking.locationId));
        if (booking.tableGuests) {
            setTableGuests(booking.tableGuests);
            const bookedFrom = new Date(booking.bookedFrom);
            const expiryTime = new Date(bookedFrom);
            expiryTime.setMinutes(bookedFrom.getMinutes() + 20, 0);
            if (new Date().getTime() >= expiryTime.getTime()) !isGuest ? removeBooking(booking.id) : setBookings(state => state.filter(record => record.id !== booking.id));
            else {
                const timeout = setTimeout(async () => {
                    !isGuest ? await removeBooking(booking.id) : setBookings(state => state.filter(record => record.id !== booking.id));
                }, expiryTime.getTime() - new Date().getTime());
                return () => clearTimeout(timeout);
            }
        }
    }, [locations])

    return (
        <Link to={`/reservation/${booking.id}`}>
            <div className="flex items-start w-full h-32 bg-gradient-to-tr from-blue to-sky-400 rounded-md pl-4 pr-5 pt-3 pb-2 select-none">
                <div className="flex flex-col h-full basis-2/3 justify-between">
                    <div>
                        <div className={`${isGuest ? "flex" : "hidden"} items-center gap-1 text-xs`}>
                            <span className="badge bg-opacity-20 border-0 text-white text-xs">Foglalta:</span>
                            <div className="avatar border-2 rounded-full border-white">
                                <div className="w-4 rounded-full">
                                    <img src={`https://assets.csaposapp.hu/assets/images/${bookerProfile?.imageUrl}`} alt="kép" />
                                </div>
                            </div>
                            <p>{bookerProfile?.displayName}</p>
                        </div>
                        <p className="text-lg line-clamp-2">{currentLocation.name}</p>
                        <div className="flex text-gray-300 text-sm items-center font-normal gap-1">
                            <LuMapPin/>
                            <p className="line-clamp-1">{currentLocation.address?.split(" ")[1].replace(",", "")}</p>
                        </div>
                    </div>
                    <div className="flex text-gray-300 items-center font-normal gap-1 text-sm">
                        <LuUsers/>
                        <p>{tableGuests.length + 1} fő</p>
                    </div>
                </div>
                <div className="flex flex-col basis-1/3 h-full justify-between">
                    <div className="flex flex-col items-end justify-center">
                        <div className="flex items-center gap-1">
                            <LuCalendar/>
                            <p className="">{booking.bookedFrom.split("-")[1]}.{booking.bookedFrom.split("-")[2].split("T")[0]}.</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <LuClock/>
                            <p className="">{booking.bookedFrom.split("T")[1].substring(0, 5)}</p>
                        </div>
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
