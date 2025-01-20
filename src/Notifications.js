import React from "react";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import NotificationItem from "./NotificationItem";
import NavItem from "./NavItem";

function Notifications() {
  return (
    <div className="w-full h-screen bg-grey py-8 px-4 text-white flex flex-col overflow-hidden">
        <Link to={"/"}><BackButton/></Link>
        <p className="text-xl font-bold text-center mb-4">Értesítések</p>
        <div className="flex flex-row justify-between font-bold">
            <NavItem title={"Összes"} isNotificationPage={true}/>
            <NavItem title={"Események"} isNotificationPage={true}/>
            <NavItem title={"Barát felkérések"} isNotificationPage={true}/>
        </div>
        <div className="flex flex-col mt-4 gap-y-2 pr-1 overflow-y-auto">
            <NotificationItem />
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
            <NotificationItem isFriendRequest={true}/>
        </div>
    </div>
  );
}

export default Notifications;
