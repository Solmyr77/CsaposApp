import React, { useContext, useEffect, useState } from "react";
import Context from "./Context";
import { Link } from "react-router-dom";

function TableNotification({ booking }) {
    const { friends } = useContext(Context);
    const [bookerProfile, setBookerProfile] = useState({});
    const [formattedTime, setFormattedTime] = useState("");

    useEffect(() => {
        if (friends.length > 0) {
            setBookerProfile(friends.find(friend => friend.id === booking.bookerId));
        }
        Object.defineProperty(booking, "sentAt", {value: booking.createdAt});
        setFormattedTime(new Date(booking.sentAt).getDate() === new Date().getDate() ? `Ma ${booking.sentAt.split("T")[1].slice(0, 5)}` : `${booking.sentAt.split("T")[0].slice(5).replace("-", ".")}`);
    }, [friends]);

    return (
        <Link to={`/reservation/${booking.id}`}>
            <div className="flex w-full items-center justify-between bg-dark-grey px-4 py-2 rounded-md relative shadow-md">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-300">{formattedTime}</span>
                    <span className="font-bold text-md bg-gradient-to-t from-blue to-sky-400 bg-clip-text text-transparent">Új asztalmeghívás!</span>
                    <span className="text-sm text-gray-300">Részletekért koppints!</span>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="avatar">
                        <div className="h-10 rounded-full border-2">
                            <img src={`https://assets.csaposapp.hu/assets/images/${bookerProfile?.imageUrl}`} alt="kép" />
                        </div>
                    </div>
                    <span>{bookerProfile?.displayName}</span>
                </div>
            </div>
        </Link>
  )
}

export default TableNotification;
