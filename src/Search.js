import React, { useState } from "react";
import TitleDivider from "./TitleDivider";
import SearchBar from "./SearchBar";
import CardContainer from "./CardContainer";
import Context from "./Context";
import { useContext, useEffect } from "react";
import axios from "axios";
import getAccessToken from "./refreshToken";

function Search() {
  const { setMenuState, setLocations } = useContext(Context);
  const [recordsToDisplay, setRecordsToDisplay] = useState([]);

  async function getLocations() {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get("https://backend.csaposapp.hu/api/locations", config);
      const data = response.data;
      setLocations(data);
      setRecordsToDisplay(data);
      return true;
    }
    catch (error) {
      if (error.response?.status === 401) {
        return false;
      } 
      else {
        console.error("Error fetching locations:", error.message);
        return false;
      }
    }
  }

  useEffect(() => {
    setMenuState("Search");
    const fetchData = async () => {
      let isSucceeded = await getLocations();
      while (isSucceeded === false) {
        await getAccessToken();
        isSucceeded = await getLocations();
      }
    }
    fetchData();
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