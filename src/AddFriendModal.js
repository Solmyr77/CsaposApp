import React, { useContext, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import SearchBar from "./SearchBar";
import { useState } from "react";
import TitleDivider from "./TitleDivider";
import Context from "./Context";
import AddFriendItem from "./AddFriendItem";

function AddFriendModal({ isAddFriendModalVisible, setIsAddFriendModalVisible }) {
  const { user } = useContext(Context);
  const [recordsToDisplay, setRecordsToDisplay] = useState([]);

  return (
    <div className={`w-full min-h-screen h-full absolute top-0 left-0 bg-opacity-65 bg-black ${isAddFriendModalVisible ? "flex" : "hidden"} justify-center items-center`}>
      <div className={`w-80 min-h-80 h-96 bg-grey rounded-xl flex flex-col relative px-4`}>
        <XMarkIcon className="absolute left-0 top-0 w-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => setIsAddFriendModalVisible(false)}/>
        <p className="text-md pt-4 text-center mb-6">Barát hozzáadása</p>
        <SearchBar displayTitle={false} setRecordsToDisplay={setRecordsToDisplay} friendSearch/>
        <TitleDivider title={"Találatok"}/>
        <div className="overflow-y-scroll pl-2">
          { recordsToDisplay.length !== 0 ? (
            recordsToDisplay.map((record) => {
              if (record === recordsToDisplay[recordsToDisplay.length - 1]) {
                return (
                  <div className="mb-2">
                    <AddFriendItem record={record}/>
                  </div>
                );
              }
              return (
                <div>
                  <AddFriendItem record={record}/>
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
  )
}

export default AddFriendModal;
