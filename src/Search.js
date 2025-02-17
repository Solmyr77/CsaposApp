import React, { useState } from "react";
import TitleDivider from "./TitleDivider";
import SearchBar from "./SearchBar";
import CardContainer from "./CardContainer";
import Context from "./Context";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Search() {
  const { setMenuState, locations, setPreviousRoutes } = useContext(Context);
  const [recordsToDisplay, setRecordsToDisplay] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setMenuState("Search");
    setRecordsToDisplay(locations);
    setPreviousRoutes(Array(location.pathname));
  }, [locations]);

  return (
    <div className="bg-grey font-play font-bold text-white">
      <div className="px-4">
        <SearchBar displayTitle={true} setRecordsToDisplay={setRecordsToDisplay} locationSearch/>
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