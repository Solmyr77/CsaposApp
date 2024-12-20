import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import records from "./records";

function SearchBar({ setRecordsToDisplay }) {
  function handleSearch(event) {
    const searchValue = event.target.value;
    const filteredRecords = records.filter(record => record.name.toLowerCase().includes(searchValue.toLowerCase()));
    setRecordsToDisplay(filteredRecords);
  }

  return (
    <div className="w-full mb-8">
        <h1 className="pt-4 mb-2 text-xl">Felfedezés</h1>
        <div className="relative">
            <MagnifyingGlassIcon className="h-6 absolute right-3 top-1/2 -translate-y-1/2"/>
            <input type="text" className="w-full bg-dark-grey pl-5 pr-10 py-2 rounded-full font-normal" placeholder="Keresés" onChange={(event) => handleSearch(event)}/>
        </div>
    </div>
  )
}

export default SearchBar;
