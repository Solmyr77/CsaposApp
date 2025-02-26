import React, { forwardRef } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import SearchBar from "./SearchBar";
import { useState } from "react";
import TitleDivider from "./TitleDivider";
import AddFriendItem from "./AddFriendItem";

const AddFriendModal = forwardRef((props, ref) => {
  const [recordsToDisplay, setRecordsToDisplay] = useState([]);

  return (
    <dialog className="modal" ref={ref}>
      <div className={`w-80 min-h-80 h-96 bg-grey rounded-xl flex flex-col sticky modal-box py-2 px-4`}>
        <XMarkIcon className="absolute left-0 top-0 w-9 text-red-500 font-bold bg-dark-grey p-1 rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-md hover:cursor-pointer" onClick={() => ref.current.close()}/>
        <p className="text-md text-center mb-6">Barát hozzáadása</p>
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
      <form method="dialog" className="modal-backdrop"><button></button></form>
    </dialog>
  )
})

export default AddFriendModal;
