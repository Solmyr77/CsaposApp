import React, { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import records from "./records";

function SearchBar({ displayTitle, setRecordsToDisplay }) {
  const [searchValue, setSearchValue] = useState("");

  function handleSearch(event) {
    setSearchValue(event.target.value);
    const filteredRecords = records.filter(record => record.name.toLowerCase().includes(event.target.value.toLowerCase()));
    setRecordsToDisplay(filteredRecords);
  }
  
  return (
    <div className="w-full mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,.5)]">
        <h1 className={`pt-4 mb-2 text-xl ${displayTitle ? "block" : "hidden"}`}>Keresés</h1>
        <div className="relative">
            {
              searchValue.trim() == "" ? 
              <MagnifyingGlassIcon className="h-6 absolute right-3 top-1/2 -translate-y-1/2"/> :
              <XMarkIcon className="h-6 absolute right-3 top-1/2 -translate-y-1/2 text-red-500" onClick={() => {
                setSearchValue("")
                setRecordsToDisplay(records);
              }}/>
            }
            <input type="text" className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-full font-normal focus:outline-none" placeholder="Keresés" onChange={(event) => handleSearch(event)} value={searchValue}/>
        </div>
    </div>
  )
}

export default SearchBar;