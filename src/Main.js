import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";
import CardContainer from "./CardContainer";
import records from "./records";
import Context from "./Context";
import axios from "axios";

function Main() {
  const { navState, setMenuState, locations, setLocations } = useContext(Context);

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
    setMenuState("Main");
    try {
      getLocations();
    } 
    catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="bg-grey text-white font-play font-bold">
        <div className="px-4 overflow-auto pb-[12vh]">
          <Navbar/>
          <TitleDivider title={"Kiemelt"}/>
          <StyledSwiper/>
          <TitleDivider title={navState}/>
          <CardContainer records={locations} cardsToShow={navState}/>
        </div>
      </div>
  );
}

export default Main;