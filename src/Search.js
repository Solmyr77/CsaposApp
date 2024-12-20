import React from "react";
import TitleDivider from "./TitleDivider";
import SearchBar from "./SearchBar";
import CardContainer from "./CardContainer";
import records from "./records";
import { useState } from "react";

function Search() {
  const [recordsToDisplay, setRecordsToDisplay] = useState(records);

  return (
    <div className="bg-grey w-screen font-play font-bold text-white">
        <div className="px-4">
            <SearchBar setRecordsToDisplay={setRecordsToDisplay} />
            <TitleDivider title={"Legutóbbi"}/>
            <CardContainer records={recordsToDisplay} cardsToShow={"Összes"}/>
        </div>
    </div>
  )
}

export default Search;