import React, { useContext, useEffect } from "react";
import { CalendarIcon, ClockIcon }  from "@heroicons/react/24/outline"
import AvatarGroupItem from "./AvatarGroupItem";
import Context from "./Context";

function ReservationItem() {
    const { bookings } = useContext(Context);

    useEffect(() => {
        if (bookings.length > 0) {
            console.log(bookings);
        }
    }, [bookings]);
    

    return (
        <div className="flex items-center w-full h-28 bg-gradient-to-tr from-blue to-sky-500 rounded-md pl-4 pr-5 pt-3 pb-2">
            <p className="text-lg basis-3/5">Félidő Söröző</p>
            <div className="flex flex-col basis-2/5 h-full justify-between">
                <div className="flex font-normal text-md gap-x-2 justify-end">
                    <p className="flex flex-nowrap"><CalendarIcon className="w-6 mr-1"/>02.17.</p>
                    <p className="flex flex-nowrap"><ClockIcon className="w-6 mr-1"/>19:00</p>
                </div>
                <div className="avatar-group -space-x-4 rtl:space-x-reverse justify-end">
                    {
                        bookings.length > 0 && bookings.map((_, i) => i < 4 ? <AvatarGroupItem/> : 
                            <div className="avatar h-10 aspect-square border-2 placeholder">
                                <div className="bg-neutral text-neutral-content w-12">
                                    <span>+1</span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ReservationItem;
