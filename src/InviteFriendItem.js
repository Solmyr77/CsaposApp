import React, { useContext, useEffect, useState } from "react";
import { LuCheck } from "react-icons/lu";
import Context from "./Context";
import UserImage from "./UserImage";

function InviteFriendItem({ friend }) {
    const { setTableFriends, selectedTable, tableFriends } = useContext(Context);
    const [isInvited, setIsInvited] = useState(false);

    useEffect(() => {
        if (selectedTable.capacity - 1 < tableFriends.length) {
            setIsInvited(false);
            setTableFriends([]);
        }
    }, [selectedTable, tableFriends])

    return (
        <div className={`w-full h-16 ${ isInvited ? "border-sky-400" : "border-dark-grey" } bg-dark-grey rounded-lg p-2 flex items-center border-2 justify-between hover:cursor-pointer`} onClick={() => {
            if (selectedTable?.capacity - 1 > tableFriends?.length && Object.hasOwn(selectedTable, "id")) {
                setIsInvited(state => !state);
                setTableFriends(state => state.some(record => record.id === friend?.id) ? state.filter(record => record.id !== friend?.id) : [...state, friend]);
                return;
            }
            setIsInvited(false);
            setTableFriends(state => state.filter(record => record.id !== friend?.id));
            }}>
            <div className="flex items-center gap-2">
                    <UserImage record={friend} width={"w-10"} border/>
                <p className="text-md">{friend.displayName}</p>
            </div>
            {
                isInvited ? 
                <div className="aspect-square rounded-lg bg-gradient-to-tr from-blue to-sky-400 h-6 flex items-center justify-center">
                    <LuCheck/>
                </div> :
                <div className="aspect-square rounded-lg border-2 border-gray-300 h-6 flex"></div>
            }
            
        </div>
  )
}

export default InviteFriendItem;
