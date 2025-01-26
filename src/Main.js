import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";
import CardContainer from "./CardContainer";
import Context from "./Context";
import { useLocation } from "react-router-dom";

function Main() {
  const { navState, setMenuState, locations, setPreviousRoutes } = useContext(Context);
  const location = useLocation();

  useEffect(() => {
    setMenuState("Main");
    setPreviousRoutes(Array(location.pathname));
  }, [])

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