import React, { useContext, useEffect, useState } from "react";
import Context from "./Context";
import { XMarkIcon } from "@heroicons/react/20/solid";
import SearchBar from "./SearchBar";
import TitleDivider from "./TitleDivider";
import AddFriendItem from "./AddFriendItem";

function AddFriendToTableModal({ isModalVisible, setIsModalVisible }) {
    const { user, locations } = useContext(Context);
    const [recordsToDisplay, setRecordsToDisplay] = useState(locations);

    useEffect(() => {
        if (locations.length > 0) {
        setRecordsToDisplay(locations);
        }
    }, [locations]);

    return (
    <div className={`w-full min-h-screen h-full absolute top-0 left-0 bg-opacity-65 bg-black ${isModalVisible ? "flex" : "hidden"} justify-center items-center z-20`}>
      <div className={`w-80 min-h-80 h-96 bg-grey rounded-xl flex flex-col relative px-4`}>
        <XMarkIcon className="absolute left-0 top-0 w-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => setIsModalVisible(false)}/>
        <p className="text-md pt-4 text-center mb-6">Barát meghívása</p>
        <SearchBar displayTitle={false} setRecordsToDisplay={setRecordsToDisplay}/>
        <TitleDivider title={"Találatok"}/>
        <div className="overflow-y-scroll pl-2">
        { recordsToDisplay.length !== 0 ? (
            recordsToDisplay.sort((a, b) => a.name.localeCompare(b.name)).map((record) => {
                if (record === recordsToDisplay[recordsToDisplay.length - 1]) {
                return (
                    <div className="mb-2">
                        <AddFriendItem record={record} plusIcon/>
                    </div>
                );
                }
                return (
                <div>
                    <AddFriendItem record={record} plusIcon/>
                    <hr className="h-0.5 my-2 w-full bg-dark-grey border-0 rounded-md"/>
                </div>
                );
                })
            ) :
            (
                <div className="font-normal text-center">
                    Nincs találat
                </div>
            )
        }
        </div>
      </div>
    </div>
  );
}

export default AddFriendToTableModal;
