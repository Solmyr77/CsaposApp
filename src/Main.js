import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";
import CardContainer from "./CardContainer";
import Context from "./Context";
import axios from "axios";
import getAccessToken from "./refreshToken";

function Main() {
  const { navState, setMenuState, locations, setLocations } = useContext(Context);

  async function getLocations() {
    try {
      const config = {
        headers: { Authorization : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}` }
      }
      const response = await axios.get("https://backend.csaposapp.hu/api/locations", config);
      const data = response.data;
      setLocations(data);
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

  function decodeJWT(token) {
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  useEffect(() => {
    setMenuState("Main");
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