import React, { useContext, useEffect, useState } from "react";
import { LuCheck } from "react-icons/lu";
import Context from "./Context";

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
        <div className={`w-full h-16 ${ isInvited ? "border-2" : "border-0" } bg-dark-grey rounded-lg p-2 flex items-center border-sky-400 justify-between hover:cursor-pointer`} onClick={() => {
            if (selectedTable?.capacity - 1 > tableFriends?.length && Object.hasOwn(selectedTable, "id")) {
                setIsInvited(state => !state);
                setTableFriends(state => state.some(record => record.id === friend?.id) ? state.filter(record => record.id !== friend?.id) : [...state, friend]);
                return;
            }
            setIsInvited(false);
            setTableFriends(state => state.filter(record => record.id !== friend?.id));
            }}>
            <div className="flex items-center gap-2">
                <div className="avatar">
                <div className="w-10 rounded-lg">
                    <img src={`https://assets.csaposapp.hu/assets/images/${friend?.imageUrl}`} alt="kép"/>
                </div>
                </div>
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
