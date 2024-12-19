import React from "react";
import TitleDivider from "./TitleDivider";
import SearchBar from "./SearchBar";
import CardContainer from "./CardContainer";
import records from "./records";

function Search() {
  return (
    <div className="bg-grey w-screen font-play font-bold text-white">
        <div className="px-4">
            <SearchBar/>
            <TitleDivider title={"Legutóbbi"}/>
            <CardContainer records={records.slice(1, 3)} cardsToShow={"Összes"}/>
        </div>
    </div>
  )
}

export default Search;