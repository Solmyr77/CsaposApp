import React, { useContext, useEffect, useState } from "react";
import Context from "./Context";
import { Link } from "react-router-dom";

function TableNotification({ booking }) {
    const { friends } = useContext(Context);
    const [bookerProfile, setBookerProfile] = useState({});

    useEffect(() => {
        if (friends.length > 0) {
            setBookerProfile(friends.find(friend => friend.id === booking.bookerId));
        } 
    }, [friends]);

    return (
        <Link to={`/reservation/${booking.id}`}>
            <div className="flex w-full items-center justify-between bg-dark-grey px-4 py-2 rounded-md shadow-md">
                <div className="flex flex-col">
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
