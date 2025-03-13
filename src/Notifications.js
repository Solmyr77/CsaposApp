import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import NotificationItem from "./NotificationItem";
import NavItem from "./NavItem";
import Context from "./Context";
import bookingConnection from "./signalRBookingConnection";

function Notifications() {
    const { friendRequests, notificationFilter, previousRoutes } = useContext(Context);
    const [recordsToDisplay, setRecordsToDisplay] = useState([]);
    const eventRecords = [""];

    useEffect(() => {
        bookingConnection.start()
        .then(() => console.log("Connected to notification hub"))
        .catch(() => console.log("nemjo"));
        
            bookingConnection.on("NotifyAddedToTable", (message) => console.log(message));
    }, [])

    useEffect(() => {
        switch (notificationFilter) {
            case "Összes":
                setRecordsToDisplay(friendRequests.concat(eventRecords));
                break;
            case "Események":
                setRecordsToDisplay(eventRecords);
                break;
            case "Barát felkérések":
                setRecordsToDisplay(friendRequests);
                break;
        }
    }, [notificationFilter, friendRequests]);

  return (
    <div className="w-full h-screen bg-grey py-8 px-4 text-white flex flex-col overflow-hidden">
        <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
            <BackButton/>
        </Link>
        <p className="text-xl font-bold text-center mb-4">Értesítések</p>
        <div className="flex flex-row justify-between font-bold">
            <NavItem title={"Összes"} isNotificationPage={true}/>
            <NavItem title={"Események"} isNotificationPage={true}/>
            <NavItem title={"Barátkérelmek"} isNotificationPage={true}/>
        </div>
        <div className="flex flex-grow flex-col mt-4 gap-y-2 pr-1 overflow-y-auto">
            <div className="flex w-full items-center justify-between bg-dark-grey px-4 py-2 rounded-md drop-shadow-[0px_4px_4px_rgba(0,0,0,.5)]">
                <div className="flex flex-col">
                    <span className="font-bold text-md bg-gradient-to-t from-blue to-sky-400 bg-clip-text text-transparent">Új asztalmeghívás!</span>
                    <span className="text-sm text-gray-300">Részletekért koppints!</span>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="avatar">
                        <div className="h-10 rounded-full border-2">
                            <img src="https://thispersondoesnotexist.com" alt="kép" />
                        </div>
                    </div>
                    <span>adminferi</span>
                </div>
            </div>
            {
                recordsToDisplay.map(record => Object.hasOwn(record, "id") ? (
                    <div>
                        <NotificationItem record={record} isFriendRequest/>
                    </div>
                ) :
                (
                    <div>
                        <NotificationItem/>
                    </div> 
                ))
            }
        </div>
    </div>
  );
}

export default Notifications;
