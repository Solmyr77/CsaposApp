import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import NotificationItem from "./NotificationItem";
import NavItem from "./NavItem";
import Context from "./Context";

function Notifications() {
    const [recordsToDisplay, setRecordsToDisplay] = useState([]);
    const { notificationFilter } = useContext(Context);

    const friendRecords = Array(1).fill(<NotificationItem isFriendRequest={true}/>);
    const eventRecords = Array(1).fill(<NotificationItem/>);
    
    useEffect(() => {
        switch (notificationFilter) {
            case "Összes":
                setRecordsToDisplay(friendRecords.concat(eventRecords));
                break;
            case "Események":
                setRecordsToDisplay(eventRecords);
                break;
            case "Barát felkérések":
                setRecordsToDisplay(friendRecords);
                break;
        }
    }, [notificationFilter]);

  return (
    <div className="w-full h-screen bg-grey py-8 px-4 text-white flex flex-col overflow-hidden">
        <Link to={"/"} className="flex w-fit">
            <BackButton/>
        </Link>
        <p className="text-xl font-bold text-center mb-4">Értesítések</p>
        <div className="flex flex-row justify-between font-bold">
            <NavItem title={"Összes"} isNotificationPage={true}/>
            <NavItem title={"Események"} isNotificationPage={true}/>
            <NavItem title={"Barát felkérések"} isNotificationPage={true}/>
        </div>
        <div className="flex flex-col mt-4 gap-y-2 pr-1 overflow-y-auto">
            {
                recordsToDisplay.map(record => record)
            }
        </div>
    </div>
  );
}

export default Notifications;
