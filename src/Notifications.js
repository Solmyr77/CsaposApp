import React, { useContext, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import NotificationItem from "./NotificationItem";
import Context from "./Context";
import TableNotification from "./TableNotification";
import { LuFilter } from "react-icons/lu";

function Notifications() {
    const { friendRequests, previousRoutes, bookingsContainingUser, user, setNewNotification } = useContext(Context);
    const [recordsToDisplay, setRecordsToDisplay] = useState([]);
    const [notificationFilter, setNotificationFilter] = useState("Összes");
    const eventRecords = [];
    const [isOpen, setIsOpen] = useState(false);

    const filteredBookings = useMemo(() => bookingsContainingUser.filter(booking => booking.tableGuests.find(guest => guest.id === user.id).status === "pending"), [bookingsContainingUser, user]);

    useEffect(() => {
        setNewNotification(false);
        switch (notificationFilter) {
            case "Összes":
                setRecordsToDisplay(friendRequests.concat(eventRecords).concat(filteredBookings));
                break;
            case "Meghívók":
                setRecordsToDisplay(filteredBookings);
                break;
            case "Barátkérelmek":
                setRecordsToDisplay(friendRequests);
                break;
            case "Események":
                setRecordsToDisplay(eventRecords);
                break;
        }
    }, [notificationFilter, friendRequests, filteredBookings]);

  return (
    <div className="w-full h-screen bg-grey py-8 px-4 text-white flex flex-col overflow-hidden">
        <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
            <BackButton/>
        </Link>
        <p className="text-xl font-bold text-center mb-4">Értesítések</p>
        <div className="flex justify-end">
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className={`btn min-h-0 h-10 mb-1 ${notificationFilter !== "Összes" && "bg-gradient-to-tr from-blue to-sky-400"} bg-dark-grey text-white border-0 hover:bg-dark-grey`} onClick={() => setIsOpen(true)}><LuFilter/> {notificationFilter}</div>
                {
                    isOpen && 
                    <ul tabIndex={0} className="dropdown-content menu bg-dark-grey font-bold rounded-box z-[1] w-52 p-2 shadow gap-1">
                        <li onClick={() => {
                            setNotificationFilter("Összes");
                            setIsOpen(false);
                        }}><a className={`${notificationFilter === "Összes" && "bg-gradient-to-tr from-blue to-sky-400"} hover:bg-gradient-to-tr from-blue to-sky-400`}>Összes</a></li>
                        <li onClick={() => {
                            setNotificationFilter("Meghívók");
                            setIsOpen(false);
                        }}><a className={`${notificationFilter === "Meghívók" && "bg-gradient-to-tr from-blue to-sky-400"} hover:bg-gradient-to-tr from-blue to-sky-400`}>Meghívók</a></li>
                        <li onClick={() => {
                            setNotificationFilter("Barátkérelmek");
                            setIsOpen(false);
                        } }><a className={`${notificationFilter === "Barátkérelmek" && "bg-gradient-to-tr from-blue to-sky-400"} hover:bg-gradient-to-tr from-blue to-sky-400`}>Barátkérelmek</a></li>
                        <li onClick={() => {
                            setNotificationFilter("Események");
                            setIsOpen(false);
                        }}><a className={`${notificationFilter === "Események" && "bg-gradient-to-tr from-blue to-sky-400"} hover:bg-gradient-to-tr from-blue to-sky-400`}>Események</a></li>
                    </ul>
                }
            </div>
        </div>
        <div className="flex flex-grow flex-col mt-4 pr-1 overflow-y-auto">
            {
                recordsToDisplay.length > 0 ?
                <div className="flex flex-grow flex-col gap-y-2 pr-1 overflow-y-auto">
                    {
                        recordsToDisplay.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
                        .map((record, i) => {
                            console.log(recordsToDisplay);
                            if (record.tableId) return <TableNotification key={record.id} booking={record}/>
                            else return <NotificationItem key={i} record={record} isFriendRequest={Object.hasOwn(record, "userId1")}/>
                        })
                    }
                </div> : 
                <div className="flex w-full h-full justify-center items-center">
                    <span className="text-gray-300">Nincs értesítés</span>
                </div>
            }
        </div>
    </div>
  );
}

export default Notifications;
