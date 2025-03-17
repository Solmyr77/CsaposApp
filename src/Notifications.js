import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import NotificationItem from "./NotificationItem";
import NavItem from "./NavItem";
import Context from "./Context";
import TableNotification from "./TableNotification";

function Notifications() {
    const { friendRequests, notificationFilter, previousRoutes, addedToTableNotifications } = useContext(Context);
    const [recordsToDisplay, setRecordsToDisplay] = useState([]);
    const eventRecords = [""];

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
    }, [notificationFilter, friendRequests, addedToTableNotifications]);

  return (
    <div className="w-full h-screen bg-grey py-8 px-4 text-white flex flex-col overflow-hidden">
        <Link to={previousRoutes[previousRoutes.length - 1]} className="flex w-fit">
            <BackButton/>
        </Link>
        <p className="text-xl font-bold text-center mb-4">Értesítések</p>
        <div className="flex flex-row justify-between font-bold">
            <NavItem key="Összes" title={"Összes"} isNotificationPage/>
            <NavItem key="Események" title={"Események"} isNotificationPage/>
            <NavItem key="Barátkérelmek" title={"Barátkérelmek"} isNotificationPage/>
        </div>
        <div className="flex flex-grow flex-col mt-4 gap-y-2 pr-1 overflow-y-auto">
            {
                addedToTableNotifications.length > 0 && addedToTableNotifications.map((booking) => <TableNotification key={booking.id} booking={booking}/>)
            }
            {
                recordsToDisplay.map((record, i) => <NotificationItem key={i} record={record} isFriendRequest={Object.hasOwn(record, "id")}/>)
            }
        </div>
    </div>
  );
}

export default Notifications;
