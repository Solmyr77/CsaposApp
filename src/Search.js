import React, { useState } from "react";
import TitleDivider from "./TitleDivider";
import SearchBar from "./SearchBar";
import CardContainer from "./CardContainer";
import Context from "./Context";
import { useContext, useEffect } from "react";
import axios from "axios";

function Search() {
  const { setMenuState, locations, setLocations } = useContext(Context);
  const [recordsToDisplay, setRecordsToDisplay] = useState(locations);

  async function getLocations() {
    const config = {
      headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
    }
    const response = await axios.get("https://backend.csaposapp.hu/api/locations", config);
    const data = response.data;
    console.log(data);
    setLocations(data);
  }

  useEffect(() => {
    setMenuState("Search");
    try {
      getLocations();
    } 
    catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="bg-grey font-play font-bold text-white">
      <div className="px-4">
        <SearchBar displayTitle={true} setRecordsToDisplay={setRecordsToDisplay} />
        <TitleDivider title={"Legutóbbi"}/>
        <CardContainer records={recordsToDisplay} cardsToShow={"Összes"}/>
      </div>
    </div>
  )
}

export default Search;