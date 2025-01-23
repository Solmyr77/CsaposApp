import React, { useState } from "react";
import TitleDivider from "./TitleDivider";
import SearchBar from "./SearchBar";
import CardContainer from "./CardContainer";
import Context from "./Context";
import { useContext, useEffect } from "react";

function Search() {
  const { setMenuState, locations } = useContext(Context);
  const [recordsToDisplay, setRecordsToDisplay] = useState([]);

  useEffect(() => {
    setMenuState("Search");
    setRecordsToDisplay(locations);
  }, [locations]);

  return (
    <div className="bg-grey font-play font-bold text-white">
      <div className="px-4">
        <SearchBar displayTitle={true} setRecordsToDisplay={setRecordsToDisplay} />
        <TitleDivider title={"Legutóbbi"}/>
        {
          recordsToDisplay.length !== 0 ? 
          (
            <div>
              <CardContainer records={recordsToDisplay} cardsToShow={"Összes"}/>
            </div>
          ) :
          (
            <div className="font-normal text-center">
              Nincs találat
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Search;